'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type Result = { ok: true } | { ok: false; error: string };

export async function acceptInviteAction(token: string): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not authenticated' };

  const admin = createAdminClient();

  const { data: invite } = await admin
    .from('org_invites')
    .select('id, org_id, role, email, accepted_at, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (!invite) return { ok: false, error: 'Invite not found' };
  if (invite.accepted_at) return { ok: false, error: 'Invite already accepted' };
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'Invite expired' };
  }

  if (user.email && invite.email && user.email.toLowerCase() !== invite.email.toLowerCase()) {
    return { ok: false, error: 'This invite was sent to a different email' };
  }

  await admin.from('user_profiles').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    },
    { onConflict: 'id' },
  );

  const { error: insertErr } = await admin
    .from('org_members')
    .upsert(
      { org_id: invite.org_id, user_id: user.id, role: invite.role },
      { onConflict: 'org_id,user_id' },
    );
  if (insertErr) return { ok: false, error: insertErr.message };

  await admin.from('org_invites').update({ accepted_at: new Date().toISOString() }).eq('id', invite.id);

  return { ok: true };
}
