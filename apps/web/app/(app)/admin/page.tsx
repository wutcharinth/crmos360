import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const [
    { count: members },
    { count: invites },
    { data: integration },
    { count: aiLogs7d },
  ] = await Promise.all([
    admin
      .from('org_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('org_id', orgId),
    admin
      .from('org_invites')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .is('accepted_at', null),
    admin
      .from('integrations')
      .select('provider, status')
      .eq('org_id', orgId)
      .eq('provider', 'line')
      .maybeSingle(),
    admin
      .from('ai_logs')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString()),
  ]);

  const tiles: {
    href: string;
    title: string;
    description: string;
    metric?: string;
  }[] = [
    {
      href: '/admin/team',
      title: 'Team',
      description: 'Members, roles, invites',
      metric: `${members ?? 0} member${members === 1 ? '' : 's'}${invites ? ` · ${invites} pending` : ''}`,
    },
    {
      href: '/admin/integrations',
      title: 'Integrations',
      description: 'LINE, Messenger, Instagram',
      metric: integration?.status === 'active' ? 'LINE connected' : 'No channels',
    },
    {
      href: '/admin/audit',
      title: 'Audit log',
      description: 'Track admin and AI actions',
      metric: `${aiLogs7d ?? 0} AI events / 7d`,
    },
    {
      href: '/admin/settings',
      title: 'Settings',
      description: 'Workspace preferences',
    },
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card className="h-full transition-colors hover:border-warm/40 hover:bg-warm-soft/30">
              <CardHeader>
                <CardTitle className="text-base">{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              {t.metric && (
                <CardContent>
                  <p className="font-mono text-sm text-warm">{t.metric}</p>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
