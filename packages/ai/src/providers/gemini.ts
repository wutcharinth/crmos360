import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import type { LlmMessage } from '../adapter';

interface GeminiArgs {
  messages: LlmMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
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

export async function generateGemini(args: GeminiArgs): Promise<string> {
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
  return result.response.text();
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
