"use client";

import { useMemo, useState } from "react";

const KEY = "recyclose:saved-slugs";

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(slugs: string[]) {
  localStorage.setItem(KEY, JSON.stringify(slugs));
}

export default function SaveButton({ slug }: { slug: string }) {
  // ✅ 初始值用 lazy initializer 读取 localStorage（不是 effect）
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => readSaved());

  const saved = useMemo(() => savedSlugs.includes(slug), [savedSlugs, slug]);

  function toggle() {
    console.log("SaveButton clicked", { slug });
  
    const next = saved
      ? savedSlugs.filter((s) => s !== slug)
      : [...savedSlugs, slug];
  
    setSavedSlugs(next);
    writeSaved(next);
  
    console.log("Saved slugs now:", localStorage.getItem(KEY));
  
    window.dispatchEvent(new Event("recyclose:saved-changed"));
  }
  

  return (
    <button
      onClick={toggle}
      className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium"
    >
      {saved ? "★ Saved (tap to remove)" : "☆ Save to My List"}
    </button>
  );
}
