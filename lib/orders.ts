import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabaseServer";
import { FALLBACK_MENU } from "@/lib/menu-data";
import type { MenuItem, PaymentMethod } from "@/lib/types";

/** K1,000 local delivery — must match the client-side constant in checkout. */
export const DELIVERY_FEE = 1000;

export interface PricedLine {
  menuItem: MenuItem;
  qty: number;
}

/**
 * Resolve client-submitted item ids against the DATABASE (never trust client prices).
 * Falls back to bundled seed data in demo mode. Silently drops unknown/unavailable items.
 */
export async function priceCart(items: { id: string; qty: number }[]): Promise<PricedLine[]> {
  const wanted = items.filter((i) => i.qty > 0);
  if (!wanted.length) return [];

  let menu: MenuItem[] = FALLBACK_MENU;
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServiceClient();
    const { data } = await supabase
      .from("menu_items")
      .select("*, categories(name, slug)")
      .in("id", wanted.map((i) => i.id))
      .eq("is_available", true);
    if (data?.length) menu = data as MenuItem[];
  }

  return wanted
    .map((i) => {
      const menuItem = menu.find((m) => m.id === i.id);
      return menuItem ? { menuItem, qty: i.qty } : null;
    })
    .filter((l): l is PricedLine => l !== null);
}

export function totalsFor(lines: PricedLine[], hasDelivery: boolean) {
  const subtotal = lines.reduce((s, l) => s + l.menuItem.price_zmw * l.qty, 0);
  const deliveryFee = hasDelivery ? DELIVERY_FEE : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

/** Write order + order_items via the service role (webhook / COD path). Returns order id. */
export async function createOrder(opts: {
  lines: PricedLine[];
  method: PaymentMethod;
  phone: string;
  deliveryAddress?: string | null;
  notes?: string | null;
  pawapayOrderId?: string | null;
  userId?: string | null;
}): Promise<string> {
  const supabase = getSupabaseServiceClient();
  const { subtotal, deliveryFee, total } = totalsFor(opts.lines, Boolean(opts.deliveryAddress?.trim()));

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: opts.userId ?? null,
      pawapay_order_id: opts.pawapayOrderId ?? null,
      status: "received",
      payment_method: opts.method,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      delivery_address: opts.deliveryAddress?.trim() || null,
      phone: opts.phone,
      notes: opts.notes?.trim() || null,
    })
    .select("id")
    .single();
  if (error || !order) throw new Error(`Order insert failed: ${error?.message}`);

  const { error: itemsError } = await supabase.from("order_items").insert(
    opts.lines.map((l) => ({
      order_id: order.id,
      menu_item_id: l.menuItem.id,
      qty: l.qty,
      unit_price: l.menuItem.price_zmw,
      name_snapshot: l.menuItem.name,
    })),
  );
  if (itemsError) throw new Error(`Order items insert failed: ${itemsError.message}`);

  return order.id as string;
}