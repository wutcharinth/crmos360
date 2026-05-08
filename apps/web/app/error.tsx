'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('app error', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-8">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-rose">Error</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Something went wrong.</h1>
        <p className="mt-3 text-sm text-ink-2">
          We hit an unexpected error. Try again, or reload the page.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            ref: {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          className="mt-6 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-warm"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
