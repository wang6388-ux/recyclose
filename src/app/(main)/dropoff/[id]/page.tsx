"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useParams, useRouter } from "next/navigation";
import { makeFakePointsDeterministic, type DropoffPoint } from "@/lib/dropoffData";

const ALL_POINTS: DropoffPoint[] = makeFakePointsDeterministic(60);

export default function DropoffDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const point = useMemo(() => ALL_POINTS.find((p) => p.id === id) || null, [id]);

  const mapHostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [exiting, setExiting] = useState(false);

  function goBack() {
    setExiting(true);
    window.setTimeout(() => router.back(), 170);
  }

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;
    if (!point) return;

    if (mapRef.current) return;

    const host = mapHostRef.current;
    if (!host) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: host,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [point.lng, point.lat],
      zoom: 13,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    // marker
    const el = document.createElement("div");
    el.style.width = "18px";
    el.style.height = "18px";
    el.style.borderRadius = "999px";
    el.style.background = "var(--brand-900)";
    el.style.border = "3px solid rgba(255,255,255,.95)";
    new mapboxgl.Marker({ element: el }).setLngLat([point.lng, point.lat]).addTo(map);

    const t = window.setTimeout(() => {
      try {
        map.resize();
      } catch {}
    }, 60);

    return () => {
      window.clearTimeout(t);
      mapRef.current = null;
      map.remove();
    };
  }, [point]);

  if (!point) {
    return (
      <main className="min-h-screen bg-white">
        <div className="p-6 text-[var(--brand-900)]">
          Not found
          <button className="mt-4 block rounded-xl border px-4 py-2" onClick={() => router.back()}>
            Back
          </button>
        </div>
      </main>
    );
  }

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.address)}`;

  return (
    <main className="min-h-screen bg-white">
      <style jsx global>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(22px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(22px);
            opacity: 0;
          }
        }
        .detail-enter {
          animation: slideInFromRight 220ms ease-out both;
        }
        .detail-exit {
          animation: slideOutToRight 180ms ease-in both;
        }
      `}</style>

      <div className={exiting ? "detail-exit" : "detail-enter"}>
        <div className="sticky top-0 z-50 border-b border-neutral-100 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-md px-4 py-3">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-[18px] font-semibold text-[var(--brand-900)]"
              aria-label="Back"
            >
              <span className="text-[22px]">‹</span> Back
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-md">
          <div className="relative">
            <img src={point.heroImage} alt="" className="h-64 w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 to-white/60" />
          </div>

          {/* Content */}
          <div className="px-6 pt-5 pb-6">
            <div className="text-[28px] font-semibold text-[var(--brand-900)]">{point.name}</div>
            <div className="mt-1 text-[20px] text-[rgba(46,63,58,.85)]">{point.category}</div>
            <div className="mt-2 text-[20px] text-[rgba(46,63,58,.85)]">Hours · {point.hours}</div>

            <div className="mt-3 flex items-center gap-3 text-[18px] text-[rgba(46,63,58,.85)]">
              <span className="text-[#f0c6a8] text-[22px]">★</span>
              <span>
                {point.rating} ({point.ratingCount}) on Yelp
              </span>
            </div>

            <div className="mt-5 h-px bg-[rgba(46,63,58,.35)]" />

            {/* Schedule Pickup */}
            {point.pickup ? (
              <div className="mt-6 flex justify-center">
                <button className="w-[86%] rounded-2xl border border-[rgba(46,63,58,.45)] px-6 py-4 text-[20px] font-semibold text-[rgba(46,63,58,.85)] shadow-sm">
                  <span className="mr-3 inline-block rounded-full bg-[rgba(46,63,58,.15)] px-3 py-1">🕒</span>
                  Schedule Pickup
                </button>
              </div>
            ) : null}

            {/* Actions */}
            <div className="mt-7 grid grid-cols-3 gap-4">
              <a
                href={`tel:${point.phone}`}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[rgba(46,63,58,.45)] px-3 py-3 text-[18px] font-semibold text-[rgba(46,63,58,.85)]"
              >
                📞 Call
              </a>
              <a
                href={point.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[rgba(46,63,58,.45)] px-3 py-3 text-[18px] font-semibold text-[rgba(46,63,58,.85)]"
              >
                🌐 Link
              </a>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-[rgba(46,63,58,.45)] px-3 py-3 text-[18px] font-semibold text-[rgba(46,63,58,.85)]">
                ••• More
              </button>
            </div>

            {/* Address */}
            <div className="mt-7 flex items-center gap-3 text-[18px] text-[rgba(46,63,58,.85)]">
              <span className="text-[22px]">📍</span>
              <span>{point.address}</span>
            </div>

            {/* Map card */}
            <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-5 py-4 text-[18px] font-semibold text-[var(--brand-900)]"
              >
                Get direction <span className="text-[22px]">›</span>
              </a>
              <div className="h-56 w-full">
                <div ref={mapHostRef} className="h-full w-full" />
              </div>
            </div>

            <div style={{ height: "calc(72px + env(safe-area-inset-bottom))" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
