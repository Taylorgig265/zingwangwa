import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { OrdersBoard } from "@/components/admin/orders-board";
import type { Order } from "@/lib/types";

export const metadata = { title: "Admin · Orders" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = getSupabaseServerClient()!;
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .neq("status", "delivered")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-brand-cacao">Live orders 🔥</h1>
      <OrdersBoard initialOrders={(data ?? []) as Order[]} />
    </div>
  );
}
