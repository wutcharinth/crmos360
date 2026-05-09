'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveOrgSettingsAction, type OrgSettingsState } from './actions';

interface Props {
  initial: {
    name: string;
    slug: string;
    plan: string;
    defaultAutoReply: boolean;
    replyTone: string;
    timezone: string;
  };
}

export function OrgSettingsForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState<OrgSettingsState, FormData>(
    saveOrgSettingsAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Workspace name</Label>
        <Input id="name" name="name" defaultValue={initial.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={initial.slug} required />
        <p className="text-xs text-muted-foreground">
          Used in URLs. Lowercase, dashes only.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="defaultAutoReply"
            defaultChecked={initial.defaultAutoReply}
            className="h-4 w-4"
          />
          <span>Enable auto-reply on new conversations by default</span>
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="replyTone">Default reply tone</Label>
        <select
          id="replyTone"
          name="replyTone"
          defaultValue={initial.replyTone}
          className="block w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Business timezone</Label>
        <Input
          id="timezone"
          name="timezone"
          defaultValue={initial.timezone}
          placeholder="Asia/Bangkok"
        />
        <p className="text-xs text-muted-foreground">
          IANA zone (Asia/Bangkok, Asia/Tokyo, UTC, etc.)
        </p>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-mint">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
}
