// lib/databaseData.ts

export type CategoryKey =
  | "glass"
  | "plastic"
  | "paper"
  | "metal"
  | "electronics"
  | "organic"
  | "hazardous";

export type DbCategory = {
  key: CategoryKey;
  title: string;
  subtitle?: string;
};

export type DbItem = {
  slug: string; // /database/[slug]
  name: string;
  category: CategoryKey;
  image: string; // card image
  examplePhotos: string[]; // 3 photos
  intro: string;
  sections: { title: string; body: string }[];
};

export const CATEGORIES: DbCategory[] = [
  { key: "glass", title: "Glass", subtitle: "Bottles, jars, and more" },
  { key: "plastic", title: "Plastic", subtitle: "Common packaging plastics" },
  { key: "paper", title: "Paper", subtitle: "Paper-based materials" },
  { key: "metal", title: "Metal", subtitle: "Aluminum and steel items" },
  { key: "electronics", title: "Electronics", subtitle: "E-waste and small devices" },
  { key: "organic", title: "Organic", subtitle: "Food scraps and yard waste" },
  { key: "hazardous", title: "Hazardous", subtitle: "Batteries, chemicals, and special waste" },
];

export const ITEMS: DbItem[] = [
  // ===================== GLASS (6) =====================
  {
    slug: "glass-bottle",
    name: "Bottle",
    category: "glass",
    image: "/db/glass/glass-bottle.png",
    examplePhotos: [
      "/db/glass/glass-bottle_1.png",
      "/db/glass/glass-bottle_2.png",
      "/db/glass/glass-bottle_3.png",
    ],
    intro: "Most glass bottles are recyclable. Rinse first and remove non-glass parts when possible.",
    sections: [
      { title: "Check Local Guidelines", body: "Some cities accept glass curbside, others require drop-off." },
      { title: "Preparation", body: "Empty, quick rinse. Remove caps and pumps if they are plastic/metal mixed." },
      { title: "Drop-off Centers", body: "If your curbside program excludes glass, search for glass-only bins." },
    ],
  },
  {
    slug: "glass-jar",
    name: "Jar",
    category: "glass",
    image: "/db/glass/glass-jar.png",
    examplePhotos: ["/db/glass/glass-jar_1.png", "/db/glass/glass-jar_2.png", "/db/glass/glass-jar_3.png"],
    intro: "Food jars are often accepted as container glass. Lids may be handled separately.",
    sections: [
      { title: "Rinse & Empty", body: "Remove food residue to reduce contamination and odors." },
      { title: "Lids", body: "Metal lids are sometimes recyclable with metal, plastic lids vary by program." },
      { title: "Not Accepted", body: "Heat-resistant glass (like some bakeware) is a different type and often excluded." },
    ],
  },
  {
    slug: "glass-cosmetic",
    name: "Cosmetic Glass (Perfume / Serum)",
    category: "glass",
    image: "/db/glass/glass-cosmetic.png",
    examplePhotos: [
      "/db/glass/glass-cosmetic_1.png",
      "/db/glass/glass-cosmetic_2.png",
      "/db/glass/glass-cosmetic_3.png",
    ],
    intro: "Small cosmetic bottles may be recyclable if empty. Pumps are usually mixed-material and not accepted.",
    sections: [
      { title: "Empty Fully", body: "Try to use up the product. Wipe thick residue with paper." },
      { title: "Remove Pump", body: "Spray pumps contain mixed plastic/metal and are often trash." },
      { title: "Alternative", body: "Some brands offer take-back programs for cosmetic packaging." },
    ],
  },
  {
    slug: "glass-wine",
    name: "Wine / Liquor Bottle",
    category: "glass",
    image: "/db/glass/glass-wine.png",
    examplePhotos: ["/db/glass/glass-wine_1.png", "/db/glass/glass-wine_2.png", "/db/glass/glass-wine_3.png"],
    intro: "Alcohol bottles are typically recyclable as container glass. Corks and caps depend on material.",
    sections: [
      { title: "Remove Cork/Cap", body: "Natural cork is compostable; synthetic cork is usually trash." },
      { title: "Rinse", body: "A quick rinse is enough. Avoid wasting lots of water." },
      { title: "Deposit Programs", body: "Some regions have bottle deposit systems. Follow local rules." },
    ],
  },
  {
    slug: "glass-drinking",
    name: "Drinking Glass",
    category: "glass",
    image: "/db/glass/glass-drinking.png",
    examplePhotos: [
      "/db/glass/glass-drinking_1.png",
      "/db/glass/glass-drinking_2.png",
      "/db/glass/glass-drinking_3.png",
    ],
    intro: "Most curbside programs do NOT accept drinking glasses because the glass type differs from bottles/jars.",
    sections: [
      { title: "Why Not", body: "Different melting point and composition can contaminate container-glass recycling." },
      { title: "Better Options", body: "Donate if usable. Otherwise look for specialty glass drop-off." },
      { title: "Safety", body: "Wrap broken pieces to prevent injuries to workers." },
    ],
  },
  {
    slug: "glass-ceramic-mirror",
    name: "Mirror / Ceramics (Special)",
    category: "glass",
    image: "/db/glass/glass-ceramic-mirror.png",
    examplePhotos: [
      "/db/glass/glass-ceramic-mirror_1.png",
      "/db/glass/glass-ceramic-mirror_2.png",
      "/db/glass/glass-ceramic-mirror_3.png",
    ],
    intro: "Mirrors and ceramics are usually not accepted in glass-container recycling.",
    sections: [
      { title: "Mirror", body: "Backing coatings make it different from container glass." },
      { title: "Ceramic", body: "Often treated as trash unless a specialty facility accepts it." },
      { title: "Reuse", body: "Consider donation or upcycling if intact." },
    ],
  },

  // ===================== PLASTIC (6) =====================
  {
    slug: "plastic-water-bottle",
    name: "Water Bottle (PET #1)",
    category: "plastic",
    image: "/db/plastic/plastic-water-bottle.png",
    examplePhotos: [
      "/db/plastic/plastic-water-bottle_1.png",
      "/db/plastic/plastic-water-bottle_2.png",
      "/db/plastic/plastic-water-bottle_3.png",
    ],
    intro: "PET #1 bottles are among the most commonly accepted plastics. Empty, cap rules vary.",
    sections: [
      { title: "Empty & Quick Rinse", body: "Remove liquid. Rinse if sticky." },
      { title: "Cap", body: "Some programs say keep cap on; others want caps off. Follow local guidance." },
      { title: "Crush?", body: "Crushing saves space but can affect sorting in some facilities. Optional." },
    ],
  },
  {
    slug: "plastic-milk-jug",
    name: "Milk Jug (HDPE #2)",
    category: "plastic",
    image: "/db/plastic/plastic-milk-jug.png",
    examplePhotos: [
      "/db/plastic/plastic-milk-jug_1.png",
      "/db/plastic/plastic-milk-jug_2.png",
      "/db/plastic/plastic-milk-jug_3.png",
    ],
    intro: "HDPE #2 is widely recyclable. Remove residue and flatten if allowed.",
    sections: [
      { title: "Rinse", body: "Milk residue smells quickly. Rinse lightly." },
      { title: "Cap & Spout", body: "Caps are smaller plastics; local rules differ." },
      { title: "Label", body: "Leave labels on unless local rules say otherwise." },
    ],
  },
  {
    slug: "plastic-detergent",
    name: "Detergent / Shampoo Bottle",
    category: "plastic",
    image: "/db/plastic/plastic-detergent.png",
    examplePhotos: [
      "/db/plastic/plastic-detergent_1.png",
      "/db/plastic/plastic-detergent_2.png",
      "/db/plastic/plastic-detergent_3.png",
    ],
    intro: "Many toiletry bottles are recyclable if empty. Pumps are usually not.",
    sections: [
      { title: "Empty Fully", body: "Use up product; scrape thick residue." },
      { title: "Remove Pump", body: "Mixed-material pumps often go to trash." },
      { title: "Rinse If Needed", body: "A quick rinse is enough for most." },
    ],
  },
  {
    slug: "plastic-takeout-container",
    name: "Takeout Container",
    category: "plastic",
    image: "/db/plastic/plastic-takeout.png",
    examplePhotos: [
      "/db/plastic/plastic-takeout_1.png",
      "/db/plastic/plastic-takeout_2.png",
      "/db/plastic/plastic-takeout_3.png",
    ],
    intro: "Acceptance varies a lot. Greasy containers are often rejected even if the plastic type is recyclable.",
    sections: [
      { title: "Cleanliness Matters", body: "If it’s oily/greasy, it may be trash." },
      { title: "Material ID", body: "Look for # on bottom. Even then, some programs still reject." },
      { title: "Better Alternative", body: "Use reusable containers when possible." },
    ],
  },
  {
    slug: "plastic-film-bag",
    name: "Plastic Film (Bags / Wrap)",
    category: "plastic",
    image: "/db/plastic/plastic-film.png",
    examplePhotos: ["/db/plastic/plastic-film_1.png", "/db/plastic/plastic-film_2.png", "/db/plastic/plastic-film_3.png"],
    intro: "Plastic bags and film usually do NOT go in curbside bins. Many grocery stores have drop-off bins.",
    sections: [
      { title: "Do Not Curbside", body: "Film tangles sorting machines and can shut down equipment." },
      { title: "Store Drop-off", body: "Use designated collection bins at stores if available." },
      { title: "Keep Dry & Clean", body: "Dirty or wet film is often rejected." },
    ],
  },
  {
    slug: "plastic-foam",
    name: "Foam (Styrofoam / EPS)",
    category: "plastic",
    image: "/db/plastic/plastic-foam.png",
    examplePhotos: ["/db/plastic/plastic-foam_1.png", "/db/plastic/plastic-foam_2.png", "/db/plastic/plastic-foam_3.png"],
    intro: "EPS foam is rarely accepted curbside. Some specialty drop-off programs exist.",
    sections: [
      { title: "Check Programs", body: "Some cities accept clean foam at specific sites." },
      { title: "Keep Clean", body: "Food-contaminated foam is usually trash." },
      { title: "Mail-in Options", body: "Some paid mail-in recycling programs accept foam." },
    ],
  },

  // ===================== PAPER (6) =====================
  {
    slug: "paper-cardboard",
    name: "Cardboard Box",
    category: "paper",
    image: "/db/paper/paper-cardboard.png",
    examplePhotos: [
      "/db/paper/paper-cardboard_1.png",
      "/db/paper/paper-cardboard_2.png",
      "/db/paper/paper-cardboard_3.png",
    ],
    intro: "Cardboard is commonly recyclable. Flatten to save space. Avoid wet/oily cardboard.",
    sections: [
      { title: "Flatten", body: "Break down boxes to prevent bin overflow." },
      { title: "Tape & Labels", body: "Small amounts are usually okay. Remove large plastic inserts." },
      { title: "Grease", body: "If soaked with oil, it may be compost or trash depending on your city." },
    ],
  },
  {
    slug: "paper-mail",
    name: "Mail & Envelopes",
    category: "paper",
    image: "/db/paper/paper-mail.png",
    examplePhotos: ["/db/paper/paper-mail_1.png", "/db/paper/paper-mail_2.png", "/db/paper/paper-mail_3.png"],
    intro: "Most paper mail is recyclable, including envelopes. Plastic windows vary by facility.",
    sections: [
      { title: "Remove Inserts", body: "Non-paper samples or plastic cards should be separated." },
      { title: "Shredded Paper", body: "Some cities accept in a paper bag; others don’t. Check local rules." },
      { title: "Privacy", body: "Shred sensitive documents before recycling." },
    ],
  },
  {
    slug: "paper-newspaper",
    name: "Newspaper",
    category: "paper",
    image: "/db/paper/paper-newspaper.png",
    examplePhotos: [
      "/db/paper/paper-newspaper_1.png",
      "/db/paper/paper-newspaper_2.png",
      "/db/paper/paper-newspaper_3.png",
    ],
    intro: "Newspaper is widely recyclable and also useful for packing or compost browns.",
    sections: [
      { title: "Keep Dry", body: "Wet paper can degrade and be rejected." },
      { title: "Bundle Optional", body: "Some programs want it loose; some allow bundling." },
      { title: "Reuse", body: "Can be used to wrap fragile items or clean windows." },
    ],
  },
  {
    slug: "paper-paperbag",
    name: "Paper Bag",
    category: "paper",
    image: "/db/paper/paper-bag.png",
    examplePhotos: ["/db/paper/paper-bag_1.png", "/db/paper/paper-bag_2.png", "/db/paper/paper-bag_3.png"],
    intro: "Clean paper bags are recyclable. Greasy ones may be compostable.",
    sections: [
      { title: "Handles", body: "Paper handles usually OK; plastic handles should be removed if possible." },
      { title: "Grease Rule", body: "If stained with oil, compost/trash depending on your program." },
      { title: "Reuse", body: "Great for collecting paper recycling or yard waste." },
    ],
  },
  {
    slug: "paper-carton",
    name: "Carton (Milk/Juice)",
    category: "paper",
    image: "/db/paper/paper-carton.png",
    examplePhotos: ["/db/paper/paper-carton_1.png", "/db/paper/paper-carton_2.png", "/db/paper/paper-carton_3.png"],
    intro: "Cartons are mixed material. Many cities accept them, but not all.",
    sections: [
      { title: "Empty & Rinse", body: "Reduce odor and residue." },
      { title: "Cap", body: "Plastic caps vary. Follow local rules." },
      { title: "Flatten", body: "Often ok to flatten to save space." },
    ],
  },
  {
    slug: "paper-receipt",
    name: "Receipts (Thermal Paper)",
    category: "paper",
    image: "/db/paper/paper-receipt.png",
    examplePhotos: ["/db/paper/paper-receipt_1.png", "/db/paper/paper-receipt_2.png", "/db/paper/paper-receipt_3.png"],
    intro: "Many facilities do NOT want thermal receipts in recycling due to coatings. Best treated as trash unless locally accepted.",
    sections: [
      { title: "How to Tell", body: "Thermal receipts feel smooth and turn dark when scratched." },
      { title: "Local Rules", body: "Some programs accept; many don’t." },
      { title: "Alternative", body: "Choose email receipts when possible." },
    ],
  },

  // ===================== METAL (6) =====================
  {
    slug: "metal-aluminum-can",
    name: "Aluminum Can",
    category: "metal",
    image: "/db/metal/metal-aluminum-can.png",
    examplePhotos: [
      "/db/metal/metal-aluminum-can_1.png",
      "/db/metal/metal-aluminum-can_2.png",
      "/db/metal/metal-aluminum-can_3.png",
    ],
    intro: "Aluminum cans are highly recyclable and valuable. Rinse and recycle.",
    sections: [
      { title: "Rinse", body: "Quick rinse helps reduce contamination." },
      { title: "Crush", body: "Often okay to crush; local rules vary." },
      { title: "Deposit", body: "Some places have cash deposits for cans." },
    ],
  },
  {
    slug: "metal-steel-can",
    name: "Steel / Tin Can",
    category: "metal",
    image: "/db/metal/metal-steel-can.png",
    examplePhotos: ["/db/metal/metal-steel-can_1.png", "/db/metal/metal-steel-can_2.png", "/db/metal/metal-steel-can_3.png"],
    intro: "Food cans are often recyclable if emptied and lightly rinsed.",
    sections: [
      { title: "Label", body: "Paper labels are usually fine to leave on." },
      { title: "Sharp Edges", body: "Be careful with cut lids. Tuck lid inside can if safe." },
      { title: "Not Accepted", body: "Paint cans with residue are hazardous waste." },
    ],
  },
  {
    slug: "metal-foil",
    name: "Aluminum Foil",
    category: "metal",
    image: "/db/metal/metal-foil.png",
    examplePhotos: ["/db/metal/metal-foil_1.png", "/db/metal/metal-foil_2.png", "/db/metal/metal-foil_3.png"],
    intro: "Foil may be recyclable only if clean and balled up. Greasy foil is often trash.",
    sections: [
      { title: "Clean Only", body: "Food-stained foil is commonly rejected." },
      { title: "Ball It Up", body: "Small pieces can fall through sorting; balling helps." },
      { title: "Alternative", body: "Use reusable baking mats when possible." },
    ],
  },
  {
    slug: "metal-aerosol",
    name: "Aerosol Can",
    category: "metal",
    image: "/db/metal/metal-aerosol.png",
    examplePhotos: ["/db/metal/metal-aerosol_1.png", "/db/metal/metal-aerosol_2.png", "/db/metal/metal-aerosol_3.png"],
    intro: "Empty aerosol cans may be recyclable in some areas, but partially full cans are hazardous.",
    sections: [
      { title: "Must Be Empty", body: "If it sprays, it’s not empty." },
      { title: "Local Guidance", body: "Rules differ widely. Check your city’s instructions." },
      { title: "Hazardous Option", body: "If not accepted, take to HHW (household hazardous waste)." },
    ],
  },
  {
    slug: "metal-scrap-small",
    name: "Small Scrap Metal",
    category: "metal",
    image: "/db/metal/metal-scrap-small.png",
    examplePhotos: [
      "/db/metal/metal-scrap-small_1.png",
      "/db/metal/metal-scrap-small_2.png",
      "/db/metal/metal-scrap-small_3.png",
    ],
    intro: "Loose small metal parts may not be accepted curbside. Scrap yards or drop-off sites often work better.",
    sections: [
      { title: "Curbside Risk", body: "Small pieces can fall through sorting lines." },
      { title: "Drop-off", body: "Use designated scrap metal collection sites." },
      { title: "Separate Materials", body: "Avoid mixed plastic/metal parts unless accepted." },
    ],
  },
  {
    slug: "metal-pots-pans",
    name: "Pots & Pans",
    category: "metal",
    image: "/db/metal/metal-pots-pans.png",
    examplePhotos: ["/db/metal/metal-pots-pans_1.png", "/db/metal/metal-pots-pans_2.png", "/db/metal/metal-pots-pans_3.png"],
    intro: "Cookware is usually not curbside. Donate if usable, otherwise scrap metal drop-off.",
    sections: [
      { title: "Non-stick Coatings", body: "Still generally scrap, but confirm with facility." },
      { title: "Donation", body: "If in good condition, donation is best." },
      { title: "Scrap Yard", body: "Many scrap yards accept metal cookware." },
    ],
  },

  // ===================== ELECTRONICS (6) =====================
  {
    slug: "ewaste-phone",
    name: "Smartphone",
    category: "electronics",
    image: "/db/electronics/ewaste-phone.png",
    examplePhotos: [
      "/db/electronics/ewaste-phone_1.png",
      "/db/electronics/ewaste-phone_2.png",
      "/db/electronics/ewaste-phone_3.png",
    ],
    intro: "Phones contain valuable materials and data. Recycle through e-waste programs and wipe your data first.",
    sections: [
      { title: "Data Wipe", body: "Back up, sign out, factory reset. Remove SIM/SD card." },
      { title: "Take-back", body: "Many retailers and manufacturers offer trade-in programs." },
      { title: "Battery Safety", body: "Damaged phones may be treated as hazardous due to batteries." },
    ],
  },
  {
    slug: "ewaste-laptop",
    name: "Laptop",
    category: "electronics",
    image: "/db/electronics/ewaste-laptop.png",
    examplePhotos: [
      "/db/electronics/ewaste-laptop_1.png",
      "/db/electronics/ewaste-laptop_2.png",
      "/db/electronics/ewaste-laptop_3.png",
    ],
    intro: "Laptops should go to e-waste recycling, not curbside. Always wipe storage devices.",
    sections: [
      { title: "Secure Erase", body: "Use built-in OS reset or a secure erase tool. Consider removing the SSD." },
      { title: "Donation", body: "If it still works, donate to extend its life." },
      { title: "Retail Drop-off", body: "Many tech stores accept laptops for recycling." },
    ],
  },
  {
    slug: "ewaste-cables",
    name: "Cables & Chargers",
    category: "electronics",
    image: "/db/electronics/ewaste-cables.png",
    examplePhotos: [
      "/db/electronics/ewaste-cables_1.png",
      "/db/electronics/ewaste-cables_2.png",
      "/db/electronics/ewaste-cables_3.png",
    ],
    intro: "Cables contain copper and should go to e-waste or scrap programs. Don’t put in curbside bins.",
    sections: [
      { title: "Bundle", body: "Tie cables together to keep them organized." },
      { title: "Reuse", body: "Donate working chargers to thrift stores." },
      { title: "Drop-off", body: "E-waste depots often accept cords and chargers." },
    ],
  },
  {
    slug: "ewaste-headphones",
    name: "Headphones",
    category: "electronics",
    image: "/db/electronics/ewaste-headphones.png",
    examplePhotos: [
      "/db/electronics/ewaste-headphones_1.png",
      "/db/electronics/ewaste-headphones_2.png",
      "/db/electronics/ewaste-headphones_3.png",
    ],
    intro: "Small electronics are best handled via e-waste collection. Donate if still usable.",
    sections: [
      { title: "Donation", body: "If clean and working, donation is preferred." },
      { title: "E-waste", body: "Otherwise, recycle via electronics drop-off." },
      { title: "Avoid Curbside", body: "Small devices can be lost in sorting and become contamination." },
    ],
  },
  {
    slug: "ewaste-remote",
    name: "Remote Control",
    category: "electronics",
    image: "/db/electronics/ewaste-remote.png",
    examplePhotos: [
      "/db/electronics/ewaste-remote_1.png",
      "/db/electronics/ewaste-remote_2.png",
      "/db/electronics/ewaste-remote_3.png",
    ],
    intro: "Remotes are mixed plastic/electronics. Remove batteries and recycle as e-waste when possible.",
    sections: [
      { title: "Remove Batteries", body: "Batteries should be recycled separately." },
      { title: "E-waste Drop-off", body: "Look for small electronics bins." },
      { title: "Reuse", body: "If working, consider resale or donation." },
    ],
  },
  {
    slug: "ewaste-small-appliance",
    name: "Small Appliance (Toaster / Fan)",
    category: "electronics",
    image: "/db/electronics/ewaste-small-appliance.png",
    examplePhotos: [
      "/db/electronics/ewaste-small-appliance_1.png",
      "/db/electronics/ewaste-small-appliance_2.png",
      "/db/electronics/ewaste-small-appliance_3.png",
    ],
    intro: "Small appliances are often accepted at e-waste facilities, not curbside recycling.",
    sections: [
      { title: "Check Facility", body: "Some facilities accept appliances; others require scrap yards." },
      { title: "Remove Loose Parts", body: "Detach removable batteries or cartridges." },
      { title: "Donation", body: "Working appliances should be donated first." },
    ],
  },

  // ===================== ORGANIC (6) =====================
  {
    slug: "organic-food-scraps",
    name: "Food Scraps",
    category: "organic",
    image: "/db/organic/organic-food-scraps.png",
    examplePhotos: [
      "/db/organic/organic-food-scraps_1.png",
      "/db/organic/organic-food-scraps_2.png",
      "/db/organic/organic-food-scraps_3.png",
    ],
    intro: "Food scraps can go to compost in many cities. Rules vary for meat, dairy, and bones.",
    sections: [
      { title: "What’s Accepted", body: "Some programs accept all food; others exclude meat/dairy." },
      { title: "Compost Bags", body: "Use certified compostable liners if allowed by your program." },
      { title: "Reduce Odor", body: "Freeze scraps or use paper to absorb moisture." },
    ],
  },
  {
    slug: "organic-yard-waste",
    name: "Yard Waste (Leaves / Grass)",
    category: "organic",
    image: "/db/organic/organic-yard-waste.png",
    examplePhotos: [
      "/db/organic/organic-yard-waste_1.png",
      "/db/organic/organic-yard-waste_2.png",
      "/db/organic/organic-yard-waste_3.png",
    ],
    intro: "Yard waste is commonly accepted for composting. Remove plastics and rocks.",
    sections: [
      { title: "Keep Clean", body: "No trash, plastic, or stones." },
      { title: "Seasonal Pickup", body: "Some cities have specific yard-waste schedules." },
      { title: "DIY Compost", body: "Leaves and grass are great compost inputs if you have a bin." },
    ],
  },
  {
    slug: "organic-coffee-grounds",
    name: "Coffee Grounds",
    category: "organic",
    image: "/db/organic/organic-coffee.png",
    examplePhotos: ["/db/organic/organic-coffee_1.png", "/db/organic/organic-coffee_2.png", "/db/organic/organic-coffee_3.png"],
    intro: "Coffee grounds are compost-friendly. Filters depend on material (paper vs plastic).",
    sections: [
      { title: "Filters", body: "Paper filters are usually compostable; plastic pods are not." },
      { title: "Garden Use", body: "Can be mixed into compost, not piled thickly on soil." },
      { title: "Odor", body: "Keep in a sealed container if storing indoors." },
    ],
  },
  {
    slug: "organic-egg-shells",
    name: "Eggshells",
    category: "organic",
    image: "/db/organic/organic-eggshells.png",
    examplePhotos: [
      "/db/organic/organic-eggshells_1.png",
      "/db/organic/organic-eggshells_2.png",
      "/db/organic/organic-eggshells_3.png",
    ],
    intro: "Eggshells compost well but break down faster if crushed.",
    sections: [
      { title: "Crush", body: "Crushing helps decomposition and reduces sharp pieces." },
      { title: "Rinse Optional", body: "Usually not necessary for municipal compost." },
      { title: "Garden Tip", body: "Can add calcium but doesn’t replace soil testing." },
    ],
  },
  {
    slug: "organic-pizza-box",
    name: "Pizza Box",
    category: "organic",
    image: "/db/organic/organic-pizza-box.png",
    examplePhotos: [
      "/db/organic/organic-pizza-box_1.png",
      "/db/organic/organic-pizza-box_2.png",
      "/db/organic/organic-pizza-box_3.png",
    ],
    intro: "Greasy pizza boxes are usually NOT recyclable as paper, but may be compostable if your program accepts it.",
    sections: [
      { title: "Separate Clean Parts", body: "The clean lid may be recyclable; greasy bottom often isn’t." },
      { title: "Compost Rules", body: "Some compost programs accept food-soiled paper." },
      { title: "When in Doubt", body: "If very greasy and no compost option, trash." },
    ],
  },
  {
    slug: "organic-paper-towels",
    name: "Paper Towels / Napkins",
    category: "organic",
    image: "/db/organic/organic-paper-towels.png",
    examplePhotos: [
      "/db/organic/organic-paper-towels_1.png",
      "/db/organic/organic-paper-towels_2.png",
      "/db/organic/organic-paper-towels_3.png",
    ],
    intro: "Used paper towels are usually not recyclable. They may be compostable depending on what they touched.",
    sections: [
      { title: "Compostable If", body: "Food-only residue is often okay in compost." },
      { title: "Not Compostable If", body: "Chemical cleaners, oil/grease heavy, or medical waste." },
      { title: "Reduce Waste", body: "Use cloth towels for routine cleaning when possible." },
    ],
  },

  // ===================== HAZARDOUS (6) =====================
  {
    slug: "haz-batteries",
    name: "Household Batteries",
    category: "hazardous",
    image: "/db/hazardous/haz-batteries.png",
    examplePhotos: [
      "/db/hazardous/haz-batteries_1.png",
      "/db/hazardous/haz-batteries_2.png",
      "/db/hazardous/haz-batteries_3.png",
    ],
    intro: "Batteries should NOT go in curbside bins due to fire risk. Use battery drop-off programs.",
    sections: [
      { title: "Tape Terminals", body: "Tape the ends of lithium and 9V batteries to prevent shorts." },
      { title: "Drop-off", body: "Many stores and HHW sites accept household batteries." },
      { title: "Safety", body: "Damaged/swollen batteries require special handling." },
    ],
  },
  {
    slug: "haz-lithium",
    name: "Lithium Battery (Swollen / Damaged)",
    category: "hazardous",
    image: "/db/hazardous/haz-lithium.png",
    examplePhotos: ["/db/hazardous/haz-lithium_1.png", "/db/hazardous/haz-lithium_2.png", "/db/hazardous/haz-lithium_3.png"],
    intro: "Damaged lithium batteries are high fire risk. Follow local HHW instructions and avoid regular drop bins.",
    sections: [
      { title: "Do Not Puncture", body: "Never crush or puncture swollen packs." },
      { title: "Isolate", body: "Store in a non-flammable container away from heat." },
      { title: "HHW Only", body: "Bring to a household hazardous waste facility if available." },
    ],
  },
  {
    slug: "haz-paint",
    name: "Paint & Solvents",
    category: "hazardous",
    image: "/db/hazardous/haz-paint.png",
    examplePhotos: ["/db/hazardous/haz-paint_1.png", "/db/hazardous/haz-paint_2.png", "/db/hazardous/haz-paint_3.png"],
    intro: "Latex paint and solvents often require special disposal. Never pour into drains.",
    sections: [
      { title: "Latex Paint", body: "Some cities allow dried latex paint in trash; others require drop-off." },
      { title: "Oil-based", body: "Usually hazardous waste only." },
      { title: "Donate", body: "Unopened usable paint may be accepted by reuse centers." },
    ],
  },
  {
    slug: "haz-meds",
    name: "Medications",
    category: "hazardous",
    image: "/db/hazardous/haz-meds.png",
    examplePhotos: ["/db/hazardous/haz-meds_1.png", "/db/hazardous/haz-meds_2.png", "/db/hazardous/haz-meds_3.png"],
    intro: "Do not flush medications. Use pharmacy take-back programs when available.",
    sections: [
      { title: "Take-back", body: "Many pharmacies and police stations have drop boxes." },
      { title: "Privacy", body: "Remove personal info from labels when disposing containers." },
      { title: "If No Program", body: "Follow local guidance for safe trash disposal." },
    ],
  },
  {
    slug: "haz-lightbulbs",
    name: "Light Bulbs (CFL / LED)",
    category: "hazardous",
    image: "/db/hazardous/haz-lightbulbs.png",
    examplePhotos: [
      "/db/hazardous/haz-lightbulbs_1.png",
      "/db/hazardous/haz-lightbulbs_2.png",
      "/db/hazardous/haz-lightbulbs_3.png",
    ],
    intro: "Some bulbs contain materials that shouldn’t go in trash. CFLs often need special recycling.",
    sections: [
      { title: "CFL", body: "Contains small amounts of mercury. Use designated drop-off." },
      { title: "LED", body: "Often handled as e-waste. Check local programs." },
      { title: "Broken Bulb", body: "Follow safety cleanup guidance; avoid vacuuming CFL dust." },
    ],
  },
  {
    slug: "haz-chemicals",
    name: "Household Chemicals",
    category: "hazardous",
    image: "/db/hazardous/haz-chemicals.png",
    examplePhotos: [
      "/db/hazardous/haz-chemicals_1.png",
      "/db/hazardous/haz-chemicals_2.png",
      "/db/hazardous/haz-chemicals_3.png",
    ],
    intro: "Cleaning chemicals and pesticides often require HHW disposal. Never mix chemicals.",
    sections: [
      { title: "Keep Original Container", body: "Labels matter for safe handling." },
      { title: "Do Not Mix", body: "Mixing can produce toxic fumes." },
      { title: "HHW Site", body: "Bring to household hazardous waste drop-off if available." },
    ],
  },
];

// ---- helpers (必须导出，给 pages 用) ----
export function isCategorySlug(slug: string) {
  return CATEGORIES.some((c) => c.key === (slug as CategoryKey));
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.key === (slug as CategoryKey)) ?? null;
}

export function getItemsByCategory(category: CategoryKey) {
  return ITEMS.filter((x) => x.category === category);
}

export function getItemBySlug(slug: string) {
  return ITEMS.find((x) => x.slug === slug) ?? null;
}
