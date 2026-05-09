'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { embed } from '@crmos360/ai';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

const articleSchema = z.object({
  title: z.string().min(2).max(160),
  body: z.string().min(2).max(6000),
  category: z.string().max(60).optional().or(z.literal('')),
});

export type ArticleState = { ok: boolean; error?: string; id?: string } | null;

async function tryEmbed(text: string): Promise<number[] | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    return await embed(text);
  } catch {
    return null;
  }
}

export async function createArticleAction(
  _prev: ArticleState,
  formData: FormData,
): Promise<ArticleState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can create articles.' };
  }

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    category: formData.get('category') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();
  const embedding = await tryEmbed(`${parsed.data.title}\n${parsed.data.body}`);

  const { data, error } = await admin
    .from('knowledge_articles')
    .insert({
      org_id: orgId,
      title: parsed.data.title,
      body: parsed.data.body,
      category: parsed.data.category || null,
      embedding,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error) return { ok: false, error: error.message };

  await admin.from('audit_logs').insert({
    org_id: orgId,
    actor_user_id: user.id,
    action: 'kb.article.created',
    target_kind: 'knowledge_article',
    target_id: data.id,
    metadata: { title: parsed.data.title },
  });

  revalidatePath('/admin/knowledge');
  redirect(`/admin/knowledge/${data.id}`);
}

export async function updateArticleAction(
  id: string,
  _prev: ArticleState,
  formData: FormData,
): Promise<ArticleState> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') {
    return { ok: false, error: 'Only owners or admins can edit articles.' };
  }

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    category: formData.get('category') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const admin = createAdminClient();
  const embedding = await tryEmbed(`${parsed.data.title}\n${parsed.data.body}`);

  const { error } = await admin
    .from('knowledge_articles')
    .update({
      title: parsed.data.title,
      body: parsed.data.body,
      category: parsed.data.category || null,
      embedding,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) return { ok: false, error: error.message };

  await admin.from('audit_logs').insert({
    org_id: orgId,
    actor_user_id: user.id,
    action: 'kb.article.updated',
    target_kind: 'knowledge_article',
    target_id: id,
    metadata: { title: parsed.data.title },
  });

  revalidatePath('/admin/knowledge');
  revalidatePath(`/admin/knowledge/${id}`);
  return { ok: true, id };
}

export async function archiveArticleAction(id: string): Promise<void> {
  const { orgId, role, user } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') return;

  const admin = createAdminClient();
  await admin
    .from('knowledge_articles')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId);

  await admin.from('audit_logs').insert({
    org_id: orgId,
    actor_user_id: user.id,
    action: 'kb.article.archived',
    target_kind: 'knowledge_article',
    target_id: id,
  });

  revalidatePath('/admin/knowledge');
  redirect('/admin/knowledge');
}
