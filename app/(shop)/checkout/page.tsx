import type { Metadata } from "next";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay with card/mobile money via Stripe, or cash on delivery.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
