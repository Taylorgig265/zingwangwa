"use client";

import { useReducedMotion } from "framer-motion";

/** Re-export so every animation respects prefers-reduced-motion from one place. */
export function useReducedMotionSafe(): boolean {
  return Boolean(useReducedMotion());
}
