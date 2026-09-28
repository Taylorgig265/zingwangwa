"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { CartButton } from "@/components/cart/cart-button";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { springPill } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/account", label: "Account" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotionSafe();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brand-honey/40 bg-brand-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Logo: brand clear space on desktop, tighter on mobile (never below 152px wide) */}
        <Link href="/" aria-label="Zingwangwa Street Foods — home">
          <Logo compact className="px-4 lg:px-[95px]" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  className={cn(
                    "block rounded-full px-4 py-2 font-display text-sm tracking-wide transition-colors",
                    active ? "text-brand-white" : "text-brand-cacao hover:text-brand-burnt",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-burnt"
                      transition={reduced ? { duration: 0 } : springPill}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <CartButton />
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-2xl md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? "✕" : "🍔"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence key="mobile-menu">
        {open && (
          <motion.ul
            className="border-t border-brand-honey/40 bg-brand-white md:hidden"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 font-display text-lg text-brand-cacao hover:bg-brand-honey/15"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
