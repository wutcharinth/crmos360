import 'server-only';
import { generate, embed } from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';

const EXTRACTION_PROMPT = `You are an information extraction model. From the customer's recent messages,
extract durable facts that would help personalize future replies (preferences, past complaints, tone, language, location).
Return a JSON array, max 5 items: [{"kind":"fact|preference|complaint|tone","content":"<short phrase>"}].
If nothing useful, return [].`;

interface ExtractArgs {
  orgId: string;
  conversationId: string;
}

const RECENT_MESSAGE_LIMIT = 8;

export async function extractAndStoreMemory(args: ExtractArgs): Promise<number> {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) return 0;

  const admin = createAdminClient();

  const { data: convo } = await admin
    .from('conversations')
    .select('customer_id')
    .eq('id', args.conversationId)
    .maybeSingle();

  if (!convo?.customer_id) return 0;
  const customerId = convo.customer_id as string;

  const { data: rows } = await admin
    .from('messages')
    .select('direction, body, sent_at')
    .eq('conversation_id', args.conversationId)
    .order('sent_at', { ascending: false })
    .limit(RECENT_MESSAGE_LIMIT);

  const inbound = (rows ?? []).filter(
    (m): m is { direction: string; body: string; sent_at: string } =>
      m.direction === 'inbound' && Boolean(m.body),
  );
  if (inbound.length === 0) return 0;

  const transcript = inbound
    .reverse()
    .map((m) => `Customer: ${m.body}`)
    .join('\n');

  let parsed: { kind: string; content: string }[] = [];
  try {
    const res = await generate({
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: transcript },
      ],
      temperature: 0.1,
      maxTokens: 400,
    });
    const text = res.text.trim();
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1) return 0;
    const json = text.slice(start, end + 1);
    const arr = JSON.parse(json) as unknown;
    if (!Array.isArray(arr)) return 0;
    parsed = arr.filter(
      (it): it is { kind: string; content: string } =>
        typeof it === 'object' &&
        it !== null &&
        typeof (it as { kind?: unknown }).kind === 'string' &&
        typeof (it as { content?: unknown }).content === 'string',
    );
  } catch (err) {
    console.error('memory extraction LLM failed', err);
    return 0;
  }

  if (parsed.length === 0) return 0;

  let inserted = 0;
  for (const item of parsed.slice(0, 5)) {
    let embedding: number[] | null = null;
    try {
      embedding = await embed(item.content);
    } catch (err) {
      console.warn('embed failed for memory item', err);
    }

    const { error } = await admin.from('customer_memory').insert({
      org_id: args.orgId,
      customer_id: customerId,
      kind: item.kind.slice(0, 30),
      content: item.content.slice(0, 500),
      embedding,
      source_conversation_id: args.conversationId,
    });
    if (!error) inserted += 1;
  }

  await admin.from('ai_logs').insert({
    org_id: args.orgId,
    conversation_id: args.conversationId,
    kind: 'memory_extract',
    response: { count: inserted, items: parsed },
    accepted: inserted > 0,
  });

  return inserted;
}
