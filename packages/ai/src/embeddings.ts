import { GoogleGenerativeAI } from '@google/generative-ai';

const EMBED_MODEL = 'text-embedding-004';
const EMBED_DIM = 768;

let cached: GoogleGenerativeAI | null = null;

function client() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  cached ??= new GoogleGenerativeAI(key);
  return cached;
}

export async function embed(text: string): Promise<number[]> {
  const model = client().getGenerativeModel({ model: EMBED_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const model = client().getGenerativeModel({ model: EMBED_MODEL });
  const result = await model.batchEmbedContents({
    requests: texts.map((t) => ({ content: { role: 'user', parts: [{ text: t }] } })),
  });
  return result.embeddings.map((e) => e.values);
}

export const EMBEDDING_DIMENSIONS = EMBED_DIM;
