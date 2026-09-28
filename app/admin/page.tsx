import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { RevenueChart, type DailyPoint } from "@/components/admin/revenue-chart";
import type { Order } from "@/lib/types";
import { formatKwacha } from "@/lib/utils";

export const metadata = { title: "Admin · Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = getSupabaseServerClient()!; // layout already gates demo mode

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [{ data: orders }, { count: menuCount }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, total, created_at, payment_method")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true }),
    supabase.from("menu_items").select("id", { count: "exact", head: true }),
  ]);

  const rows = (orders ?? []) as Pick<Order, "id" | "status" | "total" | "created_at" | "payment_method">[];
  const live = rows.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const revenue = rows.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  // Bucket revenue per day for the last 30 days
  const byDay = new Map<string, number>();
  for (const o of rows) {
    if (o.status === "cancelled") continue;
    const day = o.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + o.total);
  }
  const series: DailyPoint[] = [];
  for (let d = 0; d < 30; d++) {
    const date = new Date(Date.now() - (29 - d) * 86_400_000).toISOString().slice(0, 10);
    series.push({ day: date.slice(5), revenue: byDay.get(date) ?? 0 });
  }

  const recent = [...rows].reverse().slice(0, 8);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-brand-cacao">Kitchen dashboard 🔥</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi emoji="💰" label="Revenue (30d)" value={formatKwacha(revenue)} />
        <Kpi emoji="🧾" label="Orders (30d)" value={String(rows.length)} />
        <Kpi emoji="🔥" label="Live orders" value={String(live.length)} />
        <Kpi emoji="🍽️" label="Menu items" value={String(menuCount ?? 0)} />
      </div>

      <section className="rounded-3xl border-2 border-brand-honey/40 p-5">
        <h2 className="mb-4 font-display text-xl text-brand-burnt">Revenue — last 30 days</h2>
        <RevenueChart data={series} />
      </section>

      <section className="rounded-3xl border-2 border-brand-honey/40 p-5">
        <h2 className="mb-4 font-display text-xl text-brand-burnt">Latest orders</h2>
        <ul className="divide-y divide-brand-honey/30 text-sm">
          {recent.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="font-mono text-xs text-brand-cacao/50">#{o.id.slice(0, 8)}</span>
              <span className="rounded-full bg-brand-honey/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-cacao">
                {o.status}
              </span>
              <span className="text-brand-cacao/60">{o.payment_method === "cod" ? "💵 COD" : "💳 Stripe"}</span>
              <span className="ml-auto font-bold text-brand-cacao">{formatKwacha(o.total)}</span>
            </li>
          ))}
          {!recent.length && <li className="py-4 text-brand-cacao/50">No orders yet — fire up the grill! 🔥</li>}
        </ul>
      </section>
    </div>
  );
}

function Kpi({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="rounded-3xl border-2 border-brand-honey/40 bg-brand-honey/10 p-4">
      <p className="text-2xl" aria-hidden>{emoji}</p>
      <p className="mt-1 font-display text-2xl text-brand-cacao">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-cacao/60">{label}</p>
    </div>
  );
}
