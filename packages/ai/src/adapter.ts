/**
 * LLM adapter — provider-agnostic interface so we can swap models per-task.
 * Phase 1: Gemini 2.5 Flash primary, Claude Haiku 4.5 fallback.
 */

import {
  generateGemini,
  generateGeminiDetailed,
  streamGemini,
  type GeminiFinishReason,
} from './providers/gemini';
import { generateClaude, streamClaude } from './providers/anthropic';

export type FinishReason = 'stop' | 'max_tokens' | 'safety' | 'other';

export type LlmRole = 'system' | 'user' | 'assistant';

export interface LlmMessage {
  role: LlmRole;
  content: string;
}

export interface LlmRequest {
  messages: LlmMessage[];
  temperature?: number;
  maxTokens?: number;
  /** Provider hint; falls back to default routing */
  provider?: 'gemini' | 'anthropic';
  /** Override default model for the chosen provider */
  model?: string;
}

export interface LlmResponse {
  text: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
}

const DEFAULTS = {
  gemini: 'gemini-2.5-flash',
  anthropic: 'claude-haiku-4-5-20251001',
} as const;

export async function generate(req: LlmRequest): Promise<LlmResponse> {
  const provider = req.provider ?? 'gemini';
  const model = req.model ?? DEFAULTS[provider];
  const start = Date.now();

  const text =
    provider === 'gemini'
      ? await generateGemini({ ...req, model })
      : await generateClaude({ ...req, model });

  return { text, model, latencyMs: Date.now() - start };
}

export interface LlmDetailedResponse extends LlmResponse {
  finishReason: FinishReason;
  safetyBlocked: boolean;
}

function mapGeminiReason(r: GeminiFinishReason): FinishReason {
  if (r === 'STOP') return 'stop';
  if (r === 'MAX_TOKENS') return 'max_tokens';
  if (r === 'SAFETY' || r === 'RECITATION') return 'safety';
  return 'other';
}

/**
 * generate() that returns finish-reason metadata. Used by the demo
 * playground so it can detect MAX_TOKENS / SAFETY truncation and
 * either retry with more headroom or surface a graceful fallback.
 */
export async function generateDetailed(req: LlmRequest): Promise<LlmDetailedResponse> {
  const provider = req.provider ?? 'gemini';
  const model = req.model ?? DEFAULTS[provider];
  const start = Date.now();

  if (provider === 'gemini') {
    const r = await generateGeminiDetailed({ ...req, model });
    return {
      text: r.text,
      model,
      latencyMs: Date.now() - start,
      finishReason: mapGeminiReason(r.finishReason),
      safetyBlocked: r.safetyBlocked,
    };
  }

  const text = await generateClaude({ ...req, model });
  return {
    text,
    model,
    latencyMs: Date.now() - start,
    // Anthropic provider doesn't surface finish reason yet; assume stop.
    finishReason: 'stop',
    safetyBlocked: false,
  };
}

export async function* stream(req: LlmRequest): AsyncIterable<string> {
  const provider = req.provider ?? 'gemini';
  const model = req.model ?? DEFAULTS[provider];

  if (provider === 'gemini') {
    yield* streamGemini({ ...req, model });
  } else {
    yield* streamClaude({ ...req, model });
  }
}
