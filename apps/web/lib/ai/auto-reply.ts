import 'server-only';
import { sendPush, sendReply } from '@crmos360/line';
import { createAdminClient } from '@/lib/supabase/admin';
import { extractAndStoreMemory } from './memory';
import { applyRules } from './advisor';
import { retrieveKnowledge } from './knowledge';
import { recallForContext } from './memory-engine';
import { harnessGenerate, gateConfidence, quickSentimentSignals, newTraceId } from './harness';
import { buildAutoReplyContext, lastInboundQuery, type BrandVoiceLite } from './context';

const SYSTEM_PROMPT = `You are FlowAIOS, an AI customer service agent for a Thai e-commerce business.
Reply in the same language the customer used (default: Thai). Be concise, friendly, and accurate.
Keep replies under 280 characters when possible. If a question needs a human (refunds outside policy,
escalations, account-specific changes you cannot verify), say so politely and offer to flag a teammate.`;

interface RunAutoReplyArgs {
  orgId: string;
  conversationId: string;
  channelAccessToken: string;
  replyToken?: string;
  lineUserId: string;
}

const HISTORY_LIMIT = 24;

export async function runAutoReply(args: RunAutoReplyArgs): Promise<void> {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.warn('runAutoReply skipped: no AI provider key configured');
    return;
  }

  const traceId = newTraceId();
  const admin = createAdminClient();
  const start = Date.now();

  // Load conversation + customer + brand voice in one shot.
  const { data: convo } = await admin
    .from('conversations')
    .select(
      `id, customer_id,
       customers!inner(id, name),
       organizations!inner(id, brand_voice:brand_voice(*))`,
    )
    .eq('id', args.conversationId)
    .eq('org_id', args.orgId)
    .maybeSingle();

  const customer = convo?.customers as unknown as { id: string; name: string | null } | null;
  if (!customer) return;

  const orgWithVoice = convo?.organizations as unknown as {
    brand_voice: BrandVoiceLite[] | BrandVoiceLite | null;
  } | null;
  const rawVoice = orgWithVoice?.brand_voice;
  const brandVoice = (Array.isArray(rawVoice) ? rawVoice[0] : rawVoice) ?? null;

  const { data: rows } = await admin
    .from('messages')
    .select('direction, body, sent_at')
    .eq('conversation_id', args.conversationId)
    .order('sent_at', { ascending: true })
    .limit(HISTORY_LIMIT);

  const history = (rows ?? [])
    .filter((m): m is { direction: string; body: string; sent_at: string } => Boolean(m.body))
    .map((m) => ({
      role: (m.direction === 'inbound' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.body,
    }));

  if (history.length === 0) return;

  const inbound = lastInboundQuery(history);

  // 1. Advisor short-circuit. Approved rules bypass the model.
  const matched = inbound
    ? await applyRules({ orgId: args.orgId, body: inbound }).catch(() => null)
    : null;

  let replyText = '';
  let model = 'unknown';
  let kbHitIds: string[] = [];
  let memoryHitIds: string[] = [];
  let usedSummary = false;
  let confidence = 0.95;
  let providerAttempts: string[] = [];

  if (matched && matched.actionKind === 'auto_reply') {
    const template = (matched.actionPayload.template as string) ?? '';
    if (template) {
      replyText = template;
      model = `advisor-rule:${matched.ruleId}`;
    }
  } else {
    // 2. Retrieve memories (per-customer) + KB (org) in parallel.
    const [memories, kbHits] = await Promise.all([
      recallForContext({
        orgId: args.orgId,
        customerId: customer.id,
        query: inbound,
        limit: 6,
      }),
      retrieveKnowledge(args.orgId, inbound),
    ]);
    memoryHitIds = memories.map((m) => m.id);
    kbHitIds = kbHits.map((h) => h.id);

    // 3. Build the prompt via the context engine (compresses old turns
    //    when the history overflows our budget).
    const built = await buildAutoReplyContext({
      systemPrompt: SYSTEM_PROMPT,
      brandVoice,
      customerName: customer.name,
      memories,
      kbHits,
      history,
    });
    usedSummary = built.usedSummary;

    // 4. Confidence-gated routing. Quick keyword scan now; can later be
    //    upgraded to an LLM sentiment pass without changing the API.
    const signals = quickSentimentSignals(inbound);
    const isFirst = history.filter((h) => h.role === 'assistant').length === 0;
    const tier = gateConfidence({
      confidence: 0.85,
      hasNegativeSentiment: signals.hasNegativeSentiment,
      hasLegalKeyword: signals.hasLegalKeyword,
      isFirstContact: isFirst,
    });

    if (tier === 'escalate') {
      // Don't auto-reply; signal to humans.
      await admin.from('ai_logs').insert({
        org_id: args.orgId,
        conversation_id: args.conversationId,
        kind: 'escalate_check',
        model: 'gate',
        response: {
          tier,
          trace_id: traceId,
          reason: signals.hasLegalKeyword ? 'legal_keyword' : 'negative_sentiment',
        },
        accepted: false,
        latency_ms: Date.now() - start,
      });
      await admin
        .from('conversations')
        .update({
          status: 'pending',
          unread_count: 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', args.conversationId);
      return;
    }

    // 5. Generate. Harness handles Gemini → Claude fallback.
    try {
      const res = await harnessGenerate({
        messages: built.messages,
        temperature: 0.4,
        maxTokens: 600,
        traceId,
      });
      replyText = res.text.trim();
      model = res.model;
      providerAttempts = res.attemptedProviders;
      confidence = res.safetyBlocked ? 0.4 : 0.85;
    } catch (err) {
      console.error('harness generate failed', err);
      return;
    }
  }

  if (!replyText) return;

  // 6. Send via LINE.
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

  // 7. Persist outbound message + log + bump conversation.
  await admin.from('messages').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    direction: 'outbound',
    body: replyText,
    ai_generated: true,
  });

  await admin
    .from('conversations')
    .update({
      last_message_at: new Date().toISOString(),
      unread_count: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', args.conversationId);

  await admin.from('ai_logs').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    kind: 'reply_suggest',
    model,
    response: {
      text: replyText,
      trace_id: traceId,
      kb_hits: kbHitIds,
      memory_hits: memoryHitIds,
      advisor_rule_id: matched?.ruleId ?? null,
      provider_attempts: providerAttempts,
      used_summary: usedSummary,
      confidence,
    },
    accepted: true,
    latency_ms: Date.now() - start,
  });

  // 8. Memory write — async, won't block the reply path.
  extractAndStoreMemory({
    orgId: args.orgId,
    conversationId: args.conversationId,
  }).catch((err: unknown) => {
    console.error('memory extraction failed', err);
  });
}
