import { cn } from "@/lib/utils";

/**
 * Brand logo lockup.
 *
 * Brand rules enforced:
 *  - 95px clear space each side (px padding on the wrapper).
 *  - Minimum render width 152px — the wrapper never shrinks below that.
 *  - Always sits on a solid burnt container (never on busy imagery).
 *  - Never stretched or recolored.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("inline-flex items-center px-[95px]", className)}>
      <div
        className="flex min-w-[152px] select-none items-center gap-2 rounded-2xl bg-brand-burnt px-4 py-2 shadow-card"
        style={{ width: "fit-content" }}
      >
        <span className="animate-logo-bob text-2xl" aria-hidden>
          🔥
        </span>
        <div className="leading-none">
          <span className="font-display text-lg text-brand-honey">Zingwangwa</span>
          {!compact && (
            <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-white">
              Street Foods
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
