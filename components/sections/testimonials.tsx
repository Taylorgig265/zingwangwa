import { Reveal } from "@/components/motion/reveal";
import { Starburst } from "@/components/ui/starburst";

const quotes = [
  {
    name: "Chisomo M.",
    text: "The Made By Wifey shawarma changed my life. I'm not even joking. 😭🔥",
    rating: 5,
  },
  {
    name: "Thandi K.",
    text: "K4,500 for chips + meatballs this big? Generous is an understatement.",
    rating: 5,
  },
  {
    name: "Blessings P.",
    text: "Zitumbuwa fresh off the pan on my lunch break. Great vibes every time.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="mb-10 flex items-center gap-4">
        <Starburst className="h-16 w-16 shrink-0" points={12} />
        <h2 className="font-display text-4xl text-brand-cacao sm:text-5xl">The Streets Are Talking 🗣️</h2>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {quotes.map((q, i) => (
          <Reveal key={q.name} delay={i * 0.1} className="rounded-3xl border-2 border-brand-honey/60 bg-brand-white p-6 shadow-card">
            <p className="text-brand-honey" aria-label={`${q.rating} star review`}>
              {"★".repeat(q.rating)}
            </p>
            <blockquote className="mt-3 text-lg text-brand-cacao">“{q.text}”</blockquote>
            <p className="mt-4 font-display text-brand-burnt">— {q.name}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
