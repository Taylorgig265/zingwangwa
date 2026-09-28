import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { shimmerBlur } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Sizzle from the stall — wraps, grills, chips and cupcakes at Zingwangwa Market.",
};

// From the brand reference shoot (public/menu)
const shots = [
  { src: "/menu/grill-chips.png", alt: "Grill & Chips" },
  { src: "/menu/made-by-wifey.png", alt: "Made By Wifey shawarma" },
  { src: "/menu/chicken-mash.png", alt: "Chicken Mash wrap" },
  { src: "/menu/chips-meatballs.png", alt: "Chips + Meatballs" },
  { src: "/menu/sausage-chips.png", alt: "Sausage + Chips" },
  { src: "/menu/egg-chips.png", alt: "Egg & Chips" },
  { src: "/menu/jamaica-vibes.png", alt: "Jamaica Vibes wrap" },
  { src: "/menu/sausage-swirl.png", alt: "Sausage Swirl" },
  { src: "/menu/plain-chips.png", alt: "Plain Chips" },
];

export default function GalleryPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <Reveal className="mb-10 text-center">
        <p className="font-display text-sm uppercase tracking-widest text-brand-burnt">Gallery</p>
        <h1 className="mt-2 font-display text-5xl text-brand-cacao sm:text-6xl">
          Fresh Off the Grill 📸
        </h1>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {shots.map((s, i) => (
          <Reveal
            key={s.src}
            delay={(i % 3) * 0.08}
            className="group relative aspect-square overflow-hidden rounded-3xl shadow-card"
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={shimmerBlur()}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-cacao/80 to-transparent p-3 font-display text-brand-white opacity-0 transition-opacity group-hover:opacity-100">
              {s.alt}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
