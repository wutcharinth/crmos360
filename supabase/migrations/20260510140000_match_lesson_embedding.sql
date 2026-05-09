-- M1.5 · Chunk 15 helper: similarity search for lesson dedupe.
--
-- Used by extractLessonFromEdit() in apps/web/lib/ai/lessons.ts to avoid
-- creating duplicate lessons that say roughly the same thing.

CREATE OR REPLACE FUNCTION public.match_lesson_embedding(
  org uuid,
  query vector(768),
  match_threshold float
)
RETURNS TABLE (id uuid, distance float)
LANGUAGE sql STABLE
AS $$
  SELECT l.id, l.embedding <=> query AS distance
  FROM lessons l
  WHERE l.org_id = org
    AND l.embedding IS NOT NULL
    AND l.status IN ('pending', 'approved')
    AND l.embedding <=> query < match_threshold
  ORDER BY l.embedding <=> query ASC
  LIMIT 1;
$$;
