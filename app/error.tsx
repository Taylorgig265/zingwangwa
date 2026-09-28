"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl">🔥💥</p>
      <h1 className="font-display text-3xl text-brand-burnt">Dropped something on the grill!</h1>
      <p className="max-w-md text-brand-cacao/80">
        Something went wrong on our side. Give it another go — the chips are still hot.
      </p>
      <Button onClick={reset}>Flip it again</Button>
    </div>
  );
}
