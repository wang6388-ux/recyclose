// src/lib/dropoffData.ts
export type DropoffCategory =
  | "Recycling Center"
  | "Donation Center"
  | "Waste & Garbage"
  | "Community Recycling";

export type DropoffPoint = {
  id: string;
  name: string;
  category: DropoffCategory;
  address: string;
  hours: string;
  tags: string[];
  pickup: boolean;
  phone: string;
  url: string;
  rating: number;
  ratingCount: number;
  lng: number;
  lat: number;
  heroImage: string;
};

export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1520975958225-1ecf4d798c3a?auto=format&fit=crop&w=1400&q=80",
] as const;

const CITY_SEEDS = [
  { city: "Seattle", lat: 47.6062, lng: -122.3321 },
  { city: "Bellevue", lat: 47.6101, lng: -122.2015 },
  { city: "Redmond", lat: 47.67399, lng: -122.1215 },
  { city: "Kirkland", lat: 47.6769, lng: -122.2060 },
  { city: "Renton", lat: 47.4829, lng: -122.2171 },
  { city: "Issaquah", lat: 47.5301, lng: -122.0326 },
  { city: "Sammamish", lat: 47.6163, lng: -122.0356 },
  { city: "Bothell", lat: 47.7623, lng: -122.2054 },
  { city: "Lynnwood", lat: 47.8209, lng: -122.3151 },
  { city: "Shoreline", lat: 47.7557, lng: -122.3415 },
  { city: "Everett", lat: 47.978984, lng: -122.202079 },
  { city: "Tacoma", lat: 47.2529, lng: -122.4443 },
] as const;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function makeFakePointsDeterministic(
  n = 60,
  filterTagKeys: string[] = ["paper", "plastic", "metal", "glass", "battery", "electronics", "textile", "furniture", "other"]
): DropoffPoint[] {
  const namesA = ["GreenCycle", "Renew", "Cascade", "North Loop", "Blue Planet", "EcoWise", "Reclaim", "Cedar", "Pine", "Lakeview"] as const;
  const namesB = ["Hub", "Center", "Station", "Dropoff", "Facility", "Depot", "Program"] as const;
  const types: DropoffCategory[] = ["Recycling Center", "Donation Center", "Waste & Garbage", "Community Recycling"];

  const out: DropoffPoint[] = [];
  for (let i = 0; i < n; i++) {
    const rng = mulberry32(hashStr(`dropoff-${i + 1}`));

    const seed = CITY_SEEDS[Math.floor(rng() * CITY_SEEDS.length)];
    const lng = seed.lng + (rng() - 0.5) * 0.5;
    const lat = seed.lat + (rng() - 0.5) * 0.36;

    const t = types[Math.floor(rng() * types.length)];
    const tagCount = 2 + Math.floor(rng() * 4);
    const tags = new Set<string>();
    while (tags.size < tagCount) {
      tags.add(filterTagKeys[Math.floor(rng() * filterTagKeys.length)]);
    }

    const rating = Number(clamp(3.6 + rng() * 1.3, 0, 5).toFixed(1));
    const ratingCount = Math.floor(8 + rng() * 240);

    const phone = `(${Math.floor(200 + rng() * 799)}) ${Math.floor(200 + rng() * 799)}-${Math.floor(1000 + rng() * 8999)}`;

    out.push({
      id: String(i + 1),
      name: `${namesA[Math.floor(rng() * namesA.length)]} ${namesB[Math.floor(rng() * namesB.length)]}`,
      category: t,
      address: `${Math.floor(10 + rng() * 989)} ${["Cedar", "Pine", "Lake", "Union", "Market", "Rainier", "Aurora"][Math.floor(rng() * 7)]} St, ${seed.city}`,
      hours: ["8:00 AM - 5:00 PM", "7:30 AM - 3:30 PM", "10:00 AM - 6:00 PM", "9:00 AM - 4:00 PM"][Math.floor(rng() * 4)],
      tags: Array.from(tags),
      pickup: rng() < 0.35,
      phone,
      url: "https://example.com",
      rating,
      ratingCount,
      lng,
      lat,
      heroImage: HERO_IMAGES[Math.floor(rng() * HERO_IMAGES.length)],
    });
  }
  return out;
}
