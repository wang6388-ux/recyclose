// src/lib/savedDb.ts
"use client";

import { useEffect, useState } from "react";

const KEY = "recyclose_saved_db_slugs";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function writeSaved(slugs: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(slugs));
}

export function useSavedSlugs() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(readSaved());

    const onCustom = () => setSlugs(readSaved());
    window.addEventListener("saved-db-changed", onCustom);

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSlugs(readSaved());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("saved-db-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return slugs;
}

export function toggleSaved(slug: string) {
  const current = readSaved();
  const set = new Set(current);
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);

  const next = Array.from(set);
  writeSaved(next);

  window.dispatchEvent(new Event("saved-db-changed"));
}

export function clearSaved() {
  writeSaved([]);
  window.dispatchEvent(new Event("saved-db-changed"));
}
