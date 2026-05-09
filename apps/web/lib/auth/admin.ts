import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ActiveMembership } from '@/lib/auth/current-user';

export interface AdminContext {
  email: string;
  isGlobalAdmin: boolean; // env-allowlist match
  isOrgAdmin: boolean; // role === 'owner' | 'admin'
  membership: ActiveMembership | null; // null when running without Supabase (dev)
}

const DEV_BYPASS = process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL;

function adminEmailList(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return [];
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Match JongToh's hidden-by-404 pattern: non-admins get a generic Not Found,
 * not a 403, so the URL surface is unenumerable.
 *
 * Admin grant rules:
 *   1. Local dev with no Supabase env  → synthetic admin context (DEV_BYPASS)
 *   2. ADMIN_EMAILS env allowlist match  → global admin
 *   3. ADMIN_DEV_PERMISSIVE=1 (dev only) AND any org admin role  → granted
 *   4. Anything else → 404
 *
 * In production, ADMIN_EMAILS MUST be non-empty. An empty allowlist returns
 * 404 for every caller — fail closed, not permissive. This prevents
 * cross-tenant data exposure on the FlowAIOS admin pages (which surface
 * marketing-site visitors' transcripts, costs, jailbreak attempts).
 */
export async function requireAdmin(): Promise<AdminContext> {
  if (DEV_BYPASS) {
    return {
      email: 'dev@local',
      isGlobalAdmin: true,
      isOrgAdmin: true,
      membership: null,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const email = user.email?.toLowerCase() ?? '';
  const allowlist = adminEmailList();
  const isGlobalAdmin = allowlist.length > 0 && allowlist.includes(email);

  const { data: memberRow } = await supabase
    .from('org_members')
    .select('org_id, role, organizations:organizations!inner(id, name, slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const role = memberRow?.role as 'owner' | 'admin' | 'agent' | undefined;
  const isOrgAdmin = role === 'owner' || role === 'admin';

  // Hard-fail in prod when allowlist is empty. Permissive-org-admin is
  // dev-only and gated by an explicit env flag.
  const isProd = process.env.NODE_ENV === 'production';
  const permissiveDev =
    !isProd && process.env.ADMIN_DEV_PERMISSIVE === '1' && isOrgAdmin;

  const allowed = isGlobalAdmin || permissiveDev;
  if (!allowed) notFound();

  const org = (memberRow?.organizations ?? {}) as unknown as {
    id: string;
    name: string;
    slug: string;
  };

  return {
    email,
    isGlobalAdmin,
    isOrgAdmin,
    membership: memberRow
      ? {
          orgId: memberRow.org_id as string,
          role: role ?? 'agent',
          orgName: org.name ?? '',
          orgSlug: org.slug ?? '',
        }
      : null,
  };
}
