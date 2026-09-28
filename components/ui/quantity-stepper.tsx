"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";

export function QuantityStepper({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (qty: number) => void;
}) {
  const reduced = useReducedMotionSafe();
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-full bg-brand-honey/30 font-display text-lg text-brand-cacao transition-colors hover:bg-brand-honey";

  return (
    <div className="inline-flex items-center gap-2">
      <button className={btn} onClick={() => onChange(qty - 1)} aria-label="Decrease quantity">
        −
      </button>
      <motion.span
        key={qty}
        className="w-6 text-center font-display text-lg text-brand-cacao"
        // pop the digit when it changes
        initial={reduced ? false : { scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.35 }}
      >
        {qty}
      </motion.span>
      <button className={btn} onClick={() => onChange(qty + 1)} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
