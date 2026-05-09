import { NextResponse } from 'next/server';
import { generate } from '@crmos360/ai';
import { requireMembership } from '@/lib/auth/current-user';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUGGEST_PROMPT = `You are FlowAIOS — propose ONE reply for the agent to review.
Reply in the same language the customer used (default Thai).
Be helpful, concise, friendly. If you would escalate or you're unsure, briefly say what info is missing.
Output the reply text only, no preface.`;

const HISTORY_LIMIT = 12;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { orgId } = await requireMembership();

  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'no_ai_provider', message: 'No AI provider key configured' },
      { status: 503 },
    );
  }

  const admin = createAdminClient();

  const { data: convo } = await admin
    .from('conversations')
    .select('id')
    .eq('id', id)
    .eq('org_id', orgId)
    .maybeSingle();

  if (!convo) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const { data: rows } = await admin
    .from('messages')
    .select('direction, body, sent_at')
    .eq('conversation_id', id)
    .order('sent_at', { ascending: true })
    .limit(HISTORY_LIMIT);

  const history = (rows ?? [])
    .filter((m): m is { direction: string; body: string; sent_at: string } => Boolean(m.body))
    .map((m) => ({
      role: (m.direction === 'inbound' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.body,
    }));

  if (history.length === 0) {
    return NextResponse.json({ error: 'no_history' }, { status: 400 });
  }

  const start = Date.now();
  let res;
  try {
    res = await generate({
      messages: [{ role: 'system', content: SUGGEST_PROMPT }, ...history],
      temperature: 0.5,
      maxTokens: 400,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'llm_failed', message: err instanceof Error ? err.message : 'unknown' },
      { status: 502 },
    );
  }

  await admin.from('ai_logs').insert({
    org_id: orgId,
    conversation_id: id,
    kind: 'reply_suggest',
    model: res.model,
    response: { text: res.text },
    accepted: false,
    latency_ms: Date.now() - start,
  });

  return NextResponse.json({ text: res.text.trim(), model: res.model });
}
