import 'server-only';
import { NextResponse } from 'next/server';
import { verifySignature, getProfile, type LineWebhookEvent } from '@crmos360/line';
import { createAdminClient } from '@/lib/supabase/admin';
import { runAutoReply } from '@/lib/ai/auto-reply';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface IntegrationRow {
  id: string;
  org_id: string;
  config: { channel_secret?: string; channel_access_token?: string; bot_user_id?: string };
  status: string;
}

interface WebhookBody {
  destination: string;
  events: LineWebhookEvent[];
}

async function findIntegrationForDestination(destination: string) {
  const admin = createAdminClient();

  const { data: byBotId } = await admin
    .from('integrations')
    .select('id, org_id, config, status')
    .eq('provider', 'line')
    .eq('status', 'active')
    .eq('config->>bot_user_id', destination)
    .maybeSingle<IntegrationRow>();

  if (byBotId) return byBotId;

  const { data: rows } = await admin
    .from('integrations')
    .select('id, org_id, config, status')
    .eq('provider', 'line')
    .eq('status', 'active');

  return (rows as IntegrationRow[] | null)?.[0] ?? null;
}

async function upsertCustomer(
  orgId: string,
  lineUserId: string,
  channelAccessToken: string | undefined,
) {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('customers')
    .select('id, name, channel_ids')
    .eq('org_id', orgId)
    .eq('channel_ids->>line', lineUserId)
    .maybeSingle();

  if (existing) return existing as { id: string; name: string | null; channel_ids: Record<string, string> };

  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  if (channelAccessToken) {
    try {
      const profile = await getProfile(channelAccessToken, lineUserId);
      displayName = profile.displayName ?? null;
      avatarUrl = profile.pictureUrl ?? null;
    } catch {
      // Profile fetch failure is non-fatal.
    }
  }

  const { data: created, error } = await admin
    .from('customers')
    .insert({
      org_id: orgId,
      name: displayName,
      avatar_url: avatarUrl,
      channel_ids: { line: lineUserId },
    })
    .select('id, name, channel_ids')
    .single();

  if (error) throw error;
  return created as { id: string; name: string | null; channel_ids: Record<string, string> };
}

async function findOrCreateConversation(orgId: string, customerId: string) {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('conversations')
    .select('id, status, auto_reply_enabled')
    .eq('org_id', orgId)
    .eq('customer_id', customerId)
    .in('status', ['open', 'pending'])
    .order('last_message_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing as { id: string; status: string; auto_reply_enabled: boolean };

  const { data: created, error } = await admin
    .from('conversations')
    .insert({
      org_id: orgId,
      customer_id: customerId,
      channel: 'line',
      status: 'open',
    })
    .select('id, status, auto_reply_enabled')
    .single();

  if (error) throw error;
  return created as { id: string; status: string; auto_reply_enabled: boolean };
}

async function insertInboundMessage(args: {
  orgId: string;
  conversationId: string;
  body: string | null;
  raw: unknown;
}) {
  const admin = createAdminClient();
  const { error } = await admin.from('messages').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    direction: 'inbound',
    body: args.body,
    raw: args.raw as Record<string, unknown>,
  });
  if (error) throw error;

  await admin
    .from('conversations')
    .update({
      last_message_at: new Date().toISOString(),
      unread_count: 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', args.conversationId);
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-line-signature') ?? '';

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const integration = await findIntegrationForDestination(body.destination);
  if (!integration) {
    return NextResponse.json({ ok: false, error: 'no_integration' }, { status: 200 });
  }

  const channelSecret = integration.config.channel_secret;
  if (!channelSecret) {
    return NextResponse.json({ ok: false, error: 'integration_misconfigured' }, { status: 200 });
  }

  if (!verifySignature(channelSecret, rawBody, signature)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  for (const event of body.events ?? []) {
    if (event.type !== 'message') continue;
    const sourceUserId = (event.source as { userId?: string }).userId;
    if (!sourceUserId) continue;

    const customer = await upsertCustomer(
      integration.org_id,
      sourceUserId,
      integration.config.channel_access_token,
    );
    const conversation = await findOrCreateConversation(integration.org_id, customer.id);

    const text =
      event.message.type === 'text'
        ? event.message.text
        : `[${event.message.type}]`;

    await insertInboundMessage({
      orgId: integration.org_id,
      conversationId: conversation.id,
      body: text,
      raw: event,
    });

    if (conversation.auto_reply_enabled && integration.config.channel_access_token) {
      runAutoReply({
        orgId: integration.org_id,
        conversationId: conversation.id,
        channelAccessToken: integration.config.channel_access_token,
        replyToken: 'replyToken' in event ? (event as { replyToken?: string }).replyToken : undefined,
        lineUserId: sourceUserId,
      }).catch((err: unknown) => {
        console.error('auto-reply failed', err);
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'line-webhook' });
}
