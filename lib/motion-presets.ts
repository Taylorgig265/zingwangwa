'use client';

import type { Transition, Variants } from "framer-motion";

/**
 * Motion presets — every animation in the app pulls from here so the whole
 * experience feels tuned from one kitchen. See MOTION.md for the full spec.
 *
 * Easing philosophy: springs with bounce (overshoot) for entrances,
 * snappy 150–250ms ease-outs for micro-interactions.
 */

/** Word-drop entrance — hero headline. Overshoot spring, per-word stagger. */
export const wordDrop: Variants = {
  hidden: { y: -48, opacity: 0, rotate: -4 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", bounce: 0.55, duration: 0.8, delay: 0.12 * i },
  }),
};

/** Menu-card entrance on scroll into view — lift + scale + bloom shadow via CSS. */
export const cardIn: Variants = {
  hidden: { y: 40, opacity: 0, scale: 0.94 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0.3, duration: 0.7 },
  },
};

/** Stagger container for grids/lists. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Squash-and-stretch tap — brand buttons. */
export const tapSquash = { scale: [1, 0.94, 1.06, 1], transition: { duration: 0.3 } };

/** Spring pill (filter tabs, drawers). */
export const springPill: Transition = { type: "spring", bounce: 0.25, duration: 0.6 };

/** Toast slide-and-spring. */
export const toastIn = {
  initial: { x: 80, opacity: 0, scale: 0.9 },
  animate: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.5 } },
  exit: { x: 80, opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
} as const;

/** Simple fade — used everywhere `prefers-reduced-motion` is on (see useReducedMotionSafe). */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/** Price-tag wiggle on hover. */
export const wiggle: Variants = {
  rest: { rotate: 0 },
  hover: { rotate: [0, -6, 5, -3, 0], transition: { duration: 0.45 } },
};

/** Cart drawer */
export const drawerSlide: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", bounce: 0.1, duration: 0.55 } },
  exit: { x: "100%", transition: { duration: 0.3, ease: "easeIn" } },
};

/** Row inside the drawer — staggered slide. */
export const rowIn: Variants = {
  hidden: { x: 32, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", bounce: 0.3, duration: 0.5 } },
};

/** Confetti burst defaults (canvas-confetti). Brand-colored. */
export const confettiBurst = {
  particleCount: 40,
  spread: 55,
  scalar: 0.9,
  ticks: 120,
  colors: ["#BF4C00", "#FFBE00", "#7C2B00", "#FFFFFF"],
  disableForReducedMotion: true,
};

/** Order-confirmation confetti cannon — two side blasts. */
export const confettiCannon = {
  particleCount: 90,
  spread: 70,
  startVelocity: 45,
  colors: ["#BF4C00", "#FFBE00", "#FFFFFF"],
  disableForReducedMotion: true,
};
