"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";
import { SizzleSpinner } from "@/components/ui/spinner";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { formatKwacha } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/types";

const DELIVERY_FEE = 1000; // K1,000 local delivery

export function CheckoutClient() {
  const { lines, clear } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const reduced = useReducedMotionSafe();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [promo, setPromo] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("pawapay");
  const [status, setStatus] = useState<"idle" | "loading" | "redirecting">("idle");

  const subtotal = lines.reduce((s, l) => s + l.item.price_zmw * l.qty, 0);
  const deliveryFee = address.trim() ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const valid = lines.length > 0 && name.trim() && phone.trim().length >= 7;

  async function placeOrder() {
    if (!valid) {
      toast("Add your name, phone and at least one dish! 🍽️", "⚠️");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          customer: { name, phone, address, notes },
          items: lines.map((l) => ({ id: l.item.id, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      if (data.url) {
        // Pawapay / Stripe hosted checkout — burnt-sienna curtain wipe before we leave
        setStatus("redirecting");
        setTimeout(() => (window.location.href = data.url), reduced ? 0 : 750);
        return;
      }
      // COD: order written directly, no gateway round-trip
      clear();
      router.push(`/order-confirmation?order=${data.orderId}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Something went wrong — try again.", "😬");
      setStatus("idle");
    }
  }

  const inputCls =
    "w-full rounded-2xl border-2 border-brand-honey/50 bg-brand-white px-4 py-3 text-brand-cacao placeholder:text-brand-cacao/40 focus:border-brand-burnt focus:outline-none";

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-4xl text-brand-cacao sm:text-5xl">Checkout 🔥</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div className="space-y-4 rounded-3xl border-2 border-brand-honey/40 p-6">
          <h2 className="font-display text-xl text-brand-burnt">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputCls} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            <input className={inputCls} placeholder="Phone (e.g. 0891 234 567)" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" inputMode="tel" />
          </div>
          <input className={inputCls} placeholder="Delivery address (leave empty for pickup at the market)" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
          <textarea className={inputCls} rows={2} placeholder="Notes — extra sauce, no onions, extra 🔥…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <input className={inputCls} placeholder="Promo code (optional)" value={promo} onChange={(e) => setPromo(e.target.value)} />

          <h2 className="pt-2 font-display text-xl text-brand-burnt">Payment</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "pawapay", label: "📱 Pawapay Mobile Money", hint: "Pay with MTN / Airtel mobile money" },
                { id: "cod", label: "💵 Cash on Delivery", hint: "Pay when it lands" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                aria-pressed={method === m.id}
                className={`relative rounded-2xl border-2 p-4 text-left transition-colors ${
                  method === m.id
                    ? "border-brand-burnt bg-brand-honey/15"
                    : "border-brand-honey/40 hover:border-brand-burnt/50"
                }`}
              >
                <p className="font-display text-brand-cacao">{m.label}</p>
                <p className="text-xs text-brand-cacao/60">{m.hint}</p>
                {method === m.id && (
                  <motion.span
                    layoutId="pay-pill"
                    className="absolute right-3 top-3 text-brand-burnt"
                    transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
                  >
                    ✓
                  </motion.span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-4 rounded-3xl bg-brand-cacao p-6 text-brand-white lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-brand-honey">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.item.id} className="flex justify-between gap-2 text-brand-white/85">
                <span>
                  {l.qty}× {l.item.name}
                </span>
                <span>{formatKwacha(l.item.price_zmw * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-brand-white/15 pt-3 text-sm">
            <p className="flex justify-between text-brand-white/70">
              <span>Subtotal</span>
              <span>{formatKwacha(subtotal)}</span>
            </p>
            <p className="flex justify-between text-brand-white/70">
              <span>Delivery {deliveryFee === 0 && "(pickup — free!)"}</span>
              <span>{deliveryFee ? formatKwacha(deliveryFee) : "K 0"}</span>
            </p>
            <p className="flex justify-between pt-2 font-display text-2xl text-brand-honey">
              <span>Total</span>
              <span>
                K <CountUp to={total} duration={0.5} />
              </span>
            </p>
          </div>
          <Button
            variant="honey"
            className="w-full py-4 text-lg"
            disabled={!valid || status !== "idle"}
            onClick={placeOrder}
          >
            {status === "loading" ? (
              "Firing it up…"
            ) : method === "pawapay" ? (
              <>Pay {formatKwacha(total)} 📱</>
            ) : (
              <>Place order — pay on delivery 💵</>
            )}
          </Button>
          {status === "loading" && <SizzleSpinner label="Talking to the kitchen…" className="mx-auto" />}
        </aside>
      </div>

      {/* Burnt-sienna curtain wipe when redirecting to Pawapay */}
      <AnimatePresence>
        {status === "redirecting" && !reduced && (
          <motion.div
            key="redirect-curtain"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-burnt"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.7 }}
          >
            <p className="font-display text-3xl text-brand-white">Off to secure checkout… 📱🔥</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}