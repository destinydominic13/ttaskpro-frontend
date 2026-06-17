import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold tracking-tight text-foreground">
          Loading TaskPro
        </p>
        <p className="text-sm text-muted-foreground">
          Just a moment while we get things ready.
        </p>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
