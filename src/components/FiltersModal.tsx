"use client";

import { useEffect } from "react";

export type ServiceType = "recycle" | "donation" | "any";
export type RadiusKey = "any" | "6blocks" | "1mile" | "5miles" | "40miles";

export const DEFAULT_FILTERS: FiltersState = {
  serviceType: "any",
  pickupOnly: false,
  categories: new Set<string>(),
  radius: "any", // ✅ 你想“默认永远搜得到”，就用 any；不想就保留 40miles
};


export type FilterTag = {
  key: string;
  label: string;
};

export type FiltersState = {
  serviceType: ServiceType;   // recycle / donation / any
  pickupOnly: boolean;        // 是否支持上门取
  categories: Set<string>;    // category keys
  radius: RadiusKey;          // 6blocks/1mile/5miles/40miles
};

export default function FiltersModal({
  open,
  onClose,
  value,
  onChange,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  categories: readonly FilterTag[];
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function setServiceType(t: ServiceType) {
    onChange({ ...value, serviceType: t });
  }
  function togglePickup() {
    onChange({ ...value, pickupOnly: !value.pickupOnly });
  }
  function toggleCategory(key: string) {
    const next = new Set(value.categories);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange({ ...value, categories: next });
  }
  function setRadius(r: RadiusKey) {
    onChange({ ...value, radius: r });
  }

  return (
    <div className="fixed inset-0 z-[80]">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/35"
        aria-label="Close filters"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute left-1/2 top-[92px] w-[92%] max-w-md -translate-x-1/2 rounded-3xl bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="text-[28px] font-semibold text-[var(--brand-900)]">
            Filters
          </div>

          <button
            onClick={onClose}
            className="h-11 w-11 rounded-full border border-neutral-200 text-[var(--brand-900)]"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* body (scrollable) */}
        <div className="max-h-[72vh] overflow-y-auto px-6 pb-[96px]">
          {/* Service Type */}
          <div className="mt-6">
            <div className="text-[22px] font-semibold text-[var(--brand-900)]">
              Service Type
            </div>

            <div className="mt-4 flex items-center gap-10 text-[20px] text-[var(--brand-900)]">
              <label className="flex items-center gap-4">
                <input
                  type="radio"
                  name="serviceType"
                  checked={value.serviceType === "recycle"}
                  onChange={() => setServiceType("recycle")}
                  className="h-7 w-7 accent-[var(--brand-900)]"
                />
                Recycle
              </label>

              <label className="flex items-center gap-4">
                <input
                  type="radio"
                  name="serviceType"
                  checked={value.serviceType === "donation"}
                  onChange={() => setServiceType("donation")}
                  className="h-7 w-7 accent-[var(--brand-900)]"
                />
                Donation
              </label>
            </div>

            <div className="mt-4">
              <label className="flex items-center justify-between rounded-2xl border border-[rgba(46,63,58,.35)] px-4 py-3">
                <div className="text-[20px] text-[var(--brand-900)]">
                  Pick Up
                </div>
                <input
                  type="checkbox"
                  checked={value.pickupOnly}
                  onChange={togglePickup}
                  className="h-7 w-7 accent-[var(--brand-900)]"
                />
              </label>
            </div>
          </div>

          {/* Radius */}
          <div className="mt-8">
            <div className="text-[22px] font-semibold text-[var(--brand-900)]">
              Range
            </div>

            {/* Radius */}
<div className="mt-8">
  <div className="text-[22px] font-semibold text-[var(--brand-900)]">Range</div>

  {/* ✅ 4 个按钮（包含 All），改成 grid-cols-2 更稳，不挤 */}
  <div className="mt-4 grid grid-cols-2 gap-3">
    {[
      { key: "any", label: "All" },
      { key: "6blocks", label: "6 blocks" },
      { key: "1mile", label: "1 mile" },
      { key: "5miles", label: "5 miles" },
    ].map((x) => {
      const on = value.radius === (x.key as RadiusKey);
      return (
        <button
          key={x.key}
          onClick={() => setRadius(x.key as RadiusKey)}
          className={[
            "rounded-2xl border px-3 py-3 text-[16px] font-semibold",
            on
              ? "bg-[var(--brand-900)] text-white border-[var(--brand-900)]"
              : "bg-white text-[var(--brand-900)] border-[rgba(46,63,58,.35)]",
          ].join(" ")}
        >
          {x.label}
        </button>
      );
    })}
  </div>

  <div className="mt-3">
    <button
      onClick={() => setRadius("40miles")}
      className={[
        "w-full rounded-2xl border px-3 py-3 text-[16px] font-semibold",
        value.radius === "40miles"
          ? "bg-[var(--brand-900)] text-white border-[var(--brand-900)]"
          : "bg-white text-[var(--brand-900)] border-[rgba(46,63,58,.35)]",
      ].join(" ")}
    >
      40 miles
    </button>
  </div>

  {/* 可选：给用户解释一下 any 的含义 */}
  <div className="mt-2 text-[13px] text-[rgba(46,63,58,.65)]">
    Tip: Search will show all matching results even if you are far away.
  </div>
</div>

          </div>

          {/* Category */}
          <div className="mt-8">
            <div className="text-[22px] font-semibold text-[var(--brand-900)]">
              Category
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
              {categories.map((t) => {
                const checked = value.categories.has(t.key);
                return (
                  <label
                    key={t.key}
                    className="flex items-center gap-4 text-[18px] text-[var(--brand-900)]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(t.key)}
                      className="h-7 w-7 accent-[var(--brand-900)]"
                    />
                    {t.label}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer pinned */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="w-[46%] rounded-2xl bg-[var(--brand-900)] py-4 text-[18px] font-semibold text-white"
            >
              Apply
            </button>

            <button
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="w-[46%] rounded-2xl bg-[#f2d8c6] py-4 text-[18px] font-semibold text-[var(--brand-900)]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
