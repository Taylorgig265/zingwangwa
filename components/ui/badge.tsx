import { cn } from "@/lib/utils";
import type { SpiceLevel } from "@/lib/types";

const spiceEmoji: Record<SpiceLevel, string | null> = {
  none: null,
  mild: "🌶",
  medium: "🌶🌶",
  hot: "🌶🌶🌶",
  zing: "🔥🌶🌶🌶",
};

export function SpiceBadge({ level, className }: { level: SpiceLevel; className?: string }) {
  const emoji = spiceEmoji[level];
  if (!emoji) return null;
  return (
    <span
      className={cn("rounded-full bg-brand-burnt/10 px-2 py-0.5 text-xs", className)}
      title={`Spice: ${level}`}
    >
      {emoji}
    </span>
  );
}

export function AvailabilityBadge({ available }: { available: boolean }) {
  if (available) return null;
  return (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-cacao px-3 py-1 font-display text-xs uppercase tracking-wide text-brand-white">
      Sold out — back soon!
    </span>
  );
}
