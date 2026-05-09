import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth/current-user';
import { recordAction } from '@/lib/audit';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const SkinSchema = z.enum(['daylight', 'cockpit', 'system']);
const DensitySchema = z.enum(['comfortable', 'compact']);
const LanguageSchema = z.enum(['th', 'en']);

const PatchSchema = z.object({
  skin: SkinSchema.optional(),
  density: DensitySchema.optional(),
  language: LanguageSchema.optional(),
});

interface PrefsResponse {
  skin: string;
  density: string;
  language: string;
  source: 'user' | 'org_default' | 'fallback';
}

const FALLBACK: PrefsResponse = {
  skin: 'daylight',
  density: 'comfortable',
  language: 'th',
  source: 'fallback',
};

/**
 * Look up the user's first org membership, if any. We don't redirect like
 * `requireMembership()` does — marketing visitors and unattached users
 * may still set prefs.
 */
async function getOrgIdForUser(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('org_members')
    .select('org_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data?.org_id as string | undefined) ?? null;
}

export async function GET() {
  const { user } = await requireUser();
  const admin = createAdminClient();

  const { data: pref } = await admin
    .from('user_prefs')
    .select('skin, density, language')
    .eq('user_id', user.id)
    .maybeSingle();

  if (pref) {
    return NextResponse.json({
      skin: pref.skin,
      density: pref.density,
      language: pref.language,
      source: 'user',
    } satisfies PrefsResponse);
  }

  // No row yet — fall through to org default skin if the user has a
  // membership; otherwise fallback values (cookie wins on the client).
  const orgId = await getOrgIdForUser(user.id);
  if (orgId) {
    const { data: org } = await admin
      .from('organizations')
      .select('default_skin')
      .eq('id', orgId)
      .maybeSingle();
    if (org?.default_skin) {
      return NextResponse.json({
        skin: org.default_skin as string,
        density: FALLBACK.density,
        language: FALLBACK.language,
        source: 'org_default',
      } satisfies PrefsResponse);
    }
  }

  return NextResponse.json(FALLBACK);
}

export async function PATCH(req: Request) {
  const { user } = await requireUser();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'invalid input' },
      { status: 400 },
    );
  }
  const patch = parsed.data;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'empty patch' }, { status: 400 });
  }

  const admin = createAdminClient();
  const upsert: Record<string, unknown> = {
    user_id: user.id,
    updated_at: new Date().toISOString(),
  };
  if (patch.skin !== undefined) upsert.skin = patch.skin;
  if (patch.density !== undefined) upsert.density = patch.density;
  if (patch.language !== undefined) upsert.language = patch.language;

  const { data, error } = await admin
    .from('user_prefs')
    .upsert(upsert, { onConflict: 'user_id' })
    .select('skin, density, language')
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'upsert failed' },
      { status: 500 },
    );
  }

  // Audit only if the user belongs to an org. Concierge / marketing
  // visitors flipping prefs have no org to attribute to.
  const orgId = await getOrgIdForUser(user.id);
  if (orgId) {
    await recordAction({
      orgId,
      actorType: 'user',
      actorUserId: user.id,
      action: 'user.prefs.update',
      resourceKind: 'user_prefs',
      resourceId: user.id,
      metadata: patch,
    });
  }

  return NextResponse.json({
    skin: data.skin,
    density: data.density,
    language: data.language,
    source: 'user',
  } satisfies PrefsResponse);
}
