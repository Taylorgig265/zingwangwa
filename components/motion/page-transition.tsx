"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/**
 * Route transitions — a burnt-sienna "sauce wipe" sweeps across between pages.
 * Wrap page content in marketing/shop layouts via <PageTransition>.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {children}
        <motion.div
          className="pointer-events-none fixed inset-0 z-[90] bg-brand-burnt"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 0.4, ease: [0.83, 0, 0.17, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
