import 'server-only';
import { harnessGenerate } from './harness';
import type { LlmMessage } from '@crmos360/ai';
import type { RecalledMemory } from './memory-engine';

/**
 * Context engineering — what goes into the LLM call, in what shape, with
 * what budget.
 *
 * Auto-reply is the hottest path so the entire pipeline composes here:
 *
 *   buildAutoReplyContext({...}) → LlmMessage[]
 *
 * Sections (in order):
 *   1. Brand-voice system message (if brand_voice configured)
 *   2. Org system prompt (default or from agent profile)
 *   3. Customer context (memories formatted as bullets, top-K by score)
 *   4. KB context (retrieved articles, deduped, capped by char budget)
 *   5. Conversation history (verbatim recent + LLM-summarized older)
 *   6. The current inbound message (caller appends after this returns)
 */

export interface BrandVoiceLite {
  voice: string;
  formality: string;
  language: string;
  signature: string | null;
  forbiddenPhrases: string[];
  requiredPhrases: string[];
  emojiPolicy: string;
  customInstructions: string | null;
}

export interface BuildContextArgs {
  systemPrompt: string;
  brandVoice?: BrandVoiceLite | null;
  customerName?: string | null;
  memories: RecalledMemory[];
  kbHits: { id: string; title: string; body: string }[];
  history: { role: 'user' | 'assistant'; content: string }[];
  /** Soft cap on prompt characters; older history gets summarized to fit. */
  maxPromptChars?: number;
}

const DEFAULT_BUDGET = 16_000;
const VERBATIM_RECENT_TURNS = 8;

export async function buildAutoReplyContext(
  args: BuildContextArgs,
): Promise<{ messages: LlmMessage[]; usedSummary: boolean }> {
  const messages: LlmMessage[] = [];

  // 1. Brand voice
  if (args.brandVoice) {
    messages.push({
      role: 'system',
      content: renderBrandVoice(args.brandVoice),
    });
  }

  // 2. Org system prompt
  messages.push({ role: 'system', content: args.systemPrompt });

  // 3. Customer context
  const customerCtx = renderCustomerContext({
    name: args.customerName,
    memories: args.memories,
  });
  if (customerCtx) {
    messages.push({ role: 'system', content: customerCtx });
  }

  // 4. KB context
  if (args.kbHits.length > 0) {
    const kbBlock = formatKb(args.kbHits);
    messages.push({ role: 'system', content: kbBlock });
  }

  // 5. History (verbatim recent + summarized older)
  const verbatim = args.history.slice(-VERBATIM_RECENT_TURNS);
  const olderRaw = args.history.slice(0, -VERBATIM_RECENT_TURNS);

  let usedSummary = false;
  if (olderRaw.length > 0) {
    const projected = estimateChars(messages) + estimateChars(verbatim);
    const budget = args.maxPromptChars ?? DEFAULT_BUDGET;
    if (projected + estimateChars(olderRaw) > budget) {
      const summary = await summarizeHistory(olderRaw);
      if (summary) {
        messages.push({
          role: 'system',
          content: `Earlier in this conversation (summary): ${summary}`,
        });
        usedSummary = true;
      }
    } else {
      // Budget allows full inline.
      for (const m of olderRaw) {
        messages.push({ role: m.role, content: m.content });
      }
    }
  }

  for (const m of verbatim) {
    messages.push({ role: m.role, content: m.content });
  }

  return { messages, usedSummary };
}

function renderBrandVoice(v: BrandVoiceLite): string {
  const lines: string[] = [`Brand voice & persona — apply on every reply:`];
  lines.push(`- Tone: ${v.voice}, formality ${v.formality}.`);
  lines.push(`- Default language: ${v.language === 'th' ? 'Thai (use ค่ะ/ครับ)' : v.language}.`);
  if (v.emojiPolicy === 'none') lines.push('- No emoji.');
  else if (v.emojiPolicy === 'sparing') lines.push('- Emoji sparingly only at the end.');
  if (v.forbiddenPhrases.length > 0) {
    lines.push(`- Never use these phrases: ${v.forbiddenPhrases.slice(0, 6).join(', ')}.`);
  }
  if (v.requiredPhrases.length > 0) {
    lines.push(`- Try to include when relevant: ${v.requiredPhrases.slice(0, 4).join(', ')}.`);
  }
  if (v.signature) lines.push(`- Sign off with: "${v.signature}".`);
  if (v.customInstructions) lines.push(v.customInstructions);
  return lines.join('\n');
}

function renderCustomerContext(args: {
  name?: string | null;
  memories: RecalledMemory[];
}): string | null {
  if (args.memories.length === 0 && !args.name) return null;
  const lines: string[] = ['Customer context:'];
  if (args.name) lines.push(`- Name: ${args.name}`);
  for (const m of args.memories.slice(0, 8)) {
    lines.push(`- (${m.kind}, conf ${m.confidence.toFixed(2)}, used ${m.use_count}×) ${m.content}`);
  }
  lines.push(
    'Use these only when directly relevant. Do not list them. Do not tell the customer "your record says X" — just incorporate naturally.',
  );
  return lines.join('\n');
}

function formatKb(hits: { id: string; title: string; body: string }[]): string {
  const lines: string[] = ['Knowledge base (use only when applicable, never quote verbatim):'];
  hits.slice(0, 4).forEach((h, i) => {
    lines.push(`[KB${i + 1}] ${h.title}\n${h.body.slice(0, 600)}`);
  });
  return lines.join('\n\n');
}

function estimateChars(items: { content: string }[]): number {
  return items.reduce((sum, m) => sum + m.content.length, 0);
}

const SUMMARY_PROMPT = `Summarize the EARLIER part of this customer-service conversation in 2-4 short bullet points.
Capture: customer's intent, decisions made, commitments by either party, unresolved items. Do NOT include politeness filler.
If the dialogue mostly contains greetings or chitchat, return an empty string.`;

async function summarizeHistory(
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<string | null> {
  const transcript = history
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Reply'}: ${m.content}`)
    .join('\n');
  try {
    const res = await harnessGenerate({
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: transcript },
      ],
      temperature: 0.2,
      maxTokens: 240,
      fallback: false,
    });
    const t = res.text.trim();
    return t || null;
  } catch {
    return null;
  }
}

/** Return the most recent inbound message body, used as the retrieval query. */
export function lastInboundQuery(
  history: { role: 'user' | 'assistant'; content: string }[],
): string {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]?.role === 'user') return history[i]!.content;
  }
  return '';
}
