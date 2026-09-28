import type { Category, MenuItem } from "@/lib/types";

/**
 * The real Zingwangwa menu (from the market poster). Used as:
 *  1. Static fallback so the app runs beautifully without Supabase configured.
 *  2. The source for supabase/seed.sql.
 * Images live in /public/menu (from the brand reference shoot).
 */

export const SEED_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Chips & Grilled Chicken", slug: "chips", sort_order: 1, icon: "🍟" },
  { name: "Shawarma", slug: "shawarma", sort_order: 2, icon: "🌯" },
  { name: "Snacks", slug: "snacks", sort_order: 3, icon: "🥟" },
  { name: "Cupcakes", slug: "cupcakes", sort_order: 4, icon: "🧁" },
];

/** ids are stable slugs in fallback mode; the DB uses uuid + these slugs in seed. */
export const FALLBACK_MENU: MenuItem[] = [
  // ── Chips & Grilled Chicken ──────────────────────────────
  {
    id: "plain-chips", category_id: "chips", name: "Plain Chips",
    description: "Golden, crispy, fluffy inside. The classic that started it all.",
    price_zmw: 2000, image_url: "/menu/plain-chips.png", tags: ["classic"],
    is_available: true, is_featured: false, spice_level: "none", prep_time_mins: 10,
  },
  {
    id: "grill-chips", category_id: "chips", name: "Grill & Chips",
    description: "Flame-kissed grilled chicken over a mountain of hot chips. The people's favourite.",
    price_zmw: 4500, image_url: "/menu/grill-chips.png", tags: ["signature", "grilled"],
    is_available: true, is_featured: true, spice_level: "medium", prep_time_mins: 20,
  },
  {
    id: "sausage-chips", category_id: "chips", name: "Sausage + Chips",
    description: "Smoky grilled sausage snuggling a generous pile of chips.",
    price_zmw: 4500, image_url: "/menu/sausage-chips.png", tags: ["grilled"],
    is_available: true, is_featured: false, spice_level: "mild", prep_time_mins: 15,
  },
  {
    id: "chips-meatballs", category_id: "chips", name: "Chips + Meatballs",
    description: "Juicy hand-rolled meatballs, saucy and serious, on crispy chips.",
    price_zmw: 4500, image_url: "/menu/chips-meatballs.png", tags: ["signature"],
    is_available: true, is_featured: true, spice_level: "mild", prep_time_mins: 18,
  },
  {
    id: "egg-chips", category_id: "chips", name: "Egg & Chips",
    description: "Fried eggs sunny-side over golden chips. Simple. Perfect.",
    price_zmw: 3000, image_url: "/menu/egg-chips.png", tags: ["breakfast"],
    is_available: true, is_featured: false, spice_level: "none", prep_time_mins: 12,
  },
  // ── Shawarma ─────────────────────────────────────────────
  {
    id: "plain-chapati", category_id: "shawarma", name: "Plain Chapati",
    description: "Soft, warm, buttery chapati — the perfect sidekick.",
    price_zmw: 1000, image_url: null, tags: ["side"],
    is_available: true, is_featured: false, spice_level: "none", prep_time_mins: 5,
  },
  {
    id: "made-by-wifey", category_id: "shawarma", name: "Made By Wifey",
    description: "The big boss. Loaded shawarma with everything — grilled meat, sauce, crunch. Made with love.",
    price_zmw: 8000, image_url: "/menu/made-by-wifey.png", tags: ["signature", "loaded"],
    is_available: true, is_featured: true, spice_level: "hot", prep_time_mins: 15,
  },
  {
    id: "chicken-mash", category_id: "shawarma", name: "Chicken Mash",
    description: "Tender chicken chunks mashed into a saucy wrap. Big flavor energy.",
    price_zmw: 4500, image_url: "/menu/chicken-mash.png", tags: ["chicken"],
    is_available: true, is_featured: false, spice_level: "medium", prep_time_mins: 12,
  },
  {
    id: "sumthn-mncy", category_id: "shawarma", name: "Sumthn Mncy",
    description: "Something… money. 💰 Trust us. Mince-loaded wrap with our secret sauce.",
    price_zmw: 4500, image_url: null, tags: ["signature"],
    is_available: true, is_featured: false, spice_level: "medium", prep_time_mins: 12,
  },
  {
    id: "sausage-swirl", category_id: "shawarma", name: "Sausage Swirl",
    description: "Grilled sausage swirled into a warm wrap with drippy sauce.",
    price_zmw: 4500, image_url: "/menu/sausage-swirl.png", tags: ["grilled"],
    is_available: true, is_featured: false, spice_level: "mild", prep_time_mins: 12,
  },
  {
    id: "jamaica-vibes", category_id: "shawarma", name: "Jamaica Vibes",
    description: "Jerk-spiced wrap that brings the island heat. Good vibes only. 🌴",
    price_zmw: 2000, image_url: "/menu/jamaica-vibes.png", tags: ["spicy"],
    is_available: true, is_featured: false, spice_level: "zing", prep_time_mins: 10,
  },
  {
    id: "egg-shawarma", category_id: "shawarma", name: "Egg Shawarma",
    description: "Fluffy egg, fresh veg, saucy wrap. Breakfast of champions.",
    price_zmw: 3000, image_url: null, tags: ["breakfast"],
    is_available: true, is_featured: false, spice_level: "none", prep_time_mins: 8,
  },
  // ── Snacks & Cupcakes ────────────────────────────────────
  {
    id: "samosa", category_id: "snacks", name: "Samosa",
    description: "Crispy triangle of joy, spiced filling, dangerously snackable.",
    price_zmw: 500, image_url: null, tags: ["fried"],
    is_available: true, is_featured: false, spice_level: "mild", prep_time_mins: 3,
  },
  {
    id: "zitumbuwa", category_id: "snacks", name: "Zitumbuwa",
    description: "Malawian banana fritters — golden, sweet, straight off the pan.",
    price_zmw: 250, image_url: null, tags: ["sweet", "local"],
    is_available: true, is_featured: false, spice_level: "none", prep_time_mins: 5,
  },
  {
    id: "crackers", category_id: "snacks", name: "Crackers",
    description: "Crunchy, salty, fluffy little bites. The K250 legend.",
    price_zmw: 250, image_url: null, tags: ["crunchy"],
    is_available: true, is_featured: false, spice_level: "none", prep_time_mins: 2,
  },
  {
    id: "cupcake", category_id: "cupcakes", name: "Cupcake",
    description: "Frosted, fluffy happiness. Chocolate, vanilla or today's surprise.",
    price_zmw: 700, image_url: null, tags: ["sweet"],
    is_available: true, is_featured: false, spice_level: "none", prep_time_mins: 2,
  },
];

export function getFallbackCategories(): Category[] {
  return SEED_CATEGORIES.map((c, i) => ({ ...c, id: c.slug, sort_order: c.sort_order ?? i }));
}
