'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
  customerId: string;
  initialName: string;
  initialTags: string[];
}

export function CustomerActions({ customerId, initialName, initialTags }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagDraft, setTagDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function addTag() {
    const v = tagDraft.trim();
    if (!v || tags.includes(v)) {
      setTagDraft('');
      return;
    }
    setTags([...tags, v]);
    setTagDraft('');
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/customers/${customerId}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: name || null, tags }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? `${res.status}`);
        }
        setSavedAt(Date.now());
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed');
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="cust-name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Name
        </label>
        <input
          id="cust-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm/30"
          placeholder="e.g. คุณพิมพ์พร"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded bg-paper-2 px-2 py-0.5 text-xs"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove tag ${t}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <input
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 rounded-md border bg-background px-2 py-1 text-sm"
            placeholder="add tag…"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            +
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={pending} size="sm">
          {pending ? 'Saving…' : 'Save'}
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
        {savedAt && Date.now() - savedAt < 3000 && (
          <span className="text-xs text-mint">Saved.</span>
        )}
      </div>
    </div>
  );
}
