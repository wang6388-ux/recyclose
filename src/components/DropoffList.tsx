"use client";

export type DropoffPoint = {
  id: string;
  name: string;
  tags: string[];
  distanceMeters?: number | null;
};

function formatDistance(meters?: number | null) {
  if (meters == null) return null;

  const miles = meters / 1609.344;
  if (miles < 0.1) return "<0.1 mi";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export default function DropoffList({
  points,
  activeId,
  onSelect,
}: {
  points: DropoffPoint[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {points.map((p) => {
        const active = p.id === activeId;
        const dist = formatDistance(p.distanceMeters);

        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={[
              "w-full rounded-2xl border px-4 py-3 text-left",
              active ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-900 truncate">{p.name}</div>
                <div className="mt-1 text-xs text-neutral-600 truncate">{p.tags.join(", ")}</div>
              </div>

              {dist ? (
                <div className="shrink-0 rounded-full border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-700">
                  {dist}
                </div>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
