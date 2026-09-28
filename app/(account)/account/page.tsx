import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { AccountClient } from "./account-client";
import type { Order, Favorite } from "@/lib/types";

export const metadata: Metadata = { title: "My Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = getSupabaseServerClient();

  // Demo mode (no Supabase): show the client shell which explains setup.
  if (!supabase) return <AccountClient orders={[]} favorites={[]} email={null} demo />;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: orders }, { data: favorites }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("favorites").select("*, menu_items(*)").eq("user_id", user.id),
  ]);

  return (
    <AccountClient
      orders={(orders ?? []) as Order[]}
      favorites={(favorites ?? []) as Favorite[]}
      email={user.email ?? null}
    />
  );
}
