import { SizzleSpinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SizzleSpinner label="Firing up the grill…" />
    </div>
  );
}
