// app/database/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, ITEMS, type DbItem, type DbCategory } from "@/lib/databaseData";
import { useSavedSlugs } from "@/lib/savedDb";

export default function DatabaseHomePage() {
  const [q, setQ] = useState("");

  // ✅ hook 必须在组件里
  const savedSlugs = useSavedSlugs();

  const savedItems = useMemo(() => {
    if (savedSlugs.length === 0) return [];
    const set = new Set(savedSlugs);
    // 保持 savedSlugs 的顺序
    return savedSlugs.map((s) => ITEMS.find((it) => it.slug === s)).filter(Boolean) as DbItem[];
  }, [savedSlugs]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ITEMS;
    return ITEMS.filter((it) => it.name.toLowerCase().includes(s));
  }, [q]);

  const byCat = useMemo(() => {
    const map = new Map<string, DbItem[]>();
    for (const c of CATEGORIES) map.set(c.key, []);
    for (const it of filtered) map.get(it.category)?.push(it);
    return map;
  }, [filtered]);

  return (
    <main className="min-h-screen bg-[#f5f5f5]" style={{ paddingBottom: "var(--bottom-nav-h, 88px)" }}>
      <div className="mx-auto w-full max-w-md">
        {/* Header (深绿) */}
        <div className="bg-[var(--brand-900)] px-4 pt-10 pb-5 text-white">
          <div className="text-[40px] font-semibold">Database</div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-white px-4">
              <span className="text-[18px] text-[rgba(46,63,58,.7)]">🔍</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-[18px] text-[var(--brand-900)] outline-none placeholder:text-[rgba(46,63,58,.45)]"
              />
            </div>

            <button className="h-12 w-12 rounded-2xl bg-white text-[var(--brand-900)]" aria-label="Camera" title="Camera">
              📷
            </button>
          </div>
        </div>

        {/* 内容区（浅灰背景） */}
        <div className="px-4 pt-6 pb-24">
          {/* ✅ Saved 区块：放在最上方（像你说的功能要回来） */}
          {savedItems.length > 0 ? (
            <section className="mb-10">
              <div className="flex items-center justify-between">
                <div className="text-[28px] font-semibold text-[var(--brand-900)]">Saved</div>
              </div>

              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                {savedItems.map((it) => (
                  <Link
                    key={it.slug}
                    href={`/database/${it.slug}`}
                    className="min-w-[240px] overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200"
                  >
                    <div className="h-[130px] bg-neutral-100">
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-[18px] font-semibold text-[var(--brand-900)]">{it.name}</div>
                      <div className="mt-1 text-sm text-[rgba(46,63,58,.70)] line-clamp-2">{it.intro}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {CATEGORIES.map((c: DbCategory) => {
            const items = byCat.get(c.key) ?? [];
            if (items.length === 0) return null;

            return (
              <section key={c.key} className="mb-10">
                <div className="flex items-center justify-between">
                  <div className="text-[28px] font-semibold text-[var(--brand-900)]">{c.title}</div>

                  <Link href={`/database/category/${c.key}`} className="text-[22px] font-semibold text-[var(--brand-900)]">
                    See All ›
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {items.slice(0, 3).map((it) => (
                    <Link
                      key={it.slug}
                      href={`/database/${it.slug}`}
                      className="block overflow-hidden rounded-3xl bg-white shadow ring-1 ring-black/5"
                    >
                      <div className="aspect-[4/3] w-full bg-white p-3">
                        <img src={it.image} alt={it.name} className="h-full w-full rounded-2xl object-contain" />
                      </div>
                      <div className="px-3 pb-3 text-[18px] font-semibold text-[var(--brand-900)]">{it.name}</div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
