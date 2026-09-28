import type { Metadata } from "next";
import { Suspense } from "react";
import { MenuGrid } from "@/components/menu/menu-grid";
import { MenuCardSkeleton } from "@/components/ui/skeleton";
import { getCategories, getMenuItems } from "@/lib/menu-queries";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Chips & grilled chicken, shawarma, snacks and cupcakes — order from Zingwangwa Market.",
};

export const revalidate = 60; // ISR

export default async function MenuPage() {
  const [items, categories] = await Promise.all([getMenuItems(), getCategories()]);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="font-display text-sm uppercase tracking-widest text-brand-burnt">
          The Menu
        </p>
        <h1 className="mt-2 font-display text-5xl text-brand-cacao sm:text-6xl">
          Pick Your Fighter 🍽️
        </h1>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MenuGrid items={items} categories={categories} />
      </Suspense>
    </section>
  );
}
