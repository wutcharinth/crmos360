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
  // Rough heuristic: ~4 chars/token for mixed Thai/English. Replace with the
  // model's reported usage when streaming the API is added.
  return Math.ceil(text.length / 4);
}

function buildHistoryMessages(history: ProspectMessage[]) {
  const sliced = history.slice(-MAX_HISTORY_TURNS * 2);
  return sliced.map((m) => ({
    role: m.direction === 'in' ? ('user' as const) : ('assistant' as const),
    content: m.body,
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
