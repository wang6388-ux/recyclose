import Link from "next/link";
import type { DbPreviewItem } from "@/data/databaseCategories";

export default function CategorySection({
  title,
  items,
}: {
  title: string;
  items: DbPreviewItem[];
}) {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <Link
          href={`/database/category/${encodeURIComponent(title.toLowerCase())}`}
          className="text-xs font-medium text-neutral-500"
        >
          See All &gt;
        </Link>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-3">
        {items.slice(0, 3).map((it) => (
          <Link key={it.slug} href={`/database/${it.slug}`} className="block">
            <div className="aspect-square rounded-xl border border-neutral-200 bg-neutral-100" />
            <div className="mt-1 text-[11px] leading-4 text-neutral-700">
              {it.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}