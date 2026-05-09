import 'server-only';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/server';

/**
 * Feature-flag system for the M1.5 staged rollout.
 *
 * Resolution order (first hit wins):
 *   1. Local dev with no Supabase env → enabled (DEV_BYPASS).
 *   2. Per-org row in `org_feature_flags` with enabled = true/false.
 *   3. Global env default `M15_ENABLED_DEFAULT` (true|false). Default true
 *      so the Vercel preview branch shows the M1.5 prototype out-of-box.
 *
 * Routes call `assertM15()` at the top of their server component and the
 * helper notFound()s the request when the flag is off — matching the
 * hidden-by-404 pattern used by `requireAdmin()`.
 */

export const FLAG_M15 = 'm15' as const;
export type FlagKey = typeof FLAG_M15;

const DEV_BYPASS = process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL;

function envDefault(key: FlagKey): boolean {
  if (key === FLAG_M15) {
    const v = (process.env.M15_ENABLED_DEFAULT ?? 'true').toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
  }
  return false;
}

export async function isFlagEnabled(orgId: string | null, key: FlagKey): Promise<boolean> {
  if (DEV_BYPASS) return true;
  if (!orgId) return envDefault(key);
  if (!isSupabaseConfigured()) return envDefault(key);

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('org_feature_flags')
      .select('enabled')
      .eq('org_id', orgId)
      .eq('flag_key', key)
      .maybeSingle();
    if (data && typeof data.enabled === 'boolean') return data.enabled;
  } catch (err) {
    console.warn(`[flags] lookup failed for ${key}/${orgId}`, err);
  }
  return envDefault(key);
}

/**
 * Server-component / route-handler helper. Calls notFound() when the
 * flag is off; returns silently when on. Loads org from
 * requireMembership(), so callers must already be inside an authed surface.
 */
export async function assertM15(): Promise<void> {
  if (DEV_BYPASS) return;
  // Defer the import to keep this file safely callable from routes that
  // haven't passed auth yet (the import has its own auth lookup that
  // would 404 first if the user isn't signed in — which is the
  // behavior we want).
  const { requireMembership } = await import('@/lib/auth/current-user');
  const { orgId } = await requireMembership();
  const enabled = await isFlagEnabled(orgId, FLAG_M15);
  if (!enabled) notFound();
}

/** Toggle a flag for an org. Caller must have already verified admin. */
export async function setFlag(opts: {
  orgId: string;
  key: FlagKey;
  enabled: boolean;
  userId: string;
}): Promise<void> {
  const admin = createAdminClient();
  await admin.from('org_feature_flags').upsert(
    {
      org_id: opts.orgId,
      flag_key: opts.key,
      enabled: opts.enabled,
      enabled_by_user_id: opts.userId,
      enabled_at: new Date().toISOString(),
    },
    { onConflict: 'org_id,flag_key' },
  );
}

/** Bulk-fetch flag state for an org. Used by the admin flags UI. */
export async function listFlagsForOrg(orgId: string): Promise<Record<FlagKey, boolean>> {
  if (DEV_BYPASS) return { [FLAG_M15]: true };
  return {
    [FLAG_M15]: await isFlagEnabled(orgId, FLAG_M15),
  };
}
