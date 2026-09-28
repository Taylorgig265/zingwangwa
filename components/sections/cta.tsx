import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Starburst } from "@/components/ui/starburst";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-brand-burnt py-24">
      <Starburst className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 text-brand-honey opacity-20" />
      <Starburst className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 text-brand-honey opacity-20" />
      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-5xl text-brand-white sm:text-6xl">
          Hungry? Thought So. 😏
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-brand-white/85">
          Your plate is one tap away. Hot, saucy and generous — exactly how it should be.
        </p>
        <div className="mt-8 flex justify-center">
          <Button magnetic variant="honey" href="/menu" className="px-10 py-4 text-xl">
            Start an Order 🔥
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
