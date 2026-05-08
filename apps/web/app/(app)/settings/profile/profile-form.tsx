'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveProfileAction, type ProfileState } from './actions';

interface Props {
  initial: { email: string; fullName: string; avatarUrl: string };
}

export function ProfileForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    saveProfileAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={initial.email} disabled />
        <p className="text-xs text-muted-foreground">
          Email is managed by Supabase Auth.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" defaultValue={initial.fullName} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          defaultValue={initial.avatarUrl}
          placeholder="https://…"
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-mint">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save profile'}
      </Button>
    </form>
  );
}
