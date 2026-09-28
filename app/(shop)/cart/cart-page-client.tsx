"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { formatKwacha, shimmerBlur } from "@/lib/utils";

export function CartPageClient() {
  const { lines, setQty, remove, clear } = useCart();
  const subtotal = lines.reduce((s, l) => s + l.item.price_zmw * l.qty, 0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Reveal>
        <h1 className="font-display text-4xl text-brand-cacao sm:text-5xl">Your Plate 🍽️</h1>
      </Reveal>

      {lines.length === 0 ? (
        <Reveal className="mt-10 rounded-3xl bg-brand-honey/10 p-12 text-center">
          <p className="text-6xl">🫕</p>
          <p className="mt-4 font-display text-2xl text-brand-cacao">Nothing sizzling yet!</p>
          <Button href="/menu" className="mt-6">
            Browse the menu
          </Button>
        </Reveal>
      ) : (
        <div className="mt-8 space-y-4">
          {lines.map((l) => (
            <Reveal key={l.item.id} className="flex items-center gap-4 rounded-3xl bg-brand-white p-4 shadow-card">
              {l.item.image_url && (
                <Image
                  src={l.item.image_url}
                  alt=""
                  width={80}
                  height={80}
                  placeholder="blur"
                  blurDataURL={shimmerBlur(80, 80)}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-display text-lg text-brand-cacao">{l.item.name}</p>
                <p className="text-sm text-brand-cacao/60">
                  {formatKwacha(l.item.price_zmw)} each
                </p>
                <button
                  onClick={() => remove(l.item.id)}
                  className="mt-1 text-xs font-semibold text-brand-burnt underline underline-offset-2"
                >
                  Remove
                </button>
              </div>
              <div className="text-right">
                <QuantityStepper qty={l.qty} onChange={(q) => setQty(l.item.id, q)} />
                <p className="mt-1 font-display text-lg text-brand-burnt">
                  {formatKwacha(l.item.price_zmw * l.qty)}
                </p>
              </div>
            </Reveal>
          ))}

          <Reveal className="flex items-center justify-between rounded-3xl bg-brand-cacao p-6 text-brand-white">
            <div>
              <p className="text-sm text-brand-white/70">Subtotal</p>
              <p className="font-display text-3xl text-brand-honey">
                K <CountUp to={subtotal} />
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clear}
                className="self-center text-sm text-brand-white/60 underline underline-offset-2 hover:text-brand-white"
              >
                Clear plate
              </button>
              <Button variant="honey" href="/checkout">
                Check out 🔥
              </Button>
            </div>
          </Reveal>

          <p className="text-center text-sm text-brand-cacao/60">
            Changed your mind? <Link href="/menu" className="font-semibold text-brand-burnt underline">Add more goodness</Link>
          </p>
        </div>
      )}
    </section>
  );
}
