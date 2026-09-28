"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { formatKwacha } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

const COLUMNS: { status: OrderStatus; emoji: string; label: string }[] = [
  { status: "received", emoji: "📥", label: "Received" },
  { status: "cooking", emoji: "🔥", label: "Cooking" },
  { status: "ready", emoji: "✅", label: "Ready" },
  { status: "cancelled", emoji: "🚫", label: "Cancelled" },
];

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { received: "cooking", cooking: "ready", ready: "delivered" };

/**
 * Live orders kanban — Realtime-subscribed to `orders`, staff advance the
 * status with one tap (Received → Cooking → Ready → Delivered).
 */
export function OrdersBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const reduced = useReducedMotionSafe();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, async (payload) => {
        // fetch the full row incl. items (payload.new has no join)
        const { data } = await supabase.from("orders").select("*, order_items(*)").eq("id", payload.new.id).single();
        if (data) setOrders((prev) => [data as Order, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
        setOrders((prev) =>
          prev
            .map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o))
            .filter((o) => o.status !== "delivered" || initialOrders.some((i) => i.id === o.id)),
        );
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function advance(order: Order, to: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: to } : o))); // optimistic
    await supabase?.from("orders").update({ status: to }).eq("id", order.id);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const items = orders.filter((o) => o.status === col.status);
        return (
          <section key={col.status} className="min-h-40 rounded-3xl border-2 border-brand-honey/40 bg-brand-honey/5 p-3">
            <h2 className="mb-3 flex items-center justify-between px-1 font-display text-lg text-brand-cacao">
              <span>{col.emoji} {col.label}</span>
              <span className="rounded-full bg-brand-honey/30 px-2 py-0.5 text-xs font-bold">{items.length}</span>
            </h2>
            <ul className="space-y-2">
              <AnimatePresence initial={false}>
                {items.map((o) => (
                  <motion.li
                    key={o.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
                    className="rounded-2xl border-2 border-brand-honey/30 bg-brand-white p-3 shadow-card"
                  >
                    <div className="flex items-center justify-between text-xs text-brand-cacao/60">
                      <span className="font-mono">#{o.id.slice(0, 8)}</span>
                      <span>{o.payment_method === "cod" ? "💵 COD" : "💳 Card"}</span>
                    </div>
                    <ul className="mt-1.5 space-y-0.5 text-sm text-brand-cacao">
                      {o.order_items?.map((i) => (
                        <li key={i.id}>{i.qty}× {i.name_snapshot}</li>
                      ))}
                    </ul>
                    {o.notes && <p className="mt-1 rounded-lg bg-brand-honey/15 px-2 py-1 text-xs italic text-brand-cacao/70">“{o.notes}”</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-display text-brand-burnt">{formatKwacha(o.total)}</span>
                      <span className="text-xs text-brand-cacao/50">{new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {NEXT[o.status] && (
                        <button
                          onClick={() => advance(o, NEXT[o.status]!)}
                          className="flex-1 rounded-full bg-brand-burnt px-3 py-1.5 text-xs font-bold text-brand-white transition-colors hover:bg-brand-cacao"
                        >
                          {NEXT[o.status] === "delivered" ? "Delivered ✓" : `→ ${NEXT[o.status]}`}
                        </button>
                      )}
                      {(o.status === "received" || o.status === "cooking") && (
                        <button
                          onClick={() => advance(o, "cancelled")}
                          className="rounded-full border border-brand-cacao/20 px-3 py-1.5 text-xs font-semibold text-brand-cacao/60 hover:bg-brand-cacao/5"
                        >
                          Cancel
                        </button>
                      )}
                      {o.status === "cancelled" && (
                        <button
                          onClick={() => advance(o, "received")}
                          className="rounded-full border border-brand-cacao/20 px-3 py-1.5 text-xs font-semibold text-brand-cacao/60 hover:bg-brand-cacao/5"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        );
      })}
    </div>
  );
}
