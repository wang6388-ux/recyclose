"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import SaveButton from "@/components/SaveButton";
import { findItemBySlug } from "@/data/databaseCategories";

type Article = {
  examplePhotos: number;
  blocks: Array<
    | { kind: "text"; heading: string; body: string }
    | { kind: "button"; label: string; href: string }
  >;
};

function getArticle(slug: string): Article | null {
  const map: Record<string, Article> = {
    styrofoam: {
      examplePhotos: 3,
      blocks: [
        {
          kind: "text",
          heading: "Recycling Styrofoam",
          body:
            "Styrofoam (polystyrene) is lightweight and difficult to recycle. Many curbside programs do not accept it.",
        },
        {
          kind: "text",
          heading: "What to do",
          body:
            "Look for dedicated drop-off locations or periodic collection events. If none exist locally, avoid where possible and reuse clean pieces for packaging.",
        },
        { kind: "button", label: "Check Nearby Drop-off Centers", href: "/dropoff?q=styrofoam" },
      ],
    },

    newspaper: {
      examplePhotos: 3,
      blocks: [
        {
          kind: "text",
          heading: "Newspaper",
          body:
            "Most curbside programs accept clean and dry newspapers. Remove plastic sleeves and keep it free of food contamination.",
        },
        {
          kind: "text",
          heading: "Tips",
          body:
            "Bundle newspapers or place them in a paper bag. If your local program requires sorting, follow the city’s instructions.",
        },
        { kind: "button", label: "Find Nearby Recycling Info", href: "/dropoff?q=newspaper" },
      ],
    },

    "office-paper": {
      examplePhotos: 3,
      blocks: [
        {
          kind: "text",
          heading: "Office Paper",
          body:
            "Printer paper is commonly recyclable when clean. Staples are often fine, but avoid wax-coated or heavily laminated sheets.",
        },
        { kind: "button", label: "Find Paper Drop-off", href: "/dropoff?q=paper" },
      ],
    },
  };

  return map[slug] ?? null;
}

export default function ItemDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const item = useMemo(() => (slug ? findItemBySlug(slug) : null), [slug]);
  const article = useMemo(() => (slug ? getArticle(slug) : null), [slug]);

  if (!slug || !item) {
    return (
      <main className="px-4 py-6">
        <div className="text-base font-semibold">Item not found</div>
        <Link href="/database" className="mt-3 inline-block underline">
          Back to Database
        </Link>
      </main>
    );
  }

  return (
    <main>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-base font-semibold">{item.title}</div>
          <Link href="/database" className="text-sm font-medium underline">
            Back
          </Link>
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="text-xs text-neutral-500">{item.category}</div>

        {/* ✅ 现在一定会显示，并且一定能点 */}
        <div className="mt-3">
          <SaveButton slug={slug} />
        </div>

        {article ? (
          <>
            <div className="mt-4">
              <div className="text-sm font-semibold">Example Photos</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {Array.from({ length: article.examplePhotos }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl border border-neutral-200 bg-neutral-100"
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {article.blocks.map((b, idx) => {
                if (b.kind === "button") {
                  return (
                    <Link
                      key={idx}
                      href={b.href}
                      className="block w-full rounded-2xl bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white"
                    >
                      {b.label}
                    </Link>
                  );
                }

                return (
                  <section
                    key={idx}
                    className="rounded-2xl border border-neutral-200 bg-white p-4"
                  >
                    <div className="text-sm font-semibold">{b.heading}</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                      {b.body}
                    </p>
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="text-sm font-semibold">About this item</div>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                This item belongs to the {item.category} category. Recycling rules vary by location,
                so check local guidelines or search for nearby drop-off options.
              </p>
            </div>

            <Link
              href={`/dropoff?q=${encodeURIComponent(item.title)}`}
              className="block w-full rounded-2xl bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white"
            >
              📍 Find Nearby Drop-off
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
