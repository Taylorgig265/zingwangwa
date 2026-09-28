"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine, MenuItem } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: MenuItem, qty?: number) => void;
  remove: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
  setLines: (lines: CartLine[]) => void;
}

/** Cart store — persisted to localStorage, synced to Supabase on login (see hooks/useCartSync). */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.item.id === item.id);
          const lines = existing
            ? s.lines.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + qty } : l))
            : [...s.lines, { item, qty }];
          return { lines };
        }),
      remove: (itemId) => set((s) => ({ lines: s.lines.filter((l) => l.item.id !== itemId) })),
      setQty: (itemId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.item.id !== itemId)
              : s.lines.map((l) => (l.item.id === itemId ? { ...l, qty } : l)),
        })),
      clear: () => set({ lines: [] }),
      setLines: (lines) => set({ lines }),
    }),
    { name: "zing-cart", storage: createJSONStorage(() => localStorage) },
  ),
);

export function useCartTotals() {
  const lines = useCart((s) => s.lines);
  const subtotal = lines.reduce((sum, l) => sum + l.item.price_zmw * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  return { subtotal, count, lines };
}
