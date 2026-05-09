import 'server-only';
import { generate, type LlmMessage } from '@crmos360/ai';
import { sendPush, sendReply } from '@crmos360/line';
import { createAdminClient } from '@/lib/supabase/admin';
import { extractAndStoreMemory } from './memory';
import { applyRules } from './advisor';

const SYSTEM_PROMPT = `You are FlowAIOS, an AI customer service agent for a Thai e-commerce business.
Reply in the same language the customer used (default: Thai).
Be concise, friendly, and accurate. If you don't know an answer, say so politely and offer to escalate.
Keep replies under 280 characters when possible.`;

interface RunAutoReplyArgs {
  orgId: string;
  conversationId: string;
  channelAccessToken: string;
  replyToken?: string;
  lineUserId: string;
}

const HISTORY_LIMIT = 12;

export async function runAutoReply(args: RunAutoReplyArgs): Promise<void> {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.warn('runAutoReply skipped: no AI provider key configured');
    return;
  }

  const admin = createAdminClient();

  const { data: rows } = await admin
    .from('messages')
    .select('direction, body, sent_at')
    .eq('conversation_id', args.conversationId)
    .order('sent_at', { ascending: true })
    .limit(HISTORY_LIMIT);

  const history: LlmMessage[] = (rows ?? [])
    .filter((m): m is { direction: string; body: string; sent_at: string } => Boolean(m.body))
    .map((m) => ({
      role: m.direction === 'inbound' ? 'user' : 'assistant',
      content: m.body,
    }));

  if (history.length === 0) return;

  const start = Date.now();
  let replyText: string;
  let model = 'unknown';

  // Configuration Advisor: check if any approved rule matches the latest
  // inbound. A matching rule short-circuits Gemini entirely. The rule's
  // applied_count is bumped by applyRules() itself.
  const lastInbound = [...history].reverse().find((m) => m.role === 'user');
  const matched = lastInbound
    ? await applyRules({ orgId: args.orgId, body: lastInbound.content }).catch(() => null)
    : null;

  if (matched && matched.actionKind === 'auto_reply') {
    const template = (matched.actionPayload.template as string) ?? '';
    if (template) {
      replyText = template;
      model = `advisor-rule:${matched.ruleId}`;
    } else {
      replyText = '';
    }
  } else {
    try {
      const res = await generate({
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        temperature: 0.4,
        maxTokens: 400,
      });
      replyText = res.text.trim();
      model = res.model;
    } catch (err) {
      console.error('LLM generate failed', err);
      return;
    }
  }

  if (!replyText) return;

  try {
    if (args.replyToken) {
      await sendReply(args.channelAccessToken, args.replyToken, replyText);
    } else {
      await sendPush(args.channelAccessToken, args.lineUserId, replyText);
    }
  } catch (err) {
    console.error('LINE send failed', err);
    return;
  }

  await admin.from('messages').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    direction: 'outbound',
    body: replyText,
    ai_generated: true,
  });

  await admin
    .from('conversations')
    .update({ last_message_at: new Date().toISOString(), unread_count: 0 })
    .eq('id', args.conversationId);

  await admin.from('ai_logs').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    kind: 'reply_suggest',
    model,
    response: { text: replyText },
    accepted: true,
    latency_ms: Date.now() - start,
  });

  extractAndStoreMemory({
    orgId: args.orgId,
    conversationId: args.conversationId,
  }).catch((err: unknown) => {
    console.error('memory extraction failed', err);
  });
}
