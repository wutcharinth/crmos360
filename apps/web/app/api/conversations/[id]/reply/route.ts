import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendPush } from '@crmos360/line';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({ body: z.string().min(1).max(4000) });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { orgId, user } = await requireMembership();

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: convo } = await admin
    .from('conversations')
    .select('id, org_id, customer_id, channel, customers!inner(channel_ids)')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!convo) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const customerChannelIds = (convo.customers as unknown as { channel_ids: Record<string, string> })
    .channel_ids ?? {};

  const { data: integration } = await admin
    .from('integrations')
    .select('config, status')
    .eq('org_id', orgId)
    .eq('provider', convo.channel)
    .maybeSingle();

  const accessToken = (integration?.config as { channel_access_token?: string } | null)
    ?.channel_access_token;
  const lineUserId = customerChannelIds[convo.channel];

  let sendError: string | null = null;
  if (convo.channel === 'line') {
    if (!accessToken || !lineUserId) {
      sendError = 'integration_not_configured';
    } else {
      try {
        await sendPush(accessToken, lineUserId, parsed.data.body);
      } catch (err) {
        sendError = err instanceof Error ? err.message : 'send_failed';
      }
    }
  } else {
    sendError = 'channel_not_supported';
  }

  const { data: inserted, error } = await admin
    .from('messages')
    .insert({
      org_id: orgId,
      conversation_id: convo.id,
      direction: 'outbound',
      body: parsed.data.body,
      sender_user_id: user.id,
      ai_generated: false,
    })
    .select('id, sent_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await admin
    .from('conversations')
    .update({
      last_message_at: new Date().toISOString(),
      unread_count: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', convo.id);

  if (sendError) {
    return NextResponse.json(
      { ok: true, persisted: inserted.id, warning: `delivery_${sendError}` },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true, id: inserted.id });
}
