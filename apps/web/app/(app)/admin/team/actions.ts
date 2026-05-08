'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { inviteMemberSchema } from '@crmos360/shared';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

const INVITE_TTL_DAYS = 7;

type InviteResult =
  | { ok: true; inviteId: string; inviteUrl: string }
  | { ok: false; error: string };

export async function inviteMemberAction(input: {
  email: string;
  role: 'admin' | 'agent';
}): Promise<InviteResult> {
  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') return { ok: false, error: 'Forbidden' };

  const admin = createAdminClient();
  const token = randomBytes(24).toString('base64url');
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await admin
    .from('org_invites')
    .upsert(
      {
        org_id: orgId,
        email: parsed.data.email.toLowerCase(),
        role: parsed.data.role,
        token,
        expires_at: expiresAt,
      },
      { onConflict: 'org_id,email' },
    )
    .select('id, token')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'Failed to invite' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const inviteUrl = `${appUrl}/invite/${data.token}`;
  revalidatePath('/admin/team');
  return { ok: true, inviteId: data.id, inviteUrl };
}

export async function revokeInviteAction(inviteId: string): Promise<void> {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') return;
  const admin = createAdminClient();
  await admin.from('org_invites').delete().eq('id', inviteId).eq('org_id', orgId);
  revalidatePath('/admin/team');
}

export async function removeMemberAction(userId: string): Promise<void> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner') return;
  if (userId === user.id) return; // cannot remove self
  const admin = createAdminClient();
  await admin.from('org_members').delete().eq('org_id', orgId).eq('user_id', userId);
  revalidatePath('/admin/team');
}
