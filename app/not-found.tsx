import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-7xl">🍽️</p>
      <h1 className="font-display text-4xl text-brand-burnt">That plate is empty!</h1>
      <p className="max-w-md text-brand-cacao/80">
        Page not found — but the menu is full and waiting for you.
      </p>
      <Button href="/menu">See the Menu</Button>
    </div>
  );
}
