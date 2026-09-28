"use client";

import { useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useCart } from "@/lib/cart-store";

/**
 * Cart sync: when a user is logged in, cart state is mirrored to
 * `cart_snapshots` in Supabase (debounced) and restored on login,
 * so the plate follows them across devices.
 */
export function useCartSync() {
  const lines = useCart((s) => s.lines);
  const setLines = useCart((s) => s.setLines);
  const userIdRef = useRef<string | null>(null);
  const supabase = getSupabaseBrowserClient();

  // Pull remote cart on login; merge missing items.
  useEffect(() => {
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userId = session?.user.id ?? null;
      if (!userId || userIdRef.current === userId) return;
      userIdRef.current = userId;
      const { data } = await supabase
        .from("cart_snapshots")
        .select("items")
        .eq("user_id", userId)
        .maybeSingle();
      if (Array.isArray(data?.items) && data.items.length) {
        const local = useCart.getState().lines;
        const remoteIds = new Set(local.map((l) => l.item.id));
        setLines([...local, ...data.items.filter((l: any) => !remoteIds.has(l.item?.id))]);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase, setLines]);

  // Push on change (debounced).
  useEffect(() => {
    if (!supabase || !userIdRef.current) return;
    const t = setTimeout(() => {
      supabase
        .from("cart_snapshots")
        .upsert({ user_id: userIdRef.current, items: lines, updated_at: new Date().toISOString() })
        .then(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [supabase, lines]);
}
