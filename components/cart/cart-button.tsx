"use client";

import { motion } from "framer-motion";
import { useCart, useCartTotals } from "@/lib/cart-store";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";

export function CartButton() {
  const open = useCart((s) => s.open);
  const { count } = useCartTotals();
  const reduced = useReducedMotionSafe();

  return (
    <button
      onClick={open}
      aria-label={`Open cart, ${count} items`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-honey text-xl shadow-card transition-colors hover:bg-brand-honey/80"
    >
      🛒
      {count > 0 && (
        <motion.span
          key={count}
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-burnt px-1 font-display text-xs text-brand-white"
          initial={reduced ? false : { scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.4 }}
        >
          {count}
        </motion.span>
      )}
    </button>
  );
}
