import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { MenuAdmin } from "@/components/admin/menu-admin";
import type { Category, MenuItem } from "@/lib/types";

export const metadata = { title: "Admin · Menu" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const supabase = getSupabaseServerClient()!;
  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase.from("menu_items").select("*, categories(name, slug)").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-brand-cacao">Menu manager 🍽️</h1>
      <MenuAdmin initialItems={(items ?? []) as MenuItem[]} categories={(categories ?? []) as Category[]} />
    </div>
  );
}
