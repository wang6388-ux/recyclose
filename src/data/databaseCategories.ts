export type CategoryKey =
  | "Paper"
  | "Cardboard"
  | "Plastic"
  | "Metal"
  | "Glass"
  | "Other";

  export type DbPreviewItem = {
    slug: string;
    title: string;
    category: CategoryKey;
    excerpt?: string;
  };
  

export const SAVED: DbPreviewItem[] = [
  { slug: "battery", title: "Battery", category: "Other" },
  { slug: "plastic-jar", title: "Plastic Jar", category: "Plastic" },
  {
    slug: "corrugated-cardboard-box",
    title: "Corrugated Cardboard Box",
    category: "Cardboard",
  },
];

export const CATEGORY_ITEMS: Record<CategoryKey, DbPreviewItem[]> = {
  Paper: [
    { slug: "newspaper", title: "Newspaper", category: "Paper", excerpt: "Keep clean and dry." },
    { slug: "gift-wrap", title: "Gift Wrap", category: "Paper", excerpt: "Some glossy wraps are not recyclable." },
    { slug: "office-paper", title: "Office Paper", category: "Paper", excerpt: "Staples are usually OK." },
    { slug: "paper-bag", title: "Paper Bag", category: "Paper", excerpt: "Remove food residue." },
    { slug: "magazine", title: "Magazine", category: "Paper", excerpt: "Usually recyclable." },
  ],
  Cardboard: [
    {
      slug: "corrugated-cardboard",
      title: "Corrugated Cardboard Box",
      category: "Cardboard",
    },
    { slug: "boxboard", title: "Boxboard Box", category: "Cardboard" },
    { slug: "carrier-tray", title: "Carrier Tray", category: "Cardboard" },
  ],
  Plastic: [
    { slug: "plastic-jug", title: "Plastic Jug", category: "Plastic" },
    { slug: "plastic-bottle", title: "Plastic Bottle", category: "Plastic" },
    { slug: "plastic-jar", title: "Plastic Jar", category: "Plastic" },
  ],
  Metal: [
    { slug: "aluminum", title: "Aluminum", category: "Metal" },
    { slug: "steel", title: "Steel", category: "Metal" },
    { slug: "metal-not-accepted", title: "Not Accepted", category: "Metal" },
  ],
  Glass: [
    { slug: "glass-bottle", title: "Bottle", category: "Glass" },
    { slug: "glass-jar", title: "Jar", category: "Glass" },
    { slug: "glass-not-accepted", title: "Not Accepted", category: "Glass" },
  ],
  Other: [
    { slug: "furniture", title: "Furniture", category: "Other" },
    { slug: "tire", title: "Tire", category: "Other" },
    { slug: "battery", title: "Battery", category: "Other" },
  ],
};

export function findItemBySlug(slug: string): DbPreviewItem | null {
  const all = Object.values(CATEGORY_ITEMS).flat();
  return all.find((x) => x.slug === slug) ?? null;
}

export function listItemsBySlugs(slugs: string[]): DbPreviewItem[] {
  const all = Object.values(CATEGORY_ITEMS).flat();
  const map = new Map(all.map((it) => [it.slug, it]));
  return slugs.map((s) => map.get(s)).filter(Boolean) as DbPreviewItem[];
}