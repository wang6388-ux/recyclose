  "use client";

  import React, { useEffect, useMemo, useRef, useState } from "react";
  import mapboxgl from "mapbox-gl";
  import BottomSheet, { type SheetSnap } from "@/components/BottomSheet";
  import FiltersModal, { DEFAULT_FILTERS, type FiltersState, type FilterTag } from "@/components/FiltersModal";
  import { useRouter } from "next/navigation";
  import { makeFakePointsDeterministic } from "@/lib/dropoffData";
  import { SearchIcon, FilterIcon } from "@/components/icons/SearchFilterIcons";

  type DropoffPoint = {
    id: string;
    name: string;
    category: "Recycling Center" | "Donation Center" | "Waste & Garbage" | "Community Recycling";
    address: string;
    hours: string;
    tags: string[];
    pickup: boolean;
    phone: string;
    url: string;
    rating: number;
    ratingCount: number;
    lng: number;
    lat: number;
    heroImage: string;
  };

  const DEFAULT_CENTER = { lng: -122.3321, lat: 47.6062 };

  // 你 BottomNav 的“固定高度”（不含 safe-area）
  const BOTTOM_NAV_H = 80;

  const FILTER_TAGS: readonly FilterTag[] = [
    { key: "paper", label: "Paper" },
    { key: "cardboard", label: "Cardboard" },
    { key: "plastic", label: "Plastic" },
    { key: "metal", label: "Metal" },
    { key: "glass", label: "Glass" },
    { key: "battery", label: "Battery" },
    { key: "electronics", label: "Electronics" },
    { key: "textile", label: "Textile" },
    { key: "furniture", label: "Furniture" },
    { key: "tire", label: "Tire" },
    { key: "styrofoam", label: "Styrofoam" },
    { key: "other", label: "Other" },
  ] as const;

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

  async function reverseGeocodeShort(token: string, lng: number, lat: number): Promise<string> {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
      `?access_token=${token}&types=place,locality,neighborhood&limit=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("geocode failed");
    const json = await res.json();

    const f = json?.features?.[0];
    if (!f) return "Unknown";

    const placeName: string = f.text || "Unknown";
    const ctx: any[] = f.context || [];
    const region = ctx.find((x) => String(x.id || "").startsWith("region."))?.short_code;
    if (region) return `${placeName}, ${String(region).toUpperCase().replace("US-", "")}`;

    return placeName;
  }

  function radiusMiles(r: FiltersState["radius"]) {
  if (r === "any") return Number.POSITIVE_INFINITY;
  if (r === "6blocks") return 0.3;
  if (r === "1mile") return 1;
  if (r === "5miles") return 5;
  return 40;
}


  const ALL_POINTS: DropoffPoint[] = makeFakePointsDeterministic(
    60,
    FILTER_TAGS.map((x) => x.key)
  ) as any;

  export default function DropoffPage() {
    const router = useRouter();

    // ✅ 只把 BottomNav 的“可见栏高度”算进布局，不要把 safe-area 算两遍
    const bottomNavOffset = `${BOTTOM_NAV_H}px`;


    const [sheetSnap, setSheetSnap] = useState<SheetSnap>("collapsed");

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
    const [query, setQuery] = useState("");

    const [userLoc, setUserLoc] = useState<{ lng: number; lat: number } | null>(null);
    const [userLabel, setUserLabel] = useState<string>("Loading…");
    const [locating, setLocating] = useState(false);

    const [baseLoc, setBaseLoc] = useState<{ lng: number; lat: number }>(DEFAULT_CENTER);
    const [baseLabel, setBaseLabel] = useState<string>("Seattle, WA");

    const headerRef = useRef<HTMLElement | null>(null);
    const [headerH, setHeaderH] = useState(140);

    const listWrapRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const mapHostRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const markersRef = useRef<Record<string, { marker: mapboxgl.Marker; inner: HTMLDivElement; p: DropoffPoint }>>({});
    const [activeId, setActiveId] = useState<string | null>(null);

    const [previewOpen, setPreviewOpen] = useState(false);

    const activePoint = useMemo(() => {
      if (!activeId) return null;
      return ALL_POINTS.find((x) => x.id === activeId) || null;
    }, [activeId]);

    const activeDistanceMiles = useMemo(() => {
      if (!activePoint) return null;
      const meters = haversineMeters(baseLoc, { lng: activePoint.lng, lat: activePoint.lat });
      return meters / 1609.34;
    }, [activePoint, baseLoc]);

    const mapboxFixCss = `
      .dropoff-mapbox, .dropoff-mapbox .mapboxgl-map, .dropoff-mapbox .mapboxgl-canvas-container {
        width: 100% !important;
        height: 100% !important;
      }
      .dropoff-mapbox canvas {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
      }

      .pin-outer { width: 26px; height: 26px; }
      .pin-inner {
        width: 26px;
        height: 26px;
        background: var(--brand-900);
        border-radius: 999px 999px 999px 0;
        transform: rotate(-45deg);
        position: relative;
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
        border: 3px solid rgba(255,255,255,.95);
        cursor: pointer;
        transition: transform 180ms ease, filter 180ms ease;
        transform-origin: 50% 50%;
      }
      .pin-inner::after {
        content: "";
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 999px;
        position: absolute;
        top: 7px;
        left: 7px;
      }
      .pin-inner.active {
        transform: rotate(-45deg) scale(1.12);
        filter: drop-shadow(0 10px 18px rgba(0,0,0,.35));
      }
    `;

    // header 高度监听
    useEffect(() => {
      const el = headerRef.current;
      if (!el) return;
      const set = () => setHeaderH(Math.ceil(el.getBoundingClientRect().height));
      set();
      const ro = new ResizeObserver(set);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const [webglOk, setWebglOk] = useState<boolean | null>(null);
    const [webglErr, setWebglErr] = useState<string | null>(null);

    // map init + webgl check
    useEffect(() => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        setWebglOk(false);
        setWebglErr("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
        return;
      }

      const supported = mapboxgl.supported();
      setWebglOk(supported);

      if (!supported) {
        setWebglErr(
          "WebGL is not available in this browser session. Turn on hardware acceleration, disable restrictive extensions, or try another browser."
        );
        return;
      }

      if (mapRef.current) return;
      const host = mapHostRef.current;
      if (!host) return;

      mapboxgl.accessToken = token;

      try {
        const map = new mapboxgl.Map({
          container: host,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
          zoom: 11,
          attributionControl: false,
          antialias: false,
          preserveDrawingBuffer: false,
        });

        mapRef.current = map;

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

        map.on("click", () => {
          setActiveId(null);
          setPreviewOpen(false);
        });

        map.on("load", () => {
          try {
            map.resize();
          } catch {}
        });

        map.on("error", (e) => {
          const msg = String((e as any)?.error?.message ?? (e as any)?.error ?? "Map error");
          setWebglErr(msg);
        });

        return () => {
          mapRef.current = null;
          Object.values(markersRef.current).forEach((x) => x.marker.remove());
          markersRef.current = {};
          try {
            map.remove();
          } catch {}
        };
      } catch (err: any) {
        setWebglOk(false);
        setWebglErr(String(err?.message ?? err ?? "Failed to initialize Mapbox"));
      }
    }, []);

    // 初次定位用户（右上角 pin 的 title）
    useEffect(() => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        setUserLabel("No token");
        return;
      }
      if (!navigator.geolocation) {
        setUserLabel("Geolocation unsupported");
        return;
      }

      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          setUserLoc({ lng, lat });

          try {
            const label = await reverseGeocodeShort(token, lng, lat);
            setUserLabel(label);
          } catch {
            setUserLabel("Current location");
          }
          setLocating(false);
        },
        () => {
          setUserLabel("Location denied");
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }, []);
useEffect(() => {
  const q = query.trim();
  if (!q) return;

  // ✅ 搜索进入列表模式
  setActiveId(null);
  setPreviewOpen(false);
  setSheetSnap("half");
}, [query]);

    // 过滤列表
    const filteredPoints = useMemo(() => {
      let base = ALL_POINTS;

      if (filters.serviceType === "recycle") {
        base = base.filter((p) => p.category !== "Donation Center");
      } else if (filters.serviceType === "donation") {
        base = base.filter((p) => p.category === "Donation Center");
      }

      if (filters.pickupOnly) base = base.filter((p) => p.pickup);

      if (filters.categories.size > 0) {
        base = base.filter((p) => p.tags.some((t) => filters.categories.has(t)));
      }

      const q = query.trim().toLowerCase();
const hasQuery = q.length > 0;

if (hasQuery) {
  base = base.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
    );
  });
}

const maxMiles = hasQuery ? Number.POSITIVE_INFINITY : radiusMiles(filters.radius);
const maxMeters = maxMiles * 1609.34;

return base
  .map((p) => ({ p, dist: haversineMeters(baseLoc, { lng: p.lng, lat: p.lat }) }))
  .filter((x) => x.dist <= maxMeters)
  .sort((a, b) => a.dist - b.dist);

    }, [filters, query, baseLoc]);

    const listPoints = useMemo(() => {
      return filteredPoints.map((x) => ({ ...x.p, distanceMeters: x.dist }));
    }, [filteredPoints]);

    // markers：地图显示全部 ALL_POINTS
    useEffect(() => {
      const map = mapRef.current;
      if (!map) return;

      Object.values(markersRef.current).forEach((x) => x.marker.remove());
      markersRef.current = {};

      for (const p of ALL_POINTS) {
        const outer = document.createElement("div");
        outer.className = "pin-outer";

        const inner = document.createElement("div");
        inner.className = "pin-inner";
        outer.appendChild(inner);

        const marker = new mapboxgl.Marker({ element: outer, anchor: "bottom" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);

        outer.addEventListener("click", (e) => {
  e.stopPropagation();

  setActiveId(p.id);
  setPreviewOpen(true);

  // ✅ 单点预览模式：隐藏 bottom list
  setSheetSnap("hidden");

  // ✅ 不要在单点模式里滚动 list（因为 list 被你隐藏了）
  // requestAnimationFrame(() => {
  //   itemRefs.current[p.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  // });

  map.easeTo({
    center: [p.lng, p.lat],
    zoom: Math.max(map.getZoom(), 12),
    duration: 360,
    offset: [0, Math.round(headerH * 0.35)],
  });
});


        markersRef.current[p.id] = { marker, inner, p };
      }
    }, [headerH]);

    // active marker 高亮
    useEffect(() => {
      for (const [id, obj] of Object.entries(markersRef.current)) {
        if (id === activeId) obj.inner.classList.add("active");
        else obj.inner.classList.remove("active");
      }
    }, [activeId]);

    function openDetail(id: string) {
      router.push(`/dropoff/${id}`);
    }

    // 用地图中心作为 baseLoc
    async function useMapCenterAsBase() {
      const map = mapRef.current;
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!map || !token) return;

      const c = map.getCenter();
      const lng = c.lng;
      const lat = c.lat;

      setBaseLoc({ lng, lat });
setActiveId(null);
setPreviewOpen(false);
setSheetSnap("half"); // ✅ 调出列表


      try {
        const label = await reverseGeocodeShort(token, lng, lat);
        setBaseLabel(label);
      } catch {
        setBaseLabel("Selected area");
      }
    }

    // 右上角 pin：定位 + 设为 baseLoc
    async function locateUser() {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const map = mapRef.current;
      if (!token) return;
      if (!navigator.geolocation) return;

      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;

          setUserLoc({ lng, lat });
setBaseLoc({ lng, lat });
setActiveId(null);
setPreviewOpen(false);
setSheetSnap("half"); // ✅ 调出列表


          try {
            const label = await reverseGeocodeShort(token, lng, lat);
            setUserLabel(label);
            setBaseLabel(label);
          } catch {
            setUserLabel("Current location");
            setBaseLabel("Current location");
          }

          if (map) {
            map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 12), duration: 420 });
          }

          setLocating(false);
        },
        () => setLocating(false),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    const headerLocationText = baseLabel;

    return (
      <main
        className="relative h-screen w-full overflow-hidden bg-white"
        style={
          {
            ["--bottom-nav-h" as any]: bottomNavOffset,
          } as React.CSSProperties
        }
      >
        <style jsx global>{mapboxFixCss}</style>

        {/* Header */}
        <header ref={headerRef} className="absolute top-0 left-0 right-0 z-30">
          <div className="bg-[var(--brand-900)] px-4 pt-4 pb-3 text-white shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <div className="truncate text-[20px] font-semibold leading-none">{headerLocationText}</div>
                </div>
                <div className="mt-1 text-sm text-white/75">within {radiusMiles(filters.radius)} mi</div>
              </div>

              <button
                onClick={locateUser}
                className="shrink-0 rounded-2xl bg-white/15 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/20"
                aria-label="Use device location"
                title={userLabel}
              >
                {locating ? "Locating…" : "📍"}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 flex-1 items-center gap-2 rounded-2xl bg-white/95 px-3 shadow-sm">
                <SearchIcon className="h-4 w-4 text-neutral-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </div>

              <button
                onClick={() => setFiltersOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20"
                aria-label="Filters"
                title="Filters"
              >
                <FilterIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* ✅ Map area：底部让出 bottom-nav-h */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: headerH,
            bottom: "var(--bottom-nav-h)",
          }}
        >
          <div className="relative h-full w-full">
            {webglOk === false ? (
              <div className="absolute inset-0 z-[70] flex items-center justify-center bg-white">
                <div className="mx-auto w-[92%] max-w-md rounded-3xl border border-neutral-200 bg-white p-5 text-[var(--brand-900)] shadow">
                  <div className="text-lg font-semibold">Map unavailable</div>
                  <div className="mt-2 text-sm text-[rgba(46,63,58,.80)]">
                    {webglErr ?? "WebGL is required to render the map."}
                  </div>
                  <div className="mt-4 text-sm text-[rgba(46,63,58,.80)]">
                    Try:
                    <ul className="mt-2 list-disc pl-5">
                      <li>Enable hardware acceleration in browser settings</li>
                      <li>Disable extensions that block WebGL</li>
                      <li>Update GPU drivers</li>
                      <li>Try Chrome/Edge on a normal (non-remote) session</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={mapHostRef} className="dropoff-mapbox h-full w-full" />

            <div className="pointer-events-none absolute left-3 top-3 z-[60]">
              <button
                onClick={useMapCenterAsBase}
                className="pointer-events-auto rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-[var(--brand-900)] shadow"
                aria-label="Use current map view"
                title="Use current map view"
              >
                Current location
              </button>
            </div>

            {/* ✅ preview card：抬高到 nav 上方 */}
            {activePoint && previewOpen ? (
              <div
                className="absolute left-0 right-0 z-[65] px-3"
                style={{ bottom: "calc(var(--bottom-nav-h) + 12px)" }}
              >
                <div className="mx-auto w-full max-w-md">
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-neutral-200">
                    <button
                      onClick={() => setPreviewOpen(false)}
                      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--brand-900)] shadow ring-1 ring-neutral-200"
                      aria-label="Close preview"
                    >
                      ✕
                    </button>

                    <button onClick={() => openDetail(activePoint.id)} className="w-full text-left">
                      <div className="flex gap-3 p-3">
                        <img src={activePoint.heroImage} alt="" className="h-24 w-28 shrink-0 rounded-2xl object-cover" />
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="truncate text-[20px] font-semibold text-[var(--brand-900)]">{activePoint.name}</div>
                          <div className="mt-0.5 text-sm text-[rgba(46,63,58,.85)]">{activePoint.category}</div>
                          <div className="mt-1 truncate text-sm text-[rgba(46,63,58,.70)]">{activePoint.address}</div>

                          <div className="mt-2 flex items-center gap-3 text-xs text-[rgba(46,63,58,.70)]">
                            {activeDistanceMiles != null ? <span>{activeDistanceMiles.toFixed(1)} mi</span> : null}
                            <span className="truncate">Hours · {activePoint.hours}</span>
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-xs text-[rgba(46,63,58,.70)]">
                            <span className="text-[#f0c6a8] text-[16px]">★</span>
                            <span>
                              {activePoint.rating} ({activePoint.ratingCount})
                            </span>
                            {activePoint.pickup ? (
                              <span className="ml-auto rounded-full bg-[rgba(46,63,58,.10)] px-2 py-1 text-[11px] font-semibold text-[rgba(46,63,58,.85)]">
                                Pickup
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ✅ Bottom sheet：站在 bottom-nav-h 上方 */}
        <BottomSheet
          title={<span className="text-[16px] font-semibold">{listPoints.length} Results Found</span>}
          snap={sheetSnap}
          onSnapChange={setSheetSnap}
          bottomOffset="var(--bottom-nav-h)"
          contentRef={listWrapRef}
        >
          <div className="space-y-3">
            {listPoints.map((p) => {
              const miles = (p.distanceMeters / 1609.34).toFixed(1);
              const isActive = p.id === activeId;

              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    itemRefs.current[p.id] = el;
                  }}
                  onClick={() => openDetail(p.id)}
                  className={[
                    "w-full rounded-3xl bg-white p-3 text-left shadow-sm ring-1 ring-neutral-200",
                    isActive ? "ring-2 ring-[var(--brand-900)]" : "",
                  ].join(" ")}
                >
                  <div className="flex gap-3">
                    <img src={p.heroImage} alt="" className="h-16 w-20 shrink-0 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[18px] font-semibold text-[var(--brand-900)]">{p.name}</div>
                      <div className="mt-0.5 text-sm text-[rgba(46,63,58,.85)]">{p.category}</div>
                      <div className="mt-1 text-sm text-[rgba(46,63,58,.70)] truncate">{p.address}</div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-[rgba(46,63,58,.70)]">
                        <span>{miles} mi</span>
                        <span className="truncate">Hours · {p.hours}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </BottomSheet>

        <FiltersModal
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          value={filters}
          onChange={setFilters}
          categories={FILTER_TAGS}
        />
      </main>
    );
  }
