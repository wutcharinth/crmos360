import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { user, supabase };
}

export interface ActiveMembership {
  orgId: string;
  role: 'owner' | 'admin' | 'agent';
  orgName: string;
  orgSlug: string;
}

export async function requireMembership(): Promise<ActiveMembership & {
  user: Awaited<ReturnType<typeof requireUser>>['user'];
}> {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from('org_members')
    .select('org_id, role, organizations:organizations!inner(id, name, slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) redirect('/onboarding');

  // The select uses an inner-join alias; data.organizations is an object,
  // but Supabase's untyped client infers it as an array. Cast through unknown.
  const org = (data.organizations ?? {}) as unknown as { id: string; name: string; slug: string };

  return {
    user,
    orgId: data.org_id,
    role: data.role as ActiveMembership['role'],
    orgName: org.name,
    orgSlug: org.slug,
  };
}
