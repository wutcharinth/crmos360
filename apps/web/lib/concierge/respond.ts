import { generateDetailed } from '@crmos360/ai';
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
  const thread = await upsertThread({
    sessionId: input.sessionId,
    vertical: input.vertical ?? null,
    utmSource: input.utmSource ?? null,
    userAgent: input.userAgent ?? null,
  });

  const flagged = detectJailbreak(input.message) ? 'jailbreak' : null;
  const isHandoffRequest = detectHandoffRequest(input.message);

  // Persist the inbound message immediately so the admin /prospects page
  // surfaces an in-progress thread even if the model call fails.
  await appendMessage({
    threadId: thread.id,
    direction: 'in',
    body: input.message,
    flagged,
  });

  // Flip status to handed_off when the prospect asks for human contact.
  if (isHandoffRequest && thread.status === 'open') {
    await updateThread(thread.id, { status: 'handed_off' });
  }

  const history = await listMessages(thread.id);
  const systemPrompt = buildSystemPrompt({ vertical: thread.vertical });

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...buildHistoryMessages(history),
  ];

  let replyText: string;
  try {
    // Generous budget on first attempt; Thai needs more headroom than Latin.
    let res = await generateDetailed({
      messages,
      provider: 'gemini',
      model: MODEL,
      temperature: 0.4,
      maxTokens: 1024,
    });

    // Retry once with a bigger ceiling if the model self-truncated.
    if (res.finishReason === 'max_tokens') {
      res = await generateDetailed({
        messages,
        provider: 'gemini',
        model: MODEL,
        temperature: 0.4,
        maxTokens: 1800,
      });
    }

    replyText = res.text.trim();

    // If still cut, drop the dangling clause so the bubble doesn't end
    // mid-word. Empty / safety-blocked → polite Thai/EN fallback.
    if (!replyText || res.safetyBlocked) {
      replyText = input.message.match(/[ก-๙]/)
        ? 'ขออนุญาตเช็คข้อมูลให้สักครู่นะคะ ขอเป็นเรื่องอื่นที่เกี่ยวกับ FlowAIOS ก่อนนะคะ'
        : "Let me check on that for a moment — could you ask me about something else FlowAIOS-related in the meantime?";
    } else if (res.finishReason === 'max_tokens' && !endsCleanly(replyText)) {
      replyText = trimDanglingClause(replyText);
    }
  } catch (err) {
    const fallback =
      input.message.match(/[ก-๙]/)
        ? 'ขออภัยค่ะ ดิฉันล่มไปครู่หนึ่ง ลองพิมพ์อีกครั้งได้ไหมคะ'
        : 'I had a hiccup connecting just now. Could you try that again in a moment?';
    await appendMessage({
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

  await appendMessage({
    threadId: thread.id,
    direction: 'out',
    body: replyText,
    aiGenerated: true,
    tokensInput,
    tokensOutput,
    costMicros,
  });

  await recordUsage({
    feature: 'concierge',
    model: MODEL,
    tokensInput,
    tokensOutput,
    costMicros,
    refType: 'prospect_thread',
    refId: thread.id,
  });

  // Re-read the thread to pick up the handoff flip.
  const finalThread = await upsertThread({ sessionId: input.sessionId });

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

/** True if the text ends with a sentence terminator or polite Thai closer. */
function endsCleanly(s: string): boolean {
  const trimmed = s.trim();
  return /[.!?…ๆ"')\]]$|ค่ะ$|ครับ$|นะคะ$|นะครับ$/u.test(trimmed);
}

/** Drop a dangling clause past the last sentence boundary so the bubble
 * doesn't end mid-word when the model self-truncated. */
function trimDanglingClause(s: string): string {
  const trimmed = s.trim();
  const lastTerminator = Math.max(
    trimmed.lastIndexOf('.'),
    trimmed.lastIndexOf('!'),
    trimmed.lastIndexOf('?'),
    trimmed.lastIndexOf('ค่ะ'),
    trimmed.lastIndexOf('ครับ'),
    trimmed.lastIndexOf('นะคะ'),
    trimmed.lastIndexOf('นะครับ'),
  );
  if (lastTerminator > Math.floor(trimmed.length * 0.4)) {
    // Keep the terminator + its full Thai polite suffix.
    const suffix = ['ค่ะ', 'ครับ', 'นะคะ', 'นะครับ'].find(
      (s) => trimmed.slice(lastTerminator, lastTerminator + s.length) === s,
    );
    const cut = lastTerminator + (suffix ? suffix.length : 1);
    return trimmed.slice(0, cut).trim();
  }
  return trimmed;
}
