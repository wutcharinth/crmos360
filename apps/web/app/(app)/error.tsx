'use client';

import { useEffect } from 'react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('app section error', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-8">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-destructive">Error</p>
        <h2 className="mt-2 text-lg font-semibold">Couldn&apos;t load this page.</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            ref: {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          className="mt-4 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
