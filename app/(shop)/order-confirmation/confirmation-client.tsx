"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { confettiCannon } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { Button } from "@/components/ui/button";
import { formatKwacha } from "@/lib/utils";

/**
 * Order confirmation â€” confetti cannon, checkmark stroke-draw,
 * and a receipt that "unrolls" from the top.
 */
export function ConfirmationClient() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? params.get("session_id") ?? "â€”";
  const total = Number(params.get("total") ?? 0);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    // confetti cannon â€” blast from both sides
    const opts = { ...confettiCannon, origin: { y: 0.7 } };
    confetti({ ...opts, angle: 60, origin: { ...opts.origin, x: 0 } });
    confetti({ ...opts, angle: 120, origin: { ...opts.origin, x: 1 } });
  }, [reduced]);

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "265891392925";
  const waText = useMemo(
    () => encodeURIComponent(`Hie! ðŸ‘‹ Order ${orderId} â€” checking on my food ðŸ”¥`),
    [orderId],
  );

  return (
    <section className="mx-auto max-w-lg px-4 py-16 text-center">
      {/* Animated checkmark stroke draw */}
      <motion.svg
        viewBox="0 0 100 100"
        className="mx-auto h-28 w-28 text-brand-burnt"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6"
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: reduced ? 0 : 0.6 }}
        />
        <motion.path
          d="M30 52 L44 66 L72 36" fill="none" stroke="#FFBE00" strokeWidth="8"
          strokeLinecap="round" strokeLinejoin="round"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.5 }}
        />
      </motion.svg>

      <motion.h1
        className="mt-4 font-display text-4xl text-brand-cacao"
        initial={{ opacity: 0, y: reduced ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.9 }}
      >
        Order Received! ðŸŽ‰
      </motion.h1>
      <motion.p
        className="mt-2 text-brand-cacao/75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.1 }}
      >
        The grill is already warming up. We’ll buzz you when it’s ready.
      </motion.p>

      {/* Receipt â€” unrolls from the top */}
      <motion.div
        className="mx-auto mt-8 max-w-sm rounded-3xl bg-brand-white p-6 text-left shadow-bloom [mask-image:linear-gradient(to_bottom,black,black)]"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="border-b-2 border-dashed border-brand-honey/60 pb-3 font-display text-lg text-brand-burnt">
          Zingwangwa Street Foods ðŸ§¾
        </p>
        <dl className="space-y-2 py-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-brand-cacao/60">Order ref</dt>
            <dd className="font-mono text-xs text-brand-cacao">{orderId.slice(0, 18)}</dd>
          </div>
          {total > 0 && (
            <div className="flex justify-between font-display text-lg text-brand-burnt">
              <dt>Total</dt>
              <dd>{formatKwacha(total)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-brand-cacao/60">Status</dt>
            <dd className="font-semibold text-brand-cacao">Received âœ…</dd>
          </div>
        </dl>
        <p className="border-t-2 border-dashed border-brand-honey/60 pt-3 text-center text-xs text-brand-cacao/60">
          Good Food. Great Vibes. See you soon! ðŸ”¥
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button href={`https://wa.me/${whatsapp}?text=${waText}`} variant="honey">
          Track on WhatsApp ðŸ’¬
        </Button>
        <Button href="/account" variant="ghost">
          View my orders â†’
        </Button>
      </div>
    </section>
  );
}
