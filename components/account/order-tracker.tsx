"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const stages: { id: OrderStatus; label: string; emoji: string }[] = [
  { id: "received", label: "Received", emoji: "🛎️" },
  { id: "cooking", label: "Cooking", emoji: "🔥" },
  { id: "ready", label: "Ready", emoji: "🍽️" },
  { id: "delivered", label: "Delivered", emoji: "🛵" },
];

/** Status tracker — live updates via Supabase Realtime on the orders table. */
export function OrderTracker({ orderId, initialStatus }: { orderId: string; initialStatus: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const reduced = useReducedMotionSafe();
  const currentIndex = Math.max(0, stages.findIndex((s) => s.id === status));

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => setStatus(payload.new.status as OrderStatus),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <div className="mt-6" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={4} aria-label="Order status">
      <div className="flex items-center">
        {stages.map((s, i) => {
          const reached = i <= currentIndex;
          return (
            <div key={s.id} className={cn("flex items-center", i < stages.length - 1 && "flex-1")}>
              <motion.div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full text-lg",
                  reached ? "bg-brand-burnt shadow-card" : "bg-brand-honey/20",
                )}
                // pop the stage the moment it becomes active
                initial={false}
                animate={reached && !reduced ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {s.emoji}
              </motion.div>
              {i < stages.length - 1 && (
                <div className="mx-1 h-1 flex-1 overflow-hidden rounded-full bg-brand-honey/20">
                  <motion.div
                    className="h-full bg-brand-burnt"
                    initial={false}
                    animate={{ scaleX: i < currentIndex ? 1 : 0 }}
                    style={{ transformOrigin: "left" }}
                    transition={{ duration: reduced ? 0 : 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-brand-cacao/60">
        {stages.map((s, i) => (
          <span key={s.id} className={i <= currentIndex ? "text-brand-burnt" : undefined}>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
