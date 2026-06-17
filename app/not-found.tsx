import Link from "next/link";
import { Compass, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-border bg-card px-8 py-12 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Error 404
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
            We couldn&apos;t find that page
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            The page you&apos;re looking for may have been moved, removed, or
            never existed. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            Browse providers
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
