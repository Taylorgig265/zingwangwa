import { cn } from "@/lib/utils";

/** Honey-shimmer skeleton block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("honey-shimmer rounded-2xl bg-brand-honey/20", className)} />;
}

/** Menu-card shaped skeleton. */
export function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-brand-white shadow-card">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}
