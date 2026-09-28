"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cardIn, wiggle } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { SauceSplat } from "@/components/ui/splat";
import { SpiceBadge, AvailabilityBadge } from "@/components/ui/badge";
import { AddToCartButton } from "./add-to-cart-button";
import { formatKwacha, shimmerBlur, cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";

/**
 * Menu card — whileInView lift/scale/bloom; hover zooms the photo 1.08×,
 * a sauce splat bursts, and the price tag wiggles.
 */
export function MenuCard({ item }: { item: MenuItem }) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotionSafe();

  return (
    <motion.article
      variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : cardIn}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduced ? undefined : { y: -6 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-brand-white shadow-card transition-shadow",
        hovered && "shadow-bloom",
        !item.is_available && "opacity-70",
      )}
    >
      <AvailabilityBadge available={item.is_available} />
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cacao/5">
        {item.image_url ? (
          <motion.div
            className="h-full w-full"
            animate={{ scale: hovered && !reduced ? 1.08 : 1 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          >
            <Image
              src={item.image_url.startsWith("/") ? item.image_url : supabaseImageUrl(item.image_url)}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL={shimmerBlur()}
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div className="flex h-full items-center justify-center text-6xl" aria-hidden>
            🍽️
          </div>
        )}
        <SauceSplat active={hovered} className="right-2 top-2 h-16 w-16" />
        {/* price tag — wiggles on hover */}
        <motion.div
          variants={wiggle}
          initial="rest"
          animate={hovered && !reduced ? "hover" : "rest"}
          className="absolute bottom-0 right-0 rounded-tl-2xl bg-brand-honey px-4 py-2 font-display text-lg text-brand-cacao shadow-card"
        >
          {formatKwacha(item.price_zmw)}
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight text-brand-cacao">{item.name}</h3>
          <SpiceBadge level={item.spice_level} />
        </div>
        <p className="flex-1 text-sm leading-relaxed text-brand-cacao/75">{item.description}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-burnt">
            ~{item.prep_time_mins} min
          </span>
          <AddToCartButton item={item} />
        </div>
      </div>
    </motion.article>
  );
}

function supabaseImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-images/${path}`;
}
