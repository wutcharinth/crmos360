import 'server-only';
import { embed } from '@crmos360/ai';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatKnowledgeContext } from '@/lib/util/format-context';

interface KbHit {
  id: string;
  title: string;
  body: string;
  similarity: number;
}

export { formatKnowledgeContext };

const MIN_SIMILARITY = 0.55;
const TOP_K = 4;

export async function retrieveKnowledge(orgId: string, query: string): Promise<KbHit[]> {
  if (!process.env.GEMINI_API_KEY) return [];
  if (!query.trim()) return [];

  let queryVec: number[];
  try {
    queryVec = await embed(query);
  } catch {
    return [];
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc('knowledge_articles_match', {
    p_org_id: orgId,
    p_query_embedding: queryVec,
    p_match_threshold: MIN_SIMILARITY,
    p_match_count: TOP_K,
  });

  if (error || !Array.isArray(data)) {
    const { data: fallback } = await admin
      .from('knowledge_articles')
      .select('id, title, body')
      .eq('org_id', orgId)
      .eq('archived', false)
      .limit(TOP_K);
    return (fallback ?? []).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      body: (r.body as string).slice(0, 500),
      similarity: 0,
    }));
  }

  return (data as { id: string; title: string; body: string; similarity: number }[]).map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body.slice(0, 600),
    similarity: r.similarity,
  }));
}

