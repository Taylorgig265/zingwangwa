"use client";

import { forwardRef, useRef, useState } from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { tapSquash } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

type Variant = "primary" | "honey" | "ghost" | "white";

const variants: Record<Variant, string> = {
  primary: "bg-brand-burnt text-brand-white hover:bg-brand-cacao shadow-bloom",
  honey: "bg-brand-honey text-brand-cacao hover:bg-[#ffd23f] shadow-card",
  white: "bg-brand-white text-brand-burnt hover:bg-brand-honey/20 border-2 border-brand-burnt",
  ghost: "text-brand-cacao hover:bg-brand-honey/15",
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  href?: string;
  magnetic?: boolean;
  children: React.ReactNode;
}

/**
 * Brand button — magnetic hover + squash-and-stretch tap.
 * Falls back to a plain hover/fade when the user prefers reduced motion.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", href, magnetic = false, className, children, ...props },
  ref,
) {
  const reduced = useReducedMotionSafe();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onMouseMove(e: React.MouseEvent) {
    if (!magnetic || reduced || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.35,
    });
  }

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-base tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-honey disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );

  const inner = href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <motion.button
      ref={ref}
      className={classes}
      whileTap={reduced ? undefined : tapSquash}
      {...props}
    >
      {children}
    </motion.button>
  );

  if (!magnetic || reduced) return inner;

  return (
    <motion.span
      ref={wrapRef}
      className="inline-block"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {inner}
    </motion.span>
  );
});
