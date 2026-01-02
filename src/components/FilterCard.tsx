"use client";

import { useMemo, useState } from "react";

type ServiceType = "recycle" | "donation";

export type FilterState = {
  serviceType: ServiceType;
  pickup: boolean;
  categories: Set<string>;
};

export const CATEGORY_OPTIONS = [
  "Paper",
  "Cardboard",
  "Plastic",
  "Metal",
  "Glass",
  "Electronics",
  "Battery",
  "Textile",
  "Tire",
  "Styrofoam",
  "Furniture",
  "Other",
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function FilterCard(props: {
  value: FilterState;
  onApply: (next: FilterState) => void;
  onClear: () => void;
}) {
  const { value, onApply, onClear } = props;

  const [draftService, setDraftService] = useState<ServiceType>(value.serviceType);
  const [draftPickup, setDraftPickup] = useState<boolean>(value.pickup);
  const [draftCats, setDraftCats] = useState<Set<string>>(() => new Set(value.categories));


  const selectedCount = useMemo(() => draftCats.size, [draftCats]);

  function toggleCat(cat: string) {
    setDraftCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function apply() {
    onApply({
      serviceType: draftService,
      pickup: draftPickup,
      categories: new Set(draftCats),
    });
  }

  function clear() {
    setDraftService("recycle");
    setDraftPickup(false);
    setDraftCats(new Set());
    onClear();
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-neutral-900">Filter</div>

      <div className="mt-4">
        <div className="text-sm font-semibold text-neutral-900">Service Type</div>
        <div className="mt-3 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="radio"
              name="serviceType"
              checked={draftService === "recycle"}
              onChange={() => setDraftService("recycle")}
              className="h-4 w-4"
            />
            Recycle
          </label>

          <label className="flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="radio"
              name="serviceType"
              checked={draftService === "donation"}
              onChange={() => setDraftService("donation")}
              className="h-4 w-4"
            />
            Donation
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2">
          <div className="text-sm text-neutral-800">Pick Up</div>

          <button
            type="button"
            onClick={() => setDraftPickup((v) => !v)}
            className={cx(
              "relative h-6 w-11 rounded-full border transition",
              draftPickup ? "bg-neutral-900 border-neutral-900" : "bg-neutral-200 border-neutral-200"
            )}
            aria-pressed={draftPickup}
          >
            <span
              className={cx(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                draftPickup ? "left-5" : "left-0.5"
              )}
            />
          </button>
        </div>
      </div>
      
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-neutral-900">Category</div>
          <div className="text-xs text-neutral-500">{selectedCount} selected</div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {CATEGORY_OPTIONS.map((cat) => {
            const on = draftCats.has(cat);
            return (
              <label key={cat} className="flex items-center gap-2 text-sm text-neutral-800">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleCat(cat)}
                  className="h-4 w-4"
                />
                {cat}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={apply}
          className="rounded-xl bg-neutral-800 px-4 py-3 text-sm font-semibold text-white"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={clear}
          className="rounded-xl bg-[#EED7C8] px-4 py-3 text-sm font-semibold text-neutral-800"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
