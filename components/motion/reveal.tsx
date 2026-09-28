"use client";

import { motion, type Variants } from "framer-motion";
import { cardIn, fadeOnly } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

/** whileInView reveal: lift + scale + fade. Pass variants to override. */
export function Reveal({
  children,
  variants,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const v = variants ?? (reduced ? fadeOnly : cardIn);
  return (
    <motion.div
      className={className}
      variants={v}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
