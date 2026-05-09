import { generate } from '@crmos360/ai';
import {
  appendMessage,
  computeCostMicros,
  listMessages,
  recordUsage,
  updateThread,
  upsertThread,
  type ProspectMessage,
  type ProspectThread,
  type Vertical,
} from './store';
import { buildSystemPrompt, detectHandoffRequest, detectJailbreak } from './prompt';

export interface ConciergeReplyInput {
  sessionId: string;
  message: string;
  vertical?: Vertical | null;
  utmSource?: string | null;
  userAgent?: string | null;
}

export interface ConciergeReplyResult {
  threadId: string;
  reply: string;
  flagged: 'jailbreak' | null;
  status: ProspectThread['status'];
  handoffRequested: boolean;
  tokensInput: number;
  tokensOutput: number;
  costMicros: number;
}

const MAX_HISTORY_TURNS = Number(process.env.CONCIERGE_MAX_TURNS ?? 20);
const MODEL = process.env.CONCIERGE_MODEL ?? 'gemini-2.5-flash';

function approxTokens(text: string): number {
  // Heuristic split: Thai code points (U+0E00-U+0E7F) tokenize at roughly
  // 2.5 chars/token (per Gemini observations); Latin + numerics at ~4
  // chars/token. The previous flat /4 estimate undercounted Thai-heavy
  // payloads by ~30%.
  if (!text) return 0;
  let thai = 0;
  let other = 0;
  for (let i = 0; i < text.length; i++) {
    const cp = text.charCodeAt(i);
    if (cp >= 0x0e00 && cp <= 0x0e7f) thai += 1;
    else other += 1;
  }
  return Math.ceil(thai / 2.5 + other / 4);
}

function buildHistoryMessages(history: ProspectMessage[]) {
  const sliced = history.slice(-MAX_HISTORY_TURNS * 2);
  return sliced.map((m) => ({
    role: m.direction === 'in' ? ('user' as const) : ('assistant' as const),
    // Wrap visitor input in a clear data-not-instruction tag to harden against
    // prompt injection. The system prompt acknowledges this convention.
    content:
      m.direction === 'in'
        ? `<visitor_message>\n${m.body}\n</visitor_message>`
        : m.body,
  }));
}

export async function respond(input: ConciergeReplyInput): Promise<ConciergeReplyResult> {
  const thread = upsertThread({
    sessionId: input.sessionId,
    vertical: input.vertical ?? null,
    utmSource: input.utmSource ?? null,
    userAgent: input.userAgent ?? null,
  });

  const flagged = detectJailbreak(input.message) ? 'jailbreak' : null;
  const isHandoffRequest = detectHandoffRequest(input.message);

  // Persist the inbound message immediately so the admin /prospects page
  // surfaces an in-progress thread even if the model call fails.
  appendMessage({
    threadId: thread.id,
    direction: 'in',
    body: input.message,
    flagged,
  });

  // Flip status to handed_off when the prospect asks for human contact.
  if (isHandoffRequest && thread.status === 'open') {
    updateThread(thread.id, { status: 'handed_off' });
  }

  const history = listMessages(thread.id);
  const systemPrompt = buildSystemPrompt({ vertical: thread.vertical });

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...buildHistoryMessages(history),
  ];

  let replyText: string;
  try {
    const result = await generate({
      messages,
      provider: 'gemini',
      model: MODEL,
      temperature: 0.4,
      maxTokens: 600,
    });
    replyText = result.text;
  } catch (err) {
    const fallback =
      input.message.match(/[ก-๙]/)
        ? 'ขออภัยค่ะ ดิฉันล่มไปครู่หนึ่ง ลองพิมพ์อีกครั้งได้ไหมคะ'
        : 'I had a hiccup connecting just now. Could you try that again in a moment?';
    appendMessage({
      threadId: thread.id,
      direction: 'out',
      body: fallback,
      aiGenerated: false,
    });
    throw err;
  }

  const tokensInput = approxTokens(systemPrompt + history.map((m) => m.body).join('\n'));
  const tokensOutput = approxTokens(replyText);
  const costMicros = computeCostMicros(tokensInput, tokensOutput);

  appendMessage({
    threadId: thread.id,
    direction: 'out',
    body: replyText,
    aiGenerated: true,
    tokensInput,
    tokensOutput,
    costMicros,
  });

  recordUsage({
    feature: 'concierge',
    model: MODEL,
    tokensInput,
    tokensOutput,
    costMicros,
    refType: 'prospect_thread',
    refId: thread.id,
  });

  // Re-read the thread to pick up the handoff flip.
  const finalThread = upsertThread({ sessionId: input.sessionId });

  return {
    threadId: thread.id,
    reply: replyText,
    flagged,
    status: finalThread.status,
    handoffRequested: isHandoffRequest,
    tokensInput,
    tokensOutput,
    costMicros,
  };
}
