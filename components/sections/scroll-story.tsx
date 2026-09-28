"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";

/**
 * Scroll storytelling (GSAP ScrollTrigger) — a pinned stage where the
 * Zingwangwa process plays out as you scroll:
 *   1. A wrap assembles itself (tortilla + fillings fly in)
 *   2. Chicken takes its grill marks 🔥
 *   3. Chips get salted (sparkles rain)
 *   4. A cupcake gets frosted
 *
 * Reduced motion: renders as a simple stacked list of the four steps.
 */
const steps = [
  { emoji: "🌯", title: "Wrap it", copy: "Warm chapati lands, fillings fly in, sauce drips." },
  { emoji: "🔥", title: "Grill it", copy: "Chicken hits the flame and takes those marks." },
  { emoji: "🍟", title: "Load it", copy: "Chips get salted. Generously. Obviously." },
  { emoji: "🧁", title: "Frost it", copy: "Cupcakes get their swirl — the sweet finish." },
];

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced || !sectionRef.current || !stageRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>(".story-layer");
      const pieces = gsap.utils.toArray<HTMLElement>(".story-piece");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${layers.length * 60}%`,
          pin: true,
          scrub: 0.6, // buttery scrub — the story follows your thumb
        },
      });

      layers.forEach((layer, i) => {
        tl.fromTo(
          layer,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 1 },
          i * 2,
        );
        // ingredients fly in for this step
        tl.fromTo(
          pieces.filter((p) => Number(p.dataset.step) === i),
          { x: () => gsap.utils.random(-320, 320), y: -260, rotate: () => gsap.utils.random(-90, 90), autoAlpha: 0 },
          { x: 0, y: 0, rotate: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 },
          i * 2 + 0.1,
        );
        if (i < layers.length - 1) {
          tl.to(layer, { autoAlpha: 0, scale: 1.05, duration: 0.6 }, i * 2 + 1.4);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center font-display text-4xl text-brand-cacao">How We Make the Magic ✨</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <li key={s.title} className="rounded-3xl bg-brand-honey/10 p-6 text-center">
              <span className="text-5xl" aria-hidden>{s.emoji}</span>
              <h3 className="mt-3 font-display text-xl text-brand-burnt">{s.title}</h3>
              <p className="mt-1 text-sm text-brand-cacao/75">{s.copy}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-brand-honey/10">
      <div className="flex h-screen flex-col items-center justify-center">
        <h2 className="absolute top-10 z-10 px-4 text-center font-display text-4xl text-brand-cacao sm:text-5xl">
          How We Make the Magic ✨
        </h2>
        <div ref={stageRef} className="relative flex h-[420px] w-full max-w-3xl items-center justify-center">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="story-layer invisible absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <div className="relative text-8xl" aria-hidden>
                {s.emoji}
                {/* flying-ingredient bits */}
                {["🥬", "🍅", "🧅", "🧀"].map((bit, j) => (
                  <span
                    key={j}
                    className="story-piece absolute text-4xl"
                    data-step={i}
                    style={{
                      left: `${(j - 1.5) * 70}px`,
                      top: `${(j % 2 === 0 ? -1 : 1) * 60}px`,
                    }}
                  >
                    {bit}
                  </span>
                ))}
              </div>
              <h3 className="mt-6 font-display text-3xl text-brand-burnt">{s.title}</h3>
              <p className="mt-2 max-w-xs text-brand-cacao/75">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
