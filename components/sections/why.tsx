"use client";

import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { stagger } from "@/lib/motion-presets";
import { motion } from "framer-motion";

const values = [
  {
    emoji: "🥬",
    title: "Freshness",
    copy: "Veg chopped this morning, meat on the grill when you order. No shortcuts, ever.",
  },
  {
    emoji: "🔥",
    title: "Bold Flavor",
    copy: "Sauces with a kick, spices with a story. Your tastebuds will wake up.",
  },
  {
    emoji: "🍟",
    title: "Generous Portions",
    copy: "We don't do small. Every plate leaves the stall loaded.",
  },
];

const stats = [
  { to: 500, suffix: "+", label: "meals served daily" },
  { to: 16, suffix: "", label: "dishes on the menu" },
  { to: 12, suffix: "", label: "signature snacks" },
  { to: 100, suffix: "%", label: "good vibes" },
];

/** "Why Zingwangwa" — values + stat counters that count up on enter. */
export function WhyZingwangwa() {
  return (
    <section className="bg-brand-cacao py-20 text-brand-white">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mb-12 text-center">
          <p className="font-display text-sm uppercase tracking-widest text-brand-honey">
            Why Zingwangwa
          </p>
          <h2 className="font-display text-4xl sm:text-5xl">We Keep It 100 🔥</h2>
        </Reveal>

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {values.map((v) => (
            <Reveal key={v.title} className="rounded-3xl bg-brand-burnt p-8 shadow-bloom">
              <span className="text-5xl" aria-hidden>{v.emoji}</span>
              <h3 className="mt-4 font-display text-2xl text-brand-honey">{v.title}</h3>
              <p className="mt-2 text-brand-white/85">{v.copy}</p>
            </Reveal>
          ))}
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-5xl text-brand-honey">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm uppercase tracking-wide text-brand-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
