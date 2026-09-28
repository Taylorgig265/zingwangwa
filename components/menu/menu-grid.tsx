"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MenuCard } from "./menu-card";
import { stagger, springPill } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/lib/types";

type Sort = "popular" | "price-asc" | "price-desc";

/** Filterable menu grid — spring pill tabs, search, sort. */
export function MenuGrid({ items, categories }: { items: MenuItem[]; categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const reduced = useReducedMotionSafe();

  const filtered = useMemo(() => {
    let list = items;
    if (activeCategory) list = list.filter((i) => i.category_id === activeCategory || categorySlugOf(i) === activeCategory);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(q));
    return [...list].sort((a, b) =>
      sort === "price-asc"
        ? a.price_zmw - b.price_zmw
        : sort === "price-desc"
          ? b.price_zmw - a.price_zmw
          : Number(b.is_featured) - Number(a.is_featured),
    );
  }, [items, activeCategory, query, sort]);

  function categorySlugOf(item: MenuItem) {
    return item.categories?.slug ?? item.category_id;
  }

  const tabs = [{ id: null, name: "All 🔥", slug: null }, ...categories];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="Menu categories"
          className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 py-1"
        >
          {tabs.map((t) => {
            const active = (t.slug ?? t.id) === activeCategory || (activeCategory === null && t.slug === null);
            const key = t.slug ?? "all";
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(activeCategory === (t.slug ?? t.id) ? null : (t.slug ?? t.id))}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 font-display text-sm tracking-wide transition-colors",
                  active ? "text-brand-white" : "text-brand-cacao hover:bg-brand-honey/15",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-brand-burnt"
                    transition={reduced ? { duration: 0 } : springPill}
                  />
                )}
                {t.name}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the grill… 🔍"
            aria-label="Search menu"
            className="w-full rounded-full border-2 border-brand-honey/50 bg-brand-white px-4 py-2 text-sm text-brand-cacao placeholder:text-brand-cacao/40 focus:border-brand-burnt focus:outline-none md:w-56"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort menu"
            className="rounded-full border-2 border-brand-honey/50 bg-brand-white px-3 py-2 text-sm font-semibold text-brand-cacao focus:border-brand-burnt focus:outline-none"
          >
            <option value="popular">Popular</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <motion.ul
        key={`${activeCategory}-${sort}-${query}`}
        variants={stagger(0.06)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((item) => (
          <li key={item.id}>
            <MenuCard item={item} />
          </li>
        ))}
      </motion.ul>

      {filtered.length === 0 && (
        <p className="py-20 text-center font-display text-2xl text-brand-cacao/60">
          Nothing on that shelf… try another craving! 🍔
        </p>
      )}
    </div>
  );
}
