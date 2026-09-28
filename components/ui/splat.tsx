"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Saucy splatter SVG that bursts on hover/tap. */
export function SauceSplat({ active, className }: { active: boolean; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence>
      {active && !reduced && (
        <motion.svg
          viewBox="0 0 100 100"
          aria-hidden
          className={cn("pointer-events-none absolute text-brand-burnt/80", className)}
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.5 }}
        >
          <path
            fill="currentColor"
            d="M50 18c6 0 8 6 14 6s8-6 14-3-1 10 3 15 11 3 11 10-9 7-12 12 4 9-1 14-10-3-15 1-3 11-11 10-7-9-13-11-10 4-14-2 1-9-2-14-10-4-9-11 9-6 11-11-4-10 2-14 10 2 15 0 4-8 7-8Z"
          />
          <circle cx="18" cy="28" r="4" fill="currentColor" />
          <circle cx="84" cy="20" r="3" fill="currentColor" />
          <circle cx="88" cy="70" r="4" fill="currentColor" />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}
