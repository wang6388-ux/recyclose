"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  type CategoryKey,
  getCategoryBySlug,
  getItemsByCategory,
} from "@/lib/databaseData";
import { useSavedSlugs, toggleSaved } from "@/lib/savedDb";


export default function CategoryPage({
  params,
}: {
  params: { key: string };
}) {
  const key = params.key as CategoryKey;

  const category = useMemo(() => getCategoryBySlug(key), [key]);
  const items = useMemo(() => getItemsByCategory(key), [key]);
  const saved = useSavedSlugs();

  if (!category) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-md px-4 pt-6">
          <div className="text-[24px] font-semibold text-[var(--brand-900)]">
            Category not found
          </div>
          <Link
            href="/database"
            className="mt-4 inline-block text-[var(--brand-900)] underline"
          >
            Back to Database
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto w-full max-w-md px-4 pt-6 pb-24">
        <Link
          href="/database"
          className="inline-flex items-center gap-2 text-[22px] text-[var(--brand-900)]"
        >
          <span className="text-[26px]">‹</span> Back
        </Link>

        <div className="mt-5 text-[34px] font-semibold text-[var(--brand-900)]">
          {category.title}
        </div>

        <div className="mt-5 space-y-4">
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/database/${it.slug}`}
              className="block overflow-hidden rounded-3xl bg-white shadow ring-1 ring-black/5"
            >
              <div className="flex items-center gap-5 p-4">
                <img
                  src={it.image}
                  alt={it.name}
                  className="h-20 w-24 rounded-2xl object-cover"
                />
                <div className="text-[28px] font-semibold text-[var(--brand-900)]">
                  {it.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
