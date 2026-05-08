'use server';

import { createOrgSchema } from '@crmos360/shared';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type Result = { ok: true; orgId: string } | { ok: false; error: string };

export async function createOrgAction(input: { name: string; slug: string }): Promise<Result> {
  const parsed = createOrgSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not authenticated' };

  // Ensure user_profile row exists (idempotent).
  const admin = createAdminClient();
  await admin.from('user_profiles').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    },
    { onConflict: 'id' },
  );

  // Slug uniqueness pre-check (race-safe via DB unique index too).
  const { data: existing } = await admin
    .from('organizations')
    .select('id')
    .eq('slug', parsed.data.slug)
    .maybeSingle();
  if (existing) return { ok: false, error: 'That workspace URL is taken' };

  // Create org and add creator as owner atomically (best-effort; org_members
  // insert is service-role so RLS chicken-and-egg is bypassed).
  const { data: org, error: orgErr } = await admin
    .from('organizations')
    .insert({ name: parsed.data.name, slug: parsed.data.slug })
    .select('id')
    .single();
  if (orgErr || !org) return { ok: false, error: orgErr?.message ?? 'Failed to create workspace' };

  const { error: memberErr } = await admin.from('org_members').insert({
    org_id: org.id,
    user_id: user.id,
    role: 'owner',
  });
  if (memberErr) {
    await admin.from('organizations').delete().eq('id', org.id);
    return { ok: false, error: memberErr.message };
  }

  return { ok: true, orgId: org.id };
}
