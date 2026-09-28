"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Punchy starburst SVG — slowly pulses + rotates behind hero content. */
export function Starburst({ className, points = 16 }: { className?: string; points?: number }) {
  const reduced = useReducedMotion();
  const spikes = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const outer = 50;
    const inner = 34;
    const mid = angle + Math.PI / points;
    return `${50 + Math.cos(angle) * outer},${50 + Math.sin(angle) * outer} ${50 + Math.cos(mid) * inner},${50 + Math.sin(mid) * inner}`;
  }).join(" ");

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={cn("text-brand-honey", className)}
      aria-hidden
      animate={reduced ? undefined : { rotate: 360, scale: [1, 1.05, 1] }}
      transition={{
        rotate: { duration: 60, repeat: Infinity, ease: "linear" },
        scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <polygon points={spikes} fill="currentColor" opacity="0.9" />
    </motion.svg>
  );
}
