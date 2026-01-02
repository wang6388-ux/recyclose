// app/database/[slug]/page.tsx
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  isCategorySlug,
  getCategoryBySlug,
  getItemsByCategory,
  getItemBySlug,
} from "@/lib/databaseData";
import { toggleSaved, useSavedSlugs } from "@/lib/savedDb";

function BigRowCard({ href, image, name }: { href: string; image: string; name: string }) {
  return (
    <Link
      href={href}
      className="w-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200"
    >
      <div className="flex items-center gap-5 px-5 py-5">
        <div className="flex h-[76px] w-[110px] items-center justify-center rounded-2xl bg-white">
          <img src={image} alt={name} className="h-[72px] w-[96px] object-contain" />
        </div>
        <div className="text-[28px] font-semibold text-[var(--brand-900)]">{name}</div>
      </div>
    </Link>
  );
}

function AccordionRow({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[rgba(46,63,58,.18)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <div className="text-[22px] font-semibold text-[var(--brand-900)]">{title}</div>
        <div className="text-[22px] text-[var(--brand-900)] opacity-70">{open ? "⌃" : "⌄"}</div>
      </button>
      {open ? (
        <div className="pb-4 text-[18px] leading-relaxed text-[rgba(46,63,58,.82)]">{body}</div>
      ) : null}
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[var(--brand-900)] px-5 pt-10 pb-4 text-white">
      <div className="text-[34px] font-semibold">Database</div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-white px-4">
          <span className="text-neutral-500">🔍</span>
          <input
            placeholder="Search"
            className="w-full bg-transparent text-[18px] text-neutral-900 outline-none"
          />
        </div>
        <button className="h-12 w-12 rounded-2xl bg-white text-[var(--brand-900)] shadow-sm" aria-label="Camera">
          📷
        </button>
      </div>
    </div>
  );
}

export default function DatabaseSlugPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const savedSlugs = useSavedSlugs();

  const mode = useMemo(() => (isCategorySlug(slug) ? "category" : "item"), [slug]);

  if (mode === "category") {
    const cat = getCategoryBySlug(slug);
    if (!cat) return <main className="min-h-screen bg-neutral-100 p-6">Not found</main>;

    const items = getItemsByCategory(cat.key);

    return (
      <main className="min-h-screen bg-neutral-100" style={{ paddingBottom: "var(--bottom-nav-h, 88px)" }}>
        <Header />

        <div className="bg-white px-5 py-4 shadow-sm">
          <Link href="/database" className="text-[22px] font-semibold text-[var(--brand-900)] opacity-80">
            ‹ Back
          </Link>
        </div>

        <div className="px-5 pt-6">
          <div className="text-[34px] font-semibold text-[var(--brand-900)]">{cat.title}</div>
          <div className="mt-5 space-y-5">
            {items.map((it) => (
              <BigRowCard key={it.slug} href={`/database/${it.slug}`} image={it.image} name={it.name} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const item = getItemBySlug(slug);
  if (!item) return <main className="min-h-screen bg-neutral-100 p-6">Not found</main>;

  const isOn = savedSlugs.includes(item.slug);

  return (
    <main className="min-h-screen bg-neutral-100" style={{ paddingBottom: "var(--bottom-nav-h, 88px)" }}>
      <Header />

      <div className="bg-white px-5 py-4 shadow-sm">
        <Link href={`/database/category/${item.category}`} className="text-[22px] font-semibold text-[var(--brand-900)] opacity-80">
          ‹ Back
        </Link>
      </div>

      <div className="px-5 pt-6">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200">
          <div className="flex items-center gap-3 px-5 pt-5">
            <div className="text-[32px] font-semibold text-[var(--brand-900)]">{item.name}</div>

            <button
              onClick={() => toggleSaved(item.slug)}
              className={[
                "ml-2 rounded-xl px-3 py-2 ring-1",
                isOn ? "bg-[var(--brand-900)] text-white ring-[var(--brand-900)]" : "text-[var(--brand-900)] ring-neutral-200",
              ].join(" ")}
              aria-label="Bookmark"
              title={isOn ? "Saved" : "Save"}
            >
              {isOn ? "★" : "☆"}
            </button>

            <button
              onClick={() => router.back()}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(46,63,58,.08)] text-[var(--brand-900)]"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            <div className="px-5 pb-3 text-[22px] font-semibold text-[var(--brand-900)]">Example Photos</div>
            <div className="bg-[rgba(120,160,155,.25)] px-5 py-4">
              <div className="flex gap-4 overflow-x-auto">
                {item.examplePhotos.map((src, idx) => (
                  <div key={idx} className="h-[130px] w-[130px] shrink-0 overflow-hidden rounded-3xl bg-white">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 py-5 text-[20px] leading-relaxed text-[rgba(46,63,58,.82)]">{item.intro}</div>

          <div className="px-5 pb-4">
            {item.sections.map((s) => (
              <AccordionRow key={s.title} title={s.title} body={s.body} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
