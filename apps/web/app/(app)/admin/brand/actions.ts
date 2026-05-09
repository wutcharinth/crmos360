'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

const schema = z.object({
  voice: z.enum(['friendly', 'formal', 'casual', 'playful', 'serious']),
  language: z.enum(['th', 'en']),
  formality: z.enum(['polite', 'casual']),
  signature: z.string().max(120).optional().or(z.literal('')),
  forbiddenPhrases: z.string().max(800).optional().or(z.literal('')),
  requiredPhrases: z.string().max(800).optional().or(z.literal('')),
  emojiPolicy: z.enum(['none', 'sparing', 'friendly']),
  customInstructions: z.string().max(1500).optional().or(z.literal('')),
});

export type BrandVoiceState = { ok: boolean; error?: string } | null;

export async function saveBrandVoiceAction(
  _prev: BrandVoiceState,
  formData: FormData,
): Promise<BrandVoiceState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can edit brand voice.' };
  }

  const parsed = schema.safeParse({
    voice: formData.get('voice'),
    language: formData.get('language'),
    formality: formData.get('formality'),
    signature: formData.get('signature') ?? '',
    forbiddenPhrases: formData.get('forbiddenPhrases') ?? '',
    requiredPhrases: formData.get('requiredPhrases') ?? '',
    emojiPolicy: formData.get('emojiPolicy'),
    customInstructions: formData.get('customInstructions') ?? '',
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const splitPhrases = (s: string) =>
    s
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .slice(0, 12);

  const admin = createAdminClient();
  const { error } = await admin.from('brand_voice').upsert({
    org_id: orgId,
    voice: parsed.data.voice,
    language: parsed.data.language,
    formality: parsed.data.formality,
    signature: parsed.data.signature || null,
    forbidden_phrases: splitPhrases(parsed.data.forbiddenPhrases ?? ''),
    required_phrases: splitPhrases(parsed.data.requiredPhrases ?? ''),
    emoji_policy: parsed.data.emojiPolicy,
    custom_instructions: parsed.data.customInstructions || null,
    updated_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'brand_voice.update',
    resourceKind: 'org',
    resourceId: orgId,
    metadata: { voice: parsed.data.voice, language: parsed.data.language },
  });

  revalidatePath('/admin/brand');
  return { ok: true };
}
