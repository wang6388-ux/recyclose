"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter, useSearchParams } from "next/navigation";
import BottomSheet from "@/components/BottomSheet";
import DropoffList, { type DropoffPoint as ListPoint } from "@/components/DropoffList";

console.log("MAPBOX TOKEN =", process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

type DropoffPoint = {
  id: string;
  name: string;
  tags: string[];
  lng: number;
  lat: number;
};

// 你可以按需要增删
const FILTER_TAGS = [
  { key: "paper", label: "Paper" },
  { key: "cardboard", label: "Cardboard" },
  { key: "plastic", label: "Plastic" },
  { key: "metal", label: "Metal" },
  { key: "glass", label: "Glass" },
  { key: "battery", label: "Battery" },
  { key: "electronics", label: "Electronics" },
  { key: "donation", label: "Donation" },
  { key: "clothes", label: "Clothes" },
] as const;

const FIXED_QUERY = "recycling center";
const DEFAULT_CENTER = { lng: -122.3321, lat: 47.6062 };

function normalizeQuery(q: string | null) {
  const s = (q ?? "").trim().toLowerCase();
  return s.length ? s : null;
}

function parseTagsParam(raw: string | null): Set<string> {
  const s = (raw ?? "").trim();
  if (!s) return new Set();
  return new Set(
    s
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
  );
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversineMeters(a: { lng: number; lat: number }, b: { lng: number; lat: number }) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const x = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

type GeocodingResponse = {
  features?: Array<{
    id?: string;
    text?: string;
    place_name?: string;
    center?: [number, number];
  }>;
};

// 非严格但够用：根据名字做粗分类，后续我们再升级
function inferTagsFromName(name: string): string[] {
  const s = name.toLowerCase();
  const tags = new Set<string>();

  // 通用
  tags.add("recycling");

  if (s.includes("battery")) tags.add("battery");
  if (s.includes("electronic") || s.includes("e-waste") || s.includes("ewaste")) tags.add("electronics");
  if (s.includes("donat")) tags.add("donation");
  if (s.includes("clothes") || s.includes("clothing")) tags.add("clothes");
  if (s.includes("paper")) tags.add("paper");
  if (s.includes("cardboard") || s.includes("box")) tags.add("cardboard");
  if (s.includes("plastic")) tags.add("plastic");
  if (s.includes("glass")) tags.add("glass");
  if (s.includes("metal")) tags.add("metal");

  return Array.from(tags);
}

async function fetchMapboxDropoffs(opts: {
  token: string;
  center: { lng: number; lat: number };
  signal?: AbortSignal;
}): Promise<DropoffPoint[]> {
  const { token, center, signal } = opts;

  // ✅ Mapbox Geocoding API (forward)
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(FIXED_QUERY)}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "20");
  url.searchParams.set("proximity", `${center.lng},${center.lat}`);
  url.searchParams.set("types", "poi");

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mapbox fetch failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as GeocodingResponse;

  const items: DropoffPoint[] = [];
  for (const f of json.features ?? []) {
    const id = String(f.id ?? "");
    const name = String(f.text ?? f.place_name ?? "Unknown");
    const coords = f.center;
    const lng = coords ? Number(coords[0]) : NaN;
    const lat = coords ? Number(coords[1]) : NaN;

    if (!id || !Number.isFinite(lng) || !Number.isFinite(lat)) continue;

    items.push({
      id,
      name,
      tags: inferTagsFromName(name),
      lng,
      lat,
    });
  }

  return items;
}

export default function DropoffPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sheetSnap, setSheetSnap] = useState<"collapsed" | "half" | "full">("half");

  // URL 状态
  const q = normalizeQuery(searchParams.get("q"));
  const queryFromUrl = searchParams.get("q") ?? "";
  const selectedTags = useMemo(() => parseTagsParam(searchParams.get("tags")), [searchParams]);

  // 输入框（仅用于 UI 显示 + debounce 写回 URL）
  const [inputValue, setInputValue] = useState(queryFromUrl);
  const debounceRef = useRef<number | null>(null);

  // 如果用户通过其它页面跳转带 q 进来，输入框要对齐一次
  useEffect(() => {
    if (inputValue === queryFromUrl) return;
    queueMicrotask(() => setInputValue(queryFromUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFromUrl]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const markersRef = useRef<
    Record<string, { marker: mapboxgl.Marker; popup: mapboxgl.Popup; el: HTMLDivElement; point: DropoffPoint }>
  >({});

  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const [userLoc, setUserLoc] = useState<{ lng: number; lat: number } | null>(null);

  const [rawPoints, setRawPoints] = useState<DropoffPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [activeIdRaw, setActiveIdRaw] = useState<string | null>(null);

  const activeCenter = userLoc ?? DEFAULT_CENTER;

  // 拉真实数据：center 变时刷新
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setErrMsg("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }

    const ctrl = new AbortController();
    setLoading(true);
    setErrMsg(null);

    fetchMapboxDropoffs({ token, center: activeCenter, signal: ctrl.signal })
      .then((pts) => setRawPoints(pts))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
        setErrMsg(msg);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [activeCenter.lng, activeCenter.lat]);

  // ✅ 过滤：tags -> q
  const points = useMemo(() => {
    let base = rawPoints;

    if (selectedTags.size > 0) {
      base = base.filter((p) => p.tags.some((t) => selectedTags.has(t.toLowerCase())));
    }

    if (!q) return base;

    return base.filter((p) => {
      const inName = p.name.toLowerCase().includes(q);
      const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
      return inName || inTags;
    });
  }, [rawPoints, q, selectedTags]);

  const activeId = useMemo(() => {
    if (!activeIdRaw) return null;
    return points.some((p) => p.id === activeIdRaw) ? activeIdRaw : null;
  }, [activeIdRaw, points]);

  // 列表：带距离并排序（有 userLoc 才排序）
  const listPoints: ListPoint[] = useMemo(() => {
    const withDist: ListPoint[] = points.map((p) => {
      const distanceMeters = userLoc ? haversineMeters(userLoc, { lng: p.lng, lat: p.lat }) : null;
      return { id: p.id, name: p.name, tags: p.tags, distanceMeters };
    });

    if (!userLoc) return withDist;

    return [...withDist].sort((a, b) => {
      const da = a.distanceMeters ?? Number.POSITIVE_INFINITY;
      const db = b.distanceMeters ?? Number.POSITIVE_INFINITY;
      return da - db;
    });
  }, [points, userLoc]);

  // 初始化地图（只做一次）
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    map.on("click", () => setActiveIdRaw(null));

    return () => {
      Object.values(markersRef.current).forEach((x) => x.marker.remove());
      markersRef.current = {};
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // points 变时重建 markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((x) => x.marker.remove());
    markersRef.current = {};

    for (const p of points) {
      const el = document.createElement("div");
      el.className = "h-3 w-3 rounded-full bg-neutral-900 ring-4 ring-white shadow";

      const popup = new mapboxgl.Popup({ offset: 16 }).setHTML(
        `<div style="font-weight:600">${p.name}</div>
         <div style="font-size:12px;color:#666;margin-top:4px">${p.tags.join(", ")}</div>`
      );

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener("click", () => {
        setActiveIdRaw(p.id);
        setSheetSnap("collapsed");
      });

      markersRef.current[p.id] = { marker, popup, el, point: p };
    }

    // 视野调整
    if (points.length >= 2) {
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 400 });
    } else if (points.length === 1) {
      map.easeTo({ center: [points[0].lng, points[0].lat], zoom: 13, duration: 400 });
    }
  }, [points]);

  // activeId 变化：高亮 + 飞过去 + popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const [id, obj] of Object.entries(markersRef.current)) {
      obj.el.style.transform = id === activeId ? "scale(1.6)" : "scale(1)";
    }

    if (!activeId) return;
    const target = markersRef.current[activeId];
    if (!target) return;

    map.easeTo({
      center: [target.point.lng, target.point.lat],
      zoom: Math.max(map.getZoom(), 13),
      duration: 450,
    });

    target.marker.togglePopup();
  }, [activeId]);

  function onSelect(id: string) {
    setActiveIdRaw(id);
    setSheetSnap("collapsed");
  }

  function setQueryToUrl(next: string) {
    const s = next.trim();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (!s) params.delete("q");
    else params.set("q", s);
    router.replace(`/dropoff?${params.toString()}`);
  }

  function onInputChange(v: string) {
    setInputValue(v);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => setQueryToUrl(v), 300);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function setTagsToUrl(next: Set<string>) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    const arr = Array.from(next);

    if (arr.length === 0) params.delete("tags");
    else params.set("tags", arr.join(","));

    router.replace(`/dropoff?${params.toString()}`);
  }

  function toggleTag(tag: string) {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setTagsToUrl(next);
  }

  function locateMe() {
    const map = mapRef.current;
    if (!map) return;

    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;

        setUserLoc({ lng, lat });

        if (!userMarkerRef.current) {
          const dot = document.createElement("div");
          dot.className = "h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white shadow";
          userMarkerRef.current = new mapboxgl.Marker({ element: dot }).setLngLat([lng, lat]).addTo(map);
        } else {
          userMarkerRef.current.setLngLat([lng, lat]);
        }

        map.easeTo({ center: [lng, lat], zoom: 13, duration: 600 });
      },
      (err) => alert(`Location error: ${err.message}`),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Drop-off Map</div>
            <button
              onClick={locateMe}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium"
            >
              📍 Use my location
            </button>
          </div>

          <div className="mt-1 text-xs text-neutral-600">
            {q ? `Filter: "${q}"` : `Query: "${FIXED_QUERY}"`}
            {selectedTags.size > 0 ? (
              <span className="ml-2 text-neutral-500">Tags: {Array.from(selectedTags).join(", ")}</span>
            ) : null}
            {loading ? <span className="ml-2 text-neutral-400">Loading…</span> : null}
            {errMsg ? <span className="ml-2 text-red-600">{errMsg}</span> : null}
          </div>
        </div>
      </header>

      <div className="px-4 py-4 pb-[180px]">
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div ref={containerRef} className="h-[70vh] w-full" />
        </div>
      </div>

      <BottomSheet title={`Results (${points.length})`} snap={sheetSnap} onSnapChange={setSheetSnap}>
        {/* Filter chips */}
        <div className="mb-3 flex flex-wrap gap-2">
          {FILTER_TAGS.map((t) => {
            const on = selectedTags.has(t.key);
            return (
              <button
                key={t.key}
                onClick={() => toggleTag(t.key)}
                className={[
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}

          {selectedTags.size > 0 ? (
            <button
              onClick={() => setTagsToUrl(new Set())}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* Search box */}
        <div className="mb-3">
          <input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder='Filter locally e.g. "battery", "paper"'
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
          />
          <div className="mt-1 text-[11px] text-neutral-500">
            Debounced: updates URL after you stop typing (300ms). Remote query is fixed to “{FIXED_QUERY}”.
          </div>
        </div>

        <DropoffList points={listPoints} activeId={activeId} onSelect={onSelect} />
      </BottomSheet>
    </main>
  );
}
