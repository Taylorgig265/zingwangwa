"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { confettiBurst } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import type { MenuItem } from "@/lib/types";

/** "Add to Cart" morphs icon → "Added ✓" with a confetti burst. */
export function AddToCartButton({ item }: { item: MenuItem }) {
  const add = useCart((s) => s.add);
  const { toast } = useToast();
  const [state, setState] = useState<"idle" | "added">("idle");
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotionSafe();

  function onAdd() {
    add(item);
    toast(`${item.name} added to your plate!`, "🍽️");
    if (!reduced && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      confetti({
        ...confettiBurst,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: rect.top / window.innerHeight,
        },
      });
    }
    setState("added");
    setTimeout(() => setState("idle"), 1400);
  }

  return (
    <motion.button
      ref={btnRef}
      onClick={onAdd}
      disabled={!item.is_available}
      whileTap={reduced ? undefined : { scale: [1, 0.92, 1.05, 1] }}
      className="relative inline-flex min-w-[8.5rem] items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-burnt px-4 py-2.5 font-display text-sm tracking-wide text-brand-white shadow-card transition-colors hover:bg-brand-cacao disabled:cursor-not-allowed disabled:bg-brand-cacao/40"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle" ? (
          <motion.span
            key={item.id}
            className="flex items-center gap-2"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            🛒 Add to Plate
          </motion.span>
        ) : (
          <motion.span
            key={item.id + "-added"}
            className="flex items-center gap-2"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
          >
            Added ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
