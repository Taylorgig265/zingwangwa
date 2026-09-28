import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { FALLBACK_MENU, getFallbackCategories } from "@/lib/menu-data";
import type { Category, MenuItem } from "@/lib/types";

/**
 * Data access with graceful static fallback — the site renders fully
 * (and builds) even before Supabase env vars are configured.
 */

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getFallbackCategories();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data?.length) return getFallbackCategories();
  return data as Category[];
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return FALLBACK_MENU;
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, categories(name, slug)")
    .order("name", { ascending: true });
  if (error || !data?.length) return FALLBACK_MENU;
  return data as MenuItem[];
}

export async function getFeaturedItems(): Promise<MenuItem[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return FALLBACK_MENU.filter((i) => i.is_featured);
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, categories(name, slug)")
    .eq("is_featured", true)
    .eq("is_available", true)
    .limit(8);
  if (error || !data?.length) return FALLBACK_MENU.filter((i) => i.is_featured);
  return data as MenuItem[];
}
