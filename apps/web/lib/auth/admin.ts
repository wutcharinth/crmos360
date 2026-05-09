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
 *   1. Email is in ADMIN_EMAILS env allowlist  → global admin (always)
 *   2. Org membership role is 'owner' or 'admin'  → org admin
 *   3. ADMIN_EMAILS is empty AND user has any org membership  → permissive dev
 *   4. Local dev with no Supabase env  → bypass to a synthetic admin context
 *
 * Anything else → 404.
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

  // Permissive dev: when ADMIN_EMAILS is empty, allow any org admin.
  const allowed = isGlobalAdmin || (allowlist.length === 0 ? isOrgAdmin : false);
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
