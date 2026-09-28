"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { wordDrop } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { Starburst } from "@/components/ui/starburst";
import { Embers } from "@/components/motion/embers";
import { Button } from "@/components/ui/button";
import { shimmerBlur } from "@/lib/utils";

const headline = ["Good", "Food.", "Great", "Vibes."];

/**
 * Landing hero — flame gradient + noise + embers, word-by-word headline
 * with overshoot spring, starburst behind the lockup, floating food with
 * mouse parallax. All of it degrades to fades under reduced motion.
 */
export function Hero() {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);

  // Mouse parallax for floating food imagery
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const wrapX = useTransform(sx, [0, 1], [-24, 24]);
  const wrapY = useTransform(sy, [0, 1], [-16, 16]);
  const chipsX = useTransform(sx, [0, 1], [30, -30]);
  const chipsY = useTransform(sy, [0, 1], [20, -20]);

  function onMouseMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="flame-gradient noise-overlay relative flex min-h-[92vh] items-center overflow-hidden"
    >
      <Embers />

      {/* Starburst behind the lockup */}
      <Starburst className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 opacity-30" />

      {/* Floating food — parallax */}
      {!reduced && (
        <>
          <motion.div
            className="pointer-events-none absolute right-[6%] top-[14%] hidden w-44 rotate-6 md:block lg:w-56"
            style={{ x: wrapX, y: wrapY }}
          >
            <Image
              src="/menu/made-by-wifey.png"
              alt=""
              width={448}
              height={448}
              priority
              placeholder="blur"
              blurDataURL={shimmerBlur(448, 448)}
              className="rounded-full border-4 border-brand-white/60 shadow-bloom"
            />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute bottom-[10%] left-[4%] hidden w-36 -rotate-6 md:block lg:w-48"
            style={{ x: chipsX, y: chipsY }}
          >
            <Image
              src="/menu/grill-chips.png"
              alt=""
              width={384}
              height={384}
              priority
              placeholder="blur"
              blurDataURL={shimmerBlur(384, 384)}
              className="rounded-full border-4 border-brand-white/60 shadow-bloom"
            />
          </motion.div>
        </>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="font-display text-6xl leading-[1.05] text-brand-white drop-shadow-lg sm:text-7xl lg:text-8xl">
          {headline.map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : wordDrop}
              initial="hidden"
              animate="visible"
              className="mr-4 inline-block last:mr-0"
            >
              <span className={i >= 2 ? "text-brand-honey" : undefined}>{word}</span>
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg font-semibold text-brand-white/90"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.6, duration: 0.5 }}
        >
          Flame-kissed shawarma, mountains of chips, and snacks that slap — sizzling right here at
          Zingwangwa Market, next to 99 Club. 🔥
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.85, duration: 0.5 }}
        >
          <Button magnetic variant="honey" href="/menu" className="px-8 py-4 text-lg">
            Order Now 🍔
          </Button>
          <Button
            magnetic
            variant="white"
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "265891392925"}`}
            className="px-8 py-4 text-lg"
          >
            WhatsApp Us 💬
          </Button>
        </motion.div>
      </div>

      {/* Sauce-drip divider */}
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-14 w-full text-brand-white" aria-hidden>
        <path
          fill="currentColor"
          d="M0 40c80 20 160 20 240 0s160-20 240 0 160 20 240 0 160-20 240 0 160 20 240 0 160-20 240 0v30H0Z"
        />
      </svg>
    </section>
  );
}
