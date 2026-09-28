import { cn } from "@/lib/utils";

/**
 * Sizzling-pan loader — brand spinner with rising steam wisps (CSS-driven,
 * automatically still under prefers-reduced-motion via globals.css).
 */
export function SizzleSpinner({ label, className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative">
        {/* steam */}
        <span className="steam -top-4 left-3 h-5" style={{ animationDelay: "0s" }} />
        <span className="steam -top-4 left-1/2 h-6" style={{ animationDelay: "0.5s" }} />
        <span className="steam -top-4 left-7 h-5" style={{ animationDelay: "1s" }} />
        {/* pan */}
        <div className="flex h-12 w-12 items-end overflow-hidden rounded-full border-4 border-brand-cacao bg-brand-burnt">
          <div
            className="h-3 w-full animate-pulse rounded-t-full bg-brand-honey"
            style={{ animationDuration: "0.6s" }}
          />
        </div>
        {/* handle */}
        <div className="absolute -right-4 bottom-1 h-1.5 w-5 rounded-full bg-brand-cacao" />
      </div>
      {label && <span className="text-sm font-semibold text-brand-cacao/80">{label}</span>}
    </div>
  );
}
