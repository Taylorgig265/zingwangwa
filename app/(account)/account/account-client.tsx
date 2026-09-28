"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { OrderTracker } from "@/components/account/order-tracker";
import { FALLBACK_MENU } from "@/lib/menu-data";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { formatKwacha, cn } from "@/lib/utils";
import type { Favorite, Order, MenuItem } from "@/lib/types";

const tabs = ["Orders", "Favorites", "Profile"] as const;

export function AccountClient({
  orders,
  favorites,
  email,
  demo = false,
}: {
  orders: Order[];
  favorites: Favorite[];
  email: string | null;
  demo?: boolean;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Orders");
  const { add, open } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  function reorder(order: Order) {
    let added = 0;
    order.order_items?.forEach((oi) => {
      // Match against fallback menu (or fetched favorites) — name snapshot keeps it working
      const item =
        FALLBACK_MENU.find((m) => m.id === oi.menu_item_id || m.name === oi.name_snapshot) ??
        favoriteItem(oi.menu_item_id);
      if (item) {
        add(item, oi.qty);
        added++;
      }
    });
    toast(added ? `Re-added ${added} dish${added > 1 ? "es" : ""} — nice one! 🔁` : "Items no longer on the menu 😢", added ? "🍽️" : "😢");
    if (added) open();
  }

  function favoriteItem(id: string | null): MenuItem | undefined {
    const fav = favorites.find((f) => f.menu_item_id === id);
    return fav?.menu_items as MenuItem | undefined;
  }

  async function signOut() {
    await supabase?.auth.signOut();
    router.refresh();
    toast("Signed out. Come back hungry! 👋");
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-brand-cacao">Hey, hungry human 👋</h1>
          <p className="text-brand-cacao/60">{demo ? "Demo mode — connect Supabase for accounts" : email}</p>
        </div>
        {!demo && (
          <button onClick={signOut} className="text-sm font-semibold text-brand-burnt underline underline-offset-2">
            Sign out
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-full bg-brand-honey/10 p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative flex-1 rounded-full px-4 py-2 font-display text-sm transition-colors",
              tab === t ? "text-brand-white" : "text-brand-cacao",
            )}
          >
            {tab === t && (
              <motion.span
                layoutId="account-pill"
                className="absolute inset-0 rounded-full bg-brand-burnt"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          {tab === "Orders" &&
            (orders.length === 0 ? (
              <Empty hint="No orders yet — the grill misses you." icon="🛒" />
            ) : (
              <ul className="space-y-6">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-3xl border-2 border-brand-honey/40 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-lg text-brand-cacao">
                          Order {o.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-brand-cacao/60">
                          {new Date(o.created_at).toLocaleString()} · {formatKwacha(o.total)}
                        </p>
                      </div>
                      <Button variant="white" className="px-4 py-2 text-sm" onClick={() => reorder(o)}>
                        Order again 🔁
                      </Button>
                    </div>
                    <OrderTracker orderId={o.id} initialStatus={o.status} />
                    <ul className="mt-4 space-y-1 text-sm text-brand-cacao/75">
                      {o.order_items?.map((oi) => (
                        <li key={oi.id} className="flex justify-between">
                          <span>{oi.qty}× {oi.name_snapshot}</span>
                          <span>{formatKwacha(oi.qty * oi.unit_price)}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ))}

          {tab === "Favorites" &&
            (favorites.length === 0 ? (
              <Empty hint="Tap the ❤️ on menu items to stash them here." icon="❤️" />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {favorites.map((f) => (
                  <li key={f.menu_item_id} className="flex items-center justify-between rounded-2xl bg-brand-honey/10 p-4">
                    <span className="font-display text-brand-cacao">{f.menu_items?.name ?? "Menu item"}</span>
                    {f.menu_items && (
                      <Button variant="honey" className="px-4 py-2 text-sm" onClick={() => { add(f.menu_items as MenuItem); open(); }}>
                        Add 🍽️
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ))}

          {tab === "Profile" && <ProfileForm email={email} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Empty({ icon, hint }: { icon: string; hint: string }) {
  return (
    <div className="rounded-3xl bg-brand-honey/10 p-12 text-center">
      <p className="text-5xl">{icon}</p>
      <p className="mt-3 text-brand-cacao/70">{hint}</p>
      <Button href="/menu" className="mt-6">Browse the menu</Button>
    </div>
  );
}

function ProfileForm({ email }: { email: string | null }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const supabase = getSupabaseBrowserClient();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name, phone })
        .eq("id", data.user.id);
      toast(error ? error.message : "Profile saved! ✅", error ? "😬" : "✅");
    }
    setSaving(false);
  }

  const inputCls =
    "w-full rounded-2xl border-2 border-brand-honey/50 px-4 py-3 text-brand-cacao placeholder:text-brand-cacao/40 focus:border-brand-burnt focus:outline-none";

  return (
    <form onSubmit={save} className="max-w-md space-y-3">
      <input className={inputCls} defaultValue={email ?? ""} disabled aria-label="Email" />
      <input className={inputCls} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={inputCls} placeholder="Phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Button type="submit" disabled={saving || !supabase}>
        {saving ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
