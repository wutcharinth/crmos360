/**
 * LLM adapter — provider-agnostic interface so we can swap models per-task.
 * Phase 1: Gemini 2.5 Flash primary, Claude Haiku 4.5 fallback.
 */

import { generateGemini, streamGemini } from './providers/gemini';
import { generateClaude, streamClaude } from './providers/anthropic';

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

export async function* stream(req: LlmRequest): AsyncIterable<string> {
  const provider = req.provider ?? 'gemini';
  const model = req.model ?? DEFAULTS[provider];

  if (provider === 'gemini') {
    yield* streamGemini({ ...req, model });
  } else {
    yield* streamClaude({ ...req, model });
  }
}
