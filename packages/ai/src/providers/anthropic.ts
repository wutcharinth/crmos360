import Anthropic from '@anthropic-ai/sdk';
import type { LlmMessage } from '../adapter';

interface ClaudeArgs {
  messages: LlmMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
}

function client() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey: key });
}

function split(messages: LlmMessage[]) {
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');
  const turns = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  return { system, turns };
}

export async function generateClaude(args: ClaudeArgs): Promise<string> {
  const { system, turns } = split(args.messages);
  const res = await client().messages.create({
    model: args.model,
    max_tokens: args.maxTokens ?? 1024,
    temperature: args.temperature ?? 0.4,
    system,
    messages: turns,
  });
  return res.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('');
}

export async function* streamClaude(args: ClaudeArgs): AsyncIterable<string> {
  const { system, turns } = split(args.messages);
  const stream = await client().messages.stream({
    model: args.model,
    max_tokens: args.maxTokens ?? 1024,
    temperature: args.temperature ?? 0.4,
    system,
    messages: turns,
  });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}
