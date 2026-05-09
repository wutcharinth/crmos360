import { redirect } from 'next/navigation';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgSettingsForm } from './org-settings-form';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const { data: org } = await admin
    .from('organizations')
    .select('id, name, slug, plan, settings, created_at')
    .eq('id', orgId)
    .maybeSingle();

  if (!org) redirect('/onboarding');

  const settings = (org.settings ?? {}) as {
    default_auto_reply?: boolean;
    reply_tone?: string;
    business_hours?: { tz?: string };
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Workspace settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure how FlowAIOS behaves for your organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Workspace name and slug.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrgSettingsForm
            initial={{
              name: org.name,
              slug: org.slug,
              plan: org.plan,
              defaultAutoReply: settings.default_auto_reply ?? true,
              replyTone: settings.reply_tone ?? 'friendly',
              timezone: settings.business_hours?.tz ?? 'Asia/Bangkok',
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Current plan: <span className="font-medium capitalize">{org.plan}</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Billing &amp; plan upgrades are coming soon.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Destructive actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Workspace deletion is currently manual. Contact support@flowaios.com.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
