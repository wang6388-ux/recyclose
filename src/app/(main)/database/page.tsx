import Link from "next/link";
import CategorySection from "@/components/CategorySection";
import SavedRow from "@/components/SavedRow";
import { CATEGORY_ITEMS } from "@/data/databaseCategories";

export default function DatabasePage() {
  return (
    <main>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="px-4 py-3 text-base font-semibold">Database</div>
      </header>

      <div className="px-4 py-4">
        <section>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Your Saved List</div>
            <Link
              href="/database/saved"
              className="text-xs font-medium text-neutral-500"
            >
              See All &gt;
            </Link>
          </div>

          <SavedRow />
        </section>

        <CategorySection title="Paper" items={CATEGORY_ITEMS.Paper} />
        <CategorySection title="Cardboard" items={CATEGORY_ITEMS.Cardboard} />
        <CategorySection title="Plastic" items={CATEGORY_ITEMS.Plastic} />
        <CategorySection title="Metal" items={CATEGORY_ITEMS.Metal} />
        <CategorySection title="Glass" items={CATEGORY_ITEMS.Glass} />
        <CategorySection title="Other" items={CATEGORY_ITEMS.Other} />
      </div>
    </main>
  );
}
