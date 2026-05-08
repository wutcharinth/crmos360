'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

const lineSchema = z.object({
  channelSecret: z.string().min(8, 'Channel secret must be at least 8 chars'),
  channelAccessToken: z.string().min(20, 'Access token looks too short'),
  botUserId: z.string().min(1).optional().or(z.literal('')),
});

export type SaveLineState = {
  ok: boolean;
  error?: string;
} | null;

export async function saveLineIntegrationAction(
  _prev: SaveLineState,
  formData: FormData,
): Promise<SaveLineState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can edit integrations.' };
  }

  const parsed = lineSchema.safeParse({
    channelSecret: formData.get('channelSecret'),
    channelAccessToken: formData.get('channelAccessToken'),
    botUserId: formData.get('botUserId') ?? '',
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();

  const { error } = await admin.from('integrations').upsert(
    {
      org_id: orgId,
      provider: 'line',
      status: 'active',
      config: {
        channel_secret: parsed.data.channelSecret,
        channel_access_token: parsed.data.channelAccessToken,
        bot_user_id: parsed.data.botUserId || null,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'org_id,provider' },
  );

  if (error) return { ok: false, error: error.message };

  await admin.from('audit_logs').insert({
    org_id: orgId,
    actor_user_id: user.id,
    action: 'integration.line.saved',
    target_kind: 'integration',
    metadata: { provider: 'line' },
  });

  revalidatePath('/admin/integrations');
  return { ok: true };
}

export async function disconnectLineAction(): Promise<SaveLineState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can disconnect.' };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('integrations')
    .delete()
    .eq('org_id', orgId)
    .eq('provider', 'line');

  if (error) return { ok: false, error: error.message };

  await admin.from('audit_logs').insert({
    org_id: orgId,
    actor_user_id: user.id,
    action: 'integration.line.disconnected',
    target_kind: 'integration',
    metadata: {},
  });

  revalidatePath('/admin/integrations');
  return { ok: true };
}
