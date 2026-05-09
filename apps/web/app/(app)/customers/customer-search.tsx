'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function CustomerSearch({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();
  const [, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    startTransition(() => router.push(`/customers?${params.toString()}`));
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name…"
        className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm/30"
      />
    </form>
  );
}
