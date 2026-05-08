import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineForm } from './line-form';
import { disconnectLineAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function IntegrationsPage() {
  const { orgId, role } = await requireMembership();
  if (role !== 'owner' && role !== 'admin') redirect('/inbox');

  const admin = createAdminClient();
  const { data: row } = await admin
    .from('integrations')
    .select('config, status, updated_at')
    .eq('org_id', orgId)
    .eq('provider', 'line')
    .maybeSingle();

  const hdrs = await headers();
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? 'flowaios.vercel.app';
  const protocol = hdrs.get('x-forwarded-proto') ?? 'https';
  const webhookUrl = `${protocol}://${host}/api/line/webhook`;

  const config = (row?.config ?? {}) as {
    channel_secret?: string;
    channel_access_token?: string;
    bot_user_id?: string;
  };
  const connected = Boolean(row && config.channel_secret && config.channel_access_token);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect channels so messages flow into FlowAIOS inbox.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            LINE OA
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                connected
                  ? 'bg-mint-soft text-mint'
                  : 'bg-paper-2 text-muted-foreground'
              }`}
            >
              {connected ? 'Connected' : 'Not connected'}
            </span>
          </CardTitle>
          <CardDescription>
            Receive and reply to LINE Official Account messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <p className="mb-2 font-medium">Webhook URL</p>
            <code className="block break-all rounded bg-background px-2 py-1.5 font-mono text-xs">
              {webhookUrl}
            </code>
            <p className="mt-2 text-xs text-muted-foreground">
              Paste this into LINE Developers → Channel → Messaging API → Webhook URL.
              Enable &quot;Use webhook&quot;.
            </p>
          </div>

          <LineForm
            initial={{
              botUserId: config.bot_user_id,
              hasSecret: Boolean(config.channel_secret),
              hasToken: Boolean(config.channel_access_token),
            }}
          />

          {connected && (
            <form
              action={async () => {
                'use server';
                await disconnectLineAction();
              }}
            >
              <Button type="submit" variant="outline">
                Disconnect LINE
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>Other channels on the roadmap.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>· Facebook Messenger</li>
            <li>· Instagram DM</li>
            <li>· TikTok Shop</li>
            <li>· Shopee Chat</li>
            <li>· Lazada Chat</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
