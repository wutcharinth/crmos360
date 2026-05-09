import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import type { LlmMessage } from '../adapter';

interface GeminiArgs {
  messages: LlmMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export type GeminiFinishReason =
  | 'STOP'
  | 'MAX_TOKENS'
  | 'SAFETY'
  | 'RECITATION'
  | 'OTHER'
  | 'UNKNOWN';

export interface GeminiResult {
  text: string;
  finishReason: GeminiFinishReason;
  safetyBlocked: boolean;
}

function buildContents(messages: LlmMessage[]): { systemInstruction?: string; contents: Content[] } {
  const systemMsg = messages.find((m) => m.role === 'system');
  const contents: Content[] = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
  return { systemInstruction: systemMsg?.content, contents };
}

function client() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenerativeAI(key);
}

/**
 * Plain-text helper. Throws on failure. Use generateGeminiDetailed if
 * you need the finish reason (truncation / safety detection).
 */
export async function generateGemini(args: GeminiArgs): Promise<string> {
  const result = await generateGeminiDetailed(args);
  return result.text;
}

export async function generateGeminiDetailed(args: GeminiArgs): Promise<GeminiResult> {
  const { systemInstruction, contents } = buildContents(args.messages);
  const model = client().getGenerativeModel({
    model: args.model,
    systemInstruction,
    generationConfig: {
      temperature: args.temperature ?? 0.4,
      maxOutputTokens: args.maxTokens ?? 1024,
    },
  });

  const result = await model.generateContent({ contents });
  const candidate = result.response.candidates?.[0];
  const finishReason = (candidate?.finishReason ?? 'UNKNOWN') as GeminiFinishReason;
  const ratings = candidate?.safetyRatings ?? [];
  const safetyBlocked =
    finishReason === 'SAFETY' ||
    ratings.some((r) => r.probability === 'HIGH' || r.probability === 'MEDIUM');

  // .text() throws if the response was blocked — guard it so callers can
  // make a sensible fallback decision instead of crashing.
  let text = '';
  try {
    text = result.response.text();
  } catch {
    text = '';
  }

  return { text, finishReason, safetyBlocked };
}

export async function* streamGemini(args: GeminiArgs): AsyncIterable<string> {
  const { systemInstruction, contents } = buildContents(args.messages);
  const model = client().getGenerativeModel({
    model: args.model,
    systemInstruction,
    generationConfig: {
      temperature: args.temperature ?? 0.4,
      maxOutputTokens: args.maxTokens ?? 1024,
    },
  });
  const result = await model.generateContentStream({ contents });
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
