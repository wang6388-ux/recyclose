"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { listItemsBySlugs } from "@/data/databaseCategories";

const KEY = "recyclose:saved-slugs";

const EMPTY: string[] = [];

let lastRaw = "";
let lastParsed: string[] = EMPTY;

function readSavedStable(): string[] {
  try {
    const raw = localStorage.getItem(KEY) ?? "";
    if (raw === lastRaw) return lastParsed; 

    lastRaw = raw;

    if (!raw) {
      lastParsed = EMPTY;
      return lastParsed;
    }

    const parsed = JSON.parse(raw);
    lastParsed = Array.isArray(parsed) ? (parsed as string[]) : EMPTY;
    return lastParsed;
  } catch {
    lastRaw = "";
    lastParsed = EMPTY;
    return lastParsed;
  }
}

function subscribe(callback: () => void) {
  const handler = (e?: Event) => {
    callback();
  };

  window.addEventListener("recyclose:saved-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("recyclose:saved-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

export default function SavedRow() {
  const slugs = useSyncExternalStore(
    subscribe,
    readSavedStable,
    () => EMPTY 
  );

  const items = listItemsBySlugs(slugs);

  if (items.length === 0) {
    return (
      <div className="mt-2 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        No saved items yet. Save one from an item page.
      </div>
    );
  }

  return (
    <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
      {items.map((it) => (
        <Link
          key={it.slug}
          href={`/database/${it.slug}`}
          className="w-[108px] shrink-0"
        >
          <div className="w-full aspect-square rounded-xl border border-neutral-200 bg-neutral-100" />
          <div className="mt-1 text-[11px] leading-4 text-neutral-700 line-clamp-2">
            {it.title}
          </div>
        </Link>
      ))}
    </div>
  );
}
