"use client";

import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import { MenuCard } from "@/components/menu/menu-card";
import { stagger } from "@/lib/motion-presets";
import { motion } from "framer-motion";
import type { MenuItem } from "@/lib/types";

/** Mobile-first horizontal featured carousel with snap scroll. */
export function FeaturedCarousel({ items }: { items: MenuItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollBy(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-display text-sm uppercase tracking-widest text-brand-burnt">
            Crowd favourites
          </p>
          <h2 className="font-display text-4xl text-brand-cacao sm:text-5xl">
            The Signatures 🔥
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scrollBy(-320)} aria-label="Scroll left" className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-honey/30 text-lg hover:bg-brand-honey">←</button>
          <button onClick={() => scrollBy(320)} aria-label="Scroll right" className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-honey/30 text-lg hover:bg-brand-honey">→</button>
        </div>
      </Reveal>

      <motion.ul
        ref={trackRef}
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
      >
        {items.map((item) => (
          <li key={item.id} className="w-72 shrink-0 snap-start sm:w-80">
            <MenuCard item={item} />
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
