import type { Metadata } from "next";
import { CartPageClient } from "./cart-page-client";

export const metadata: Metadata = { title: "Your Plate" };

export default function CartPage() {
  return <CartPageClient />;
}
