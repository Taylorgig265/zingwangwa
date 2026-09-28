"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { drawerSlide, rowIn, stagger } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";
import { formatKwacha, shimmerBlur } from "@/lib/utils";

/** Cart drawer — slides from the right, rows stagger in, subtotal counts up. */
export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove } = useCart();
  const reduced = useReducedMotionSafe();
  const subtotal = lines.reduce((s, l) => s + l.item.price_zmw * l.qty, 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-brand-cacao/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Your cart"
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-brand-white shadow-bloom"
            variants={reduced ? undefined : drawerSlide}
            initial={reduced ? { opacity: 0 } : "hidden"}
            animate={reduced ? { opacity: 1 } : "visible"}
            exit={reduced ? { opacity: 0 } : "exit"}
          >
            <div className="flex items-center justify-between border-b-2 border-brand-honey/40 p-4">
              <h2 className="font-display text-2xl text-brand-burnt">Your Plate 🍽️</h2>
              <button onClick={close} aria-label="Close cart" className="text-2xl text-brand-cacao">
                ✕
              </button>
            </div>

            <motion.ul
              className="flex-1 space-y-3 overflow-y-auto p-4"
              variants={stagger(0.06)}
              initial="hidden"
              animate="visible"
            >
              {lines.length === 0 && (
                <li className="py-16 text-center">
                  <p className="text-5xl">🫕</p>
                  <p className="mt-3 font-display text-xl text-brand-cacao">Nothing sizzling yet!</p>
                </li>
              )}
              {lines.map((l) => (
                <motion.li
                  key={l.item.id}
                  variants={reduced ? undefined : rowIn}
                  className="flex items-center gap-3 rounded-2xl bg-brand-honey/10 p-3"
                >
                  {l.item.image_url && (
                    <Image
                      src={l.item.image_url}
                      alt=""
                      width={56}
                      height={56}
                      placeholder="blur"
                      blurDataURL={shimmerBlur(56, 56)}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-display text-sm text-brand-cacao">{l.item.name}</p>
                    <p className="text-xs text-brand-cacao/60">{formatKwacha(l.item.price_zmw)}</p>
                  </div>
                  <QuantityStepper qty={l.qty} onChange={(q) => setQty(l.item.id, q)} />
                  <button
                    onClick={() => remove(l.item.id)}
                    aria-label={`Remove ${l.item.name}`}
                    className="text-brand-cacao/50 hover:text-brand-burnt"
                  >
                    🗑️
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            {lines.length > 0 && (
              <div className="space-y-3 border-t-2 border-brand-honey/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-cacao/80">Subtotal</span>
                  <span className="font-display text-2xl text-brand-burnt">
                    K <CountUp to={subtotal} duration={0.6} />
                  </span>
                </div>
                <Button href="/checkout" className="w-full" onClick={close}>
                  Check out 🔥
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
