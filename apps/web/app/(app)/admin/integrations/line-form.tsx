'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveLineIntegrationAction, type SaveLineState } from './actions';

interface Props {
  initial?: {
    botUserId?: string | null;
    hasSecret?: boolean;
    hasToken?: boolean;
  };
}

export function LineForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState<SaveLineState, FormData>(
    saveLineIntegrationAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="channelSecret">Channel Secret</Label>
        <Input
          id="channelSecret"
          name="channelSecret"
          type="password"
          required
          placeholder={initial?.hasSecret ? '•••••••• (saved — re-enter to change)' : ''}
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          From LINE Developers → Provider → Channel → Basic settings → Channel secret.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="channelAccessToken">Channel Access Token (long-lived)</Label>
        <Input
          id="channelAccessToken"
          name="channelAccessToken"
          type="password"
          required
          placeholder={initial?.hasToken ? '•••••••• (saved — re-enter to change)' : ''}
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          From LINE Developers → Channel → Messaging API → Channel access token.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="botUserId">Bot User ID (optional)</Label>
        <Input
          id="botUserId"
          name="botUserId"
          type="text"
          defaultValue={initial?.botUserId ?? ''}
          placeholder="U1a2b3c4d5..."
        />
        <p className="text-xs text-muted-foreground">
          From LINE Developers → Channel → Messaging API → &quot;Your user ID&quot;. Used to route
          incoming webhooks to this org. If you only have one LINE integration, leave blank.
        </p>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.ok && <p className="text-sm text-mint">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save LINE integration'}
      </Button>
    </form>
  );
}
