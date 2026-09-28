"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { useToast } from "@/components/ui/toast";
import { formatKwacha } from "@/lib/utils";
import type { Category, MenuItem, SpiceLevel } from "@/lib/types";

const SPICE: SpiceLevel[] = ["none", "mild", "medium", "hot", "zing"];

type Draft = Omit<MenuItem, "id" | "created_at" | "categories"> & { id: string | null };

function toDraft(item: MenuItem): Draft {
  const { id, category_id, name, description, price_zmw, image_url, tags, is_available, is_featured, spice_level, prep_time_mins } = item;
  return { id, category_id, name, description, price_zmw, image_url, tags, is_available, is_featured, spice_level, prep_time_mins };
}

const EMPTY: Draft = {
  id: null,
  category_id: "",
  name: "",
  description: "",
  price_zmw: 0,
  image_url: null,
  tags: [],
  is_available: true,
  is_featured: false,
  spice_level: "medium",
  prep_time_mins: 10,
};

/**
 * Menu CRUD — list, toggle availability/featured inline, edit panel with
 * image upload to the `menu-images` storage bucket. RLS enforces admin-only.
 */
export function MenuAdmin({ initialItems, categories }: { initialItems: MenuItem[]; categories: Category[] }) {
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const reduced = useReducedMotionSafe();
  const supabase = getSupabaseBrowserClient();

  async function patch(id: string, changes: Partial<MenuItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i))); // optimistic
    const { error } = await supabase!.from("menu_items").update(changes).eq("id", id);
    if (error) toast(`Couldn't save — ${error.message}`, "😬");
  }

  async function uploadImage(file: File): Promise<string | null> {
    if (!supabase) return null;
    const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase()}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file, { cacheControl: "31536000" });
    if (error) {
      toast(`Upload failed — ${error.message}`, "😬");
      return null;
    }
    return supabase.storage.from("menu-images").getPublicUrl(path).data.publicUrl;
  }

  async function save() {
    if (!draft || !supabase) return;
    if (!draft.name.trim() || !draft.category_id) {
      toast("Name and category are required.", "⚠️");
      return;
    }
    setSaving(true);
    const { id, ...row } = draft;
    row.tags = row.tags.map((t) => t.trim()).filter(Boolean);

    if (id) {
      const { error } = await supabase.from("menu_items").update(row).eq("id", id);
      if (error) toast(`Save failed — ${error.message}`, "😬");
      else {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...row } : i)));
        toast("Saved! 🔥");
        setDraft(null);
      }
    } else {
      const { data, error } = await supabase.from("menu_items").insert(row).select("*, categories(name, slug)").single();
      if (error) toast(`Save failed — ${error.message}`, "😬");
      else {
        setItems((prev) => [...prev, data as MenuItem].sort((a, b) => a.name.localeCompare(b.name)));
        toast("New dish on the menu! 🍽️");
        setDraft(null);
      }
    }
    setSaving(false);
  }

  const inputCls =
    "w-full rounded-xl border-2 border-brand-honey/50 bg-brand-white px-3 py-2 text-sm text-brand-cacao focus:border-brand-burnt focus:outline-none";

  return (
    <div className="space-y-4">
      <button
        onClick={() => setDraft({ ...EMPTY, category_id: categories[0]?.id ?? "" })}
        className="rounded-full bg-brand-honey px-5 py-2 font-display text-brand-cacao shadow-card transition-colors hover:bg-[#ffd23f]"
      >
        + New dish
      </button>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 rounded-2xl border-2 border-brand-honey/40 bg-brand-white p-3 shadow-card">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-honey/15">
              {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />}
              {!item.is_available && (
                <span className="absolute inset-0 grid place-items-center bg-brand-cacao/70 text-xs font-bold text-brand-white">SOLD OUT</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-brand-cacao">
                {item.is_featured && "⭐ "}{item.name}
              </p>
              <p className="text-xs text-brand-cacao/60">{item.categories?.name ?? "—"} · {formatKwacha(item.price_zmw)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => patch(item.id, { is_available: !item.is_available })}
                  className={`rounded-full px-2.5 py-1 font-semibold ${item.is_available ? "bg-brand-honey/25 text-brand-cacao" : "bg-brand-cacao/10 text-brand-cacao/50 line-through"}`}
                >
                  {item.is_available ? "Available" : "Sold out"}
                </button>
                <button
                  onClick={() => patch(item.id, { is_featured: !item.is_featured })}
                  className="rounded-full bg-brand-honey/25 px-2.5 py-1 font-semibold text-brand-cacao"
                >
                  {item.is_featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => setDraft(toDraft(item))}
                  className="rounded-full bg-brand-burnt px-2.5 py-1 font-semibold text-brand-white"
                >
                  Edit
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit / create panel */}
      <AnimatePresence>
        {draft && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-brand-cacao/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDraft(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={reduced ? false : { y: 40, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="max-h-[85vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-3xl bg-brand-white p-6 shadow-bloom"
            >
              <h2 className="font-display text-2xl text-brand-cacao">{draft.id ? "Edit dish" : "New dish"} 🍳</h2>

              <input className={inputCls} placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <textarea className={inputCls} rows={2} placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-brand-cacao/70">
                  Price (K)
                  <input type="number" min={0} className={inputCls} value={draft.price_zmw || ""} onChange={(e) => setDraft({ ...draft, price_zmw: Number(e.target.value) })} />
                </label>
                <label className="text-xs font-semibold text-brand-cacao/70">
                  Prep (mins)
                  <input type="number" min={1} className={inputCls} value={draft.prep_time_mins || ""} onChange={(e) => setDraft({ ...draft, prep_time_mins: Number(e.target.value) })} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-brand-cacao/70">
                  Category
                  <select className={inputCls} value={draft.category_id} onChange={(e) => setDraft({ ...draft, category_id: e.target.value })}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-brand-cacao/70">
                  Spice
                  <select className={inputCls} value={draft.spice_level} onChange={(e) => setDraft({ ...draft, spice_level: e.target.value as SpiceLevel })}>
                    {SPICE.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>

              <input
                className={inputCls}
                placeholder="Tags (comma separated)"
                value={draft.tags.join(", ")}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(",") })}
              />

              <div className="flex items-center gap-3">
                <button onClick={() => fileRef.current?.click()} className="rounded-full border-2 border-dashed border-brand-burnt/50 px-4 py-2 text-sm font-semibold text-brand-burnt hover:bg-brand-honey/15">
                  📷 {draft.image_url ? "Change photo" : "Upload photo"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadImage(file);
                    if (url) setDraft((d) => (d ? { ...d, image_url: url } : d));
                  }}
                />
                {draft.image_url && <span className="truncate text-xs text-brand-cacao/50">…{draft.image_url.slice(-30)}</span>}
              </div>

              <div className="flex gap-4 text-sm font-semibold text-brand-cacao">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={draft.is_available} onChange={(e) => setDraft({ ...draft, is_available: e.target.checked })} />
                  Available
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={draft.is_featured} onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })} />
                  Featured
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-brand-burnt py-3 font-display text-lg text-brand-white shadow-bloom transition-colors hover:bg-brand-cacao disabled:opacity-60">
                  {saving ? "Saving…" : "Save dish 🔥"}
                </button>
                <button onClick={() => setDraft(null)} className="rounded-full px-4 text-sm font-semibold text-brand-cacao/60 hover:text-brand-cacao">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
