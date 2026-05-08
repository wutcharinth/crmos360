import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-8">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-warm">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Lost in the inbox.
        </h1>
        <p className="mt-3 text-sm text-ink-2">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-warm"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
