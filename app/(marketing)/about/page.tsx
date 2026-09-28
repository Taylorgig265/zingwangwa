import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { WhyZingwangwa } from "@/components/sections/why";
import { ScrollStory } from "@/components/sections/scroll-story";
import { CTA } from "@/components/sections/cta";
import { shimmerBlur } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Story",
  description: "From one grill at Zingwangwa Market to Blantyre's favourite street food stall.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <Reveal className="text-center">
          <p className="font-display text-sm uppercase tracking-widest text-brand-burnt">Our Story</p>
          <h1 className="mt-2 font-display text-5xl text-brand-cacao sm:text-6xl">
            Born on the Grill. Raised by the Streets. ðŸ”¥
          </h1>
        </Reveal>

        <Reveal className="mt-10 overflow-hidden rounded-3xl shadow-bloom">
          <Image
            src="/menu/menu-poster.png"
            alt="The Zingwangwa Street Foods menu board at the market"
            width={1400}
            height={900}
            placeholder="blur"
            blurDataURL={shimmerBlur(1400, 900)}
            className="w-full object-cover"
          />
        </Reveal>

        <div className="prose-none mx-auto mt-12 max-w-2xl space-y-6 text-lg leading-relaxed text-brand-cacao/85">
          <Reveal>
            <p>
              It started with one grill, a pile of chips, and a stubborn belief: street food in
              Blantyre deserves to slap. So we set up at Zingwangwa Market â€” right next to 99
              Club â€” and started cooking like the whole street was watching. They were.
            </p>
          </Reveal>
          <Reveal>
            <p>
              Every wrap is rolled to order. Every chicken piece takes its time over real flame.
              The portions? Generous doesn’t cover it. That’s the Zingwangwa way:{" "}
              <strong className="text-brand-burnt">freshness, bold flavor, generous portions.</strong>
            </p>
          </Reveal>
          <Reveal>
            <p className="font-display text-2xl text-brand-burnt">Good Food. Great Vibes. Always.</p>
          </Reveal>
        </div>
      </section>
      <ScrollStory />
      <WhyZingwangwa />
      <CTA />
    </>
  );
}
