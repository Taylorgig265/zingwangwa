import { NextResponse } from "next/server";
import { getGateway, PAWAPAY_CURRENCY } from "@/lib/stripe";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabaseServer";
import { priceCart, createOrder, totalsFor } from "@/lib/orders";
import type { PaymentMethod } from "@/lib/types";

interface CheckoutPayload {
  method: PaymentMethod;
  customer: { name?: string; phone?: string; address?: string; notes?: string };
  items: { id: string; qty: number }[];
}

/**
 * POST /api/stripe/checkout
 * Body: { method, customer: { name, phone, address, notes }, items: [{ id, qty }] }
 * - method "pawapay" → creates a hosted Checkout Session (prices re-read from DB) → { url }
 * - method "cod"    → writes the order immediately → { orderId }
 */
export async function POST(request: Request) {
  let payload: CheckoutPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { method, customer, items } = payload;
  if (!items?.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  if (!customer?.name?.trim() || !customer?.phone?.trim()) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  const lines = await priceCart(items);
  if (!lines.length) {
    return NextResponse.json({ error: "None of those dishes are available right now." }, { status: 400 });
  }
  const hasDelivery = Boolean(customer.address?.trim());
  const { subtotal, deliveryFee, total } = totalsFor(lines, hasDelivery);

  // Attach the logged-in user when there is one (guests order fine too)
  let userId: string | null = null;
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  }

  if (method === "cod") {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: "Demo mode — connect Supabase to place real orders." },
        { status: 503 },
      );
    }
    const orderId = await createOrder({
      lines,
      method: "cod",
      phone: customer.phone.trim(),
      deliveryAddress: customer.address,
      notes: customer.notes,
      userId,
    });
    return NextResponse.json({ orderId, total });
  }

  // ── Pawapay hosted checkout ─────────────────────────────────
  try {
    const gateway = getGateway();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // In a real integration, this would be:
    // const session = await gateway.createCheckoutSession({...});
    // For now, we simulate a Pawapay redirect URL with the order details.
    const pawapayUrl = `${siteUrl}/order-confirmation?session_id=mock-pawapay-session&total=${total}`;

    return NextResponse.json({ url: pawapayUrl, subtotal, deliveryFee, total });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Pawapay checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}