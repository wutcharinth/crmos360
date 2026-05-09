'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordAction } from '@/lib/audit';

const schema = z.object({
  shortcut: z
    .string()
    .max(20)
    .regex(/^[a-z0-9_-]*$/i, 'lowercase letters, numbers, dashes only')
    .optional()
    .or(z.literal('')),
  title: z.string().min(2).max(120),
  body: z.string().min(2).max(2000),
  language: z.enum(['th', 'en']).default('th'),
  category: z.string().max(40).optional().or(z.literal('')),
});

export type TemplateState = { ok: boolean; error?: string; id?: string } | null;

export async function createTemplateAction(
  _prev: TemplateState,
  formData: FormData,
): Promise<TemplateState> {
  const { orgId, user } = await requireMembership();
  const parsed = schema.safeParse({
    shortcut: formData.get('shortcut') ?? '',
    title: formData.get('title'),
    body: formData.get('body'),
    language: formData.get('language') ?? 'th',
    category: formData.get('category') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('reply_templates')
    .insert({
      org_id: orgId,
      shortcut: parsed.data.shortcut?.toLowerCase() || null,
      title: parsed.data.title,
      body: parsed.data.body,
      language: parsed.data.language,
      category: parsed.data.category || null,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error) return { ok: false, error: error.message };

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'template.create',
    resourceKind: 'template',
    resourceId: data.id,
    metadata: { title: parsed.data.title },
  });

  revalidatePath('/admin/templates');
  return { ok: true, id: data.id };
}

export async function updateTemplateAction(
  templateId: string,
  _prev: TemplateState,
  formData: FormData,
): Promise<TemplateState> {
  const { orgId, user } = await requireMembership();
  const parsed = schema.safeParse({
    shortcut: formData.get('shortcut') ?? '',
    title: formData.get('title'),
    body: formData.get('body'),
    language: formData.get('language') ?? 'th',
    category: formData.get('category') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('reply_templates')
    .update({
      shortcut: parsed.data.shortcut?.toLowerCase() || null,
      title: parsed.data.title,
      body: parsed.data.body,
      language: parsed.data.language,
      category: parsed.data.category || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', templateId)
    .eq('org_id', orgId);

  if (error) return { ok: false, error: error.message };

  await recordAction({
    orgId,
    actorType: 'user',
    actorUserId: user.id,
    action: 'template.update',
    resourceKind: 'template',
    resourceId: templateId,
  });

  revalidatePath('/admin/templates');
  redirect('/admin/templates');
}
