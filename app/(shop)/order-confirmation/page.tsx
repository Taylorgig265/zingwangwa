import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationClient } from "./confirmation-client";
import { SizzleSpinner } from "@/components/ui/spinner";

export const metadata: Metadata = { title: "Order confirmed" };

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><SizzleSpinner label="Plating up…" /></div>}>
      <ConfirmationClient />
    </Suspense>
  );
}
