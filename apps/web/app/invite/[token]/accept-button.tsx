'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
  token: string;
  action: (token: string) => Promise<{ ok: true } | { ok: false; error: string }>;
}

export function AcceptButton({ token, action }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const r = await action(token);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.push('/inbox');
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Button className="w-full" onClick={onClick} disabled={pending}>
        {pending ? 'Joining…' : 'Accept invite'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
