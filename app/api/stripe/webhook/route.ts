import { NextResponse } from "next/server";
import { getGateway } from "@/lib/stripe";
import { priceCart, createOrder } from "@/lib/orders";

/**
 * POST /api/stripe/webhook — Payment gateway webhook sink.
 * On checkout.session.completed (Pawapay or COD confirmation) we re-price from the DB and write the order.
 * 
 * Note: The route name stays "/api/stripe/webhook" for backward compatibility,
 * but it now handles Pawapay webhook events as well as COD confirmations.
 */
export async function POST(request: Request) {
  const body = await request.text(); // raw body required for signature verification
  // In a real Pawapay integration, we'd verify the Pawapay signature here
  // using: const isValid = verifyPawapaySignature(body, signature);
  
  // For now, we accept the webhook and process it as a COD-style order creation
  try {
    // Try to parse as a Pawapay-style event
    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
    }

    // Handle Pawapay checkout.session.completed or similar events
    if (event.type === "checkout.session.completed" || event.type === "payment.success") {
      const session = event.data?.object;
      if (!session) throw new Error("No session data in webhook payload.");

      // Rebuild the cart from the session metadata and RE-PRICE from the DB
      const items = (session.metadata?.items ?? "")
        .split(",")
        .map((pair: string) => {
          const [id, qty] = pair.split(":");
          return { id, qty: Number(qty) };
        })
        .filter((i: { id: string; qty: number }) => i.id && i.qty > 0);

      const lines = await priceCart(items);
      if (!lines.length) throw new Error("No priced lines recovered from session metadata.");

      await createOrder({
        lines,
        method: "pawapay",
        phone: session.metadata?.phone ?? "",
        deliveryAddress: session.metadata?.address || null,
        notes: session.metadata?.notes || null,
        pawapayOrderId: session.id,
        userId: session.client_reference_id ?? null,
      });
    }
    // Handle COD confirmation (if Pawapay also supports COD-style webhooks)
    else if (event.type === "cod.confirmed") {
      const orderData = event.data?.object;
      if (!orderData) throw new Error("No order data in webhook payload.");

      await createOrder({
        lines: orderData.lines || [],
        method: "cod",
        phone: orderData.phone ?? "",
        deliveryAddress: orderData.address || null,
        notes: orderData.notes || null,
        userId: orderData.userId || null,
      });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Order write failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}