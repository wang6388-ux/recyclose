import Link from "next/link";
import { notFound } from "next/navigation";
import type { CategoryKey } from "@/data/databaseCategories";
import { CATEGORY_ITEMS } from "@/data/databaseCategories";

function normalizeKey(raw: string): CategoryKey | null {
  const k = raw.trim().toLowerCase();
  if (k === "paper") return "Paper";
  if (k === "cardboard") return "Cardboard";
  if (k === "plastic") return "Plastic";
  if (k === "metal") return "Metal";
  if (k === "glass") return "Glass";
  if (k === "other") return "Other";
  return null;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params; // 关键：Next 16 里 params 需要 await

  const category = normalizeKey(key);
  if (!category) return notFound();

  const items = CATEGORY_ITEMS[category];

  return (
    <main>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-base font-semibold">{category}</div>
          <Link href="/database" className="text-sm font-medium underline">
            Back
          </Link>
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {items.map((it) => (
            <Link
            key={it.slug}
            href={`/database/${it.slug}`}
            className="block rounded-2xl border border-neutral-200 bg-white p-3"
          >
            <div className="aspect-square rounded-xl border border-neutral-200 bg-neutral-100" />
            <div className="mt-2 text-sm font-semibold text-neutral-900">{it.title}</div>
            <div className="mt-1 text-xs text-neutral-600">
              {it.excerpt ?? "Tap to view details"}
            </div>
          </Link>
          ))}
        </div>
      </div>
    </main>
  );
}