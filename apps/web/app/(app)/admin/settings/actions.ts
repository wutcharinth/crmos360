'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

const orgSettingsSchema = z.object({
  name: z.string().min(2).max(60),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers, dashes only'),
  defaultAutoReply: z.boolean(),
  replyTone: z.enum(['friendly', 'formal', 'casual']),
  timezone: z.string().min(2),
});

export type OrgSettingsState = { ok: boolean; error?: string } | null;

export async function saveOrgSettingsAction(
  _prev: OrgSettingsState,
  formData: FormData,
): Promise<OrgSettingsState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can edit settings.' };
  }

  const parsed = orgSettingsSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    defaultAutoReply: formData.get('defaultAutoReply') === 'on',
    replyTone: formData.get('replyTone'),
    timezone: formData.get('timezone'),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from('organizations')
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      settings: {
        default_auto_reply: parsed.data.defaultAutoReply,
        reply_tone: parsed.data.replyTone,
        business_hours: { tz: parsed.data.timezone },
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', orgId);

  if (error) return { ok: false, error: error.message };

  await admin.from('audit_logs').insert({
    org_id: orgId,
    actor_user_id: user.id,
    action: 'org.settings.updated',
    target_kind: 'organization',
    target_id: orgId,
    metadata: parsed.data,
  });

  revalidatePath('/admin/settings');
  return { ok: true };
}
