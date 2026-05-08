-- RPC for cosine-similarity retrieval against knowledge_articles.
-- Used by lib/ai/knowledge.ts. Bypasses RLS via SECURITY DEFINER but
-- requires explicit org_id parameter so it cannot leak across orgs.
CREATE OR REPLACE FUNCTION public.knowledge_articles_match(
  p_org_id uuid,
  p_query_embedding vector(768),
  p_match_threshold float DEFAULT 0.55,
  p_match_count int DEFAULT 4
)
RETURNS TABLE (
  id uuid,
  title text,
  body text,
  similarity float
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ka.id,
    ka.title,
    ka.body,
    1 - (ka.embedding <=> p_query_embedding) AS similarity
  FROM knowledge_articles ka
  WHERE ka.org_id = p_org_id
    AND ka.archived = false
    AND ka.embedding IS NOT NULL
    AND 1 - (ka.embedding <=> p_query_embedding) > p_match_threshold
  ORDER BY ka.embedding <=> p_query_embedding
  LIMIT p_match_count;
$$;

GRANT EXECUTE ON FUNCTION public.knowledge_articles_match(uuid, vector, float, int)
  TO authenticated, service_role;
