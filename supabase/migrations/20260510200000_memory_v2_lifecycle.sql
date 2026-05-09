-- Self-improvement memory v2.
-- Adds the lifecycle metadata that turns customer_memory from a write-only
-- log into a system that knows what to keep, what to age out, and what to
-- supersede. Plus brand voice / product catalog / reply templates so the
-- merchant has surfaces to govern.

-- ── customer_memory · lifecycle metadata ─────────────────────────────

ALTER TABLE customer_memory
  ADD COLUMN IF NOT EXISTS confidence real NOT NULL DEFAULT 0.6,
  ADD COLUMN IF NOT EXISTS use_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_used_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_reinforced_at timestamptz,
  ADD COLUMN IF NOT EXISTS superseded_by uuid REFERENCES customer_memory(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS score real NOT NULL DEFAULT 0.6,
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- status: active | archived | contradicted | merged | low_confidence
-- score: precomputed for cheap ORDER BY at retrieval time
-- metadata: { sources: [...], extracted_by: 'gemini', cite_history: [{convo_id, at}] }

CREATE INDEX IF NOT EXISTS customer_memory_active_idx
  ON customer_memory (customer_id, status, score DESC)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS customer_memory_org_status_idx
  ON customer_memory (org_id, status, last_used_at DESC NULLS LAST);

-- Ensure all pre-existing rows have valid score = confidence so the
-- ORDER BY in retrieval doesn't sort nulls weirdly.
UPDATE customer_memory SET score = confidence WHERE score IS NULL;

-- ── memory_promotions · cross-customer lesson candidates ────────────

CREATE TABLE IF NOT EXISTS memory_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pattern text NOT NULL,
  example_memory_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  customer_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  promoted_to_lesson_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS memory_promotions_org_status_idx
  ON memory_promotions (org_id, status, created_at DESC);

ALTER TABLE memory_promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS memory_promotions_admin_select ON memory_promotions;
CREATE POLICY memory_promotions_admin_select ON memory_promotions
  FOR SELECT TO authenticated
  USING (public.is_org_admin(org_id));

DROP POLICY IF EXISTS memory_promotions_admin_modify ON memory_promotions;
CREATE POLICY memory_promotions_admin_modify ON memory_promotions
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- ── brand_voice · merchant-side configuration ───────────────────────

CREATE TABLE IF NOT EXISTS brand_voice (
  org_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  voice text NOT NULL DEFAULT 'friendly',
  language text NOT NULL DEFAULT 'th',
  formality text NOT NULL DEFAULT 'polite',
  signature text,
  forbidden_phrases text[] NOT NULL DEFAULT '{}'::text[],
  required_phrases text[] NOT NULL DEFAULT '{}'::text[],
  emoji_policy text NOT NULL DEFAULT 'none',
  custom_instructions text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE brand_voice ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS brand_voice_org_member_select ON brand_voice;
CREATE POLICY brand_voice_org_member_select ON brand_voice
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS brand_voice_admin_modify ON brand_voice;
CREATE POLICY brand_voice_admin_modify ON brand_voice
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- ── products · catalog the AI can reference ────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  sku text,
  name text NOT NULL,
  description text,
  price_cents integer,
  currency text DEFAULT 'THB',
  in_stock boolean NOT NULL DEFAULT true,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(768),
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_org_idx ON products (org_id, archived);
CREATE INDEX IF NOT EXISTS products_sku_idx ON products (org_id, sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_embedding_idx ON products USING hnsw (embedding vector_cosine_ops);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS products_org_member_select ON products;
CREATE POLICY products_org_member_select ON products
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS products_admin_modify ON products;
CREATE POLICY products_admin_modify ON products
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- ── reply_templates · agent-side quick replies ─────────────────────

CREATE TABLE IF NOT EXISTS reply_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shortcut text,
  title text NOT NULL,
  body text NOT NULL,
  language text NOT NULL DEFAULT 'th',
  category text,
  use_count integer NOT NULL DEFAULT 0,
  last_used_at timestamptz,
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS reply_templates_org_shortcut_unique
  ON reply_templates (org_id, shortcut) WHERE shortcut IS NOT NULL AND NOT archived;
CREATE INDEX IF NOT EXISTS reply_templates_org_idx ON reply_templates (org_id, archived);

ALTER TABLE reply_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reply_templates_org_member_select ON reply_templates;
CREATE POLICY reply_templates_org_member_select ON reply_templates
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS reply_templates_org_member_modify ON reply_templates;
CREATE POLICY reply_templates_org_member_modify ON reply_templates
  FOR ALL TO authenticated
  USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- ── Memory retrieval RPC ────────────────────────────────────────────
-- Vector similarity AND lifecycle filter (active only) AND score boost.

CREATE OR REPLACE FUNCTION public.customer_memory_match(
  p_org_id uuid,
  p_customer_id uuid,
  p_query_embedding vector(768),
  p_match_count int DEFAULT 8,
  p_match_threshold float DEFAULT 0.55
)
RETURNS TABLE (
  id uuid,
  kind text,
  content text,
  similarity float,
  score real,
  confidence real,
  use_count integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    cm.id,
    cm.kind,
    cm.content,
    1 - (cm.embedding <=> p_query_embedding) AS similarity,
    cm.score,
    cm.confidence,
    cm.use_count
  FROM customer_memory cm
  WHERE cm.org_id = p_org_id
    AND cm.customer_id = p_customer_id
    AND cm.status = 'active'
    AND cm.embedding IS NOT NULL
    AND 1 - (cm.embedding <=> p_query_embedding) > p_match_threshold
  ORDER BY (cm.embedding <=> p_query_embedding) - 0.05 * cm.score ASC
  LIMIT p_match_count;
$$;

GRANT EXECUTE ON FUNCTION public.customer_memory_match(uuid, uuid, vector, int, float)
  TO authenticated, service_role;

-- ── Memory dedup RPC (for nightly job) ──────────────────────────────
-- Marks duplicates as 'merged' status so they're hidden from retrieval
-- but kept for audit. Threshold = 0.92 cosine similarity within same
-- (org, customer, kind).

CREATE OR REPLACE FUNCTION public.customer_memory_dedup(
  p_org_id uuid,
  p_threshold float DEFAULT 0.92
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  merged_count integer := 0;
BEGIN
  WITH pairs AS (
    SELECT
      a.id AS keep_id,
      b.id AS drop_id
    FROM customer_memory a
    JOIN customer_memory b
      ON a.customer_id = b.customer_id
     AND a.kind = b.kind
     AND a.org_id = p_org_id
     AND b.org_id = p_org_id
     AND a.status = 'active'
     AND b.status = 'active'
     AND a.id < b.id
     AND a.embedding IS NOT NULL
     AND b.embedding IS NOT NULL
     AND 1 - (a.embedding <=> b.embedding) > p_threshold
  ),
  updated AS (
    UPDATE customer_memory cm
    SET status = 'merged',
        superseded_by = pairs.keep_id,
        updated_at = now()
    FROM pairs
    WHERE cm.id = pairs.drop_id
    RETURNING 1
  )
  SELECT count(*) INTO merged_count FROM updated;

  RETURN merged_count;
END
$$;

GRANT EXECUTE ON FUNCTION public.customer_memory_dedup(uuid, float)
  TO authenticated, service_role;

-- ── Memory decay RPC (for nightly job) ──────────────────────────────
-- Recomputes score for every active row. Score blends confidence,
-- recency, and use_count. Memories not used in 60+ days drop.

CREATE OR REPLACE FUNCTION public.customer_memory_recompute_scores(
  p_org_id uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  touched integer := 0;
BEGIN
  WITH updated AS (
    UPDATE customer_memory cm
    SET score = LEAST(
      1.0,
      GREATEST(
        0.0,
        cm.confidence * 0.5
        + LEAST(1.0, cm.use_count::real / 10.0) * 0.3
        + GREATEST(
            0.0,
            1.0 - EXTRACT(epoch FROM now() - COALESCE(cm.last_used_at, cm.created_at))
                  / (60 * 86400)
          ) * 0.2
      )
    ),
    status = CASE
      WHEN cm.status = 'active'
       AND cm.confidence < 0.3
       AND cm.use_count = 0
       AND cm.created_at < now() - interval '14 days'
        THEN 'low_confidence'
      ELSE cm.status
    END,
    updated_at = now()
    WHERE cm.org_id = p_org_id
      AND cm.status IN ('active', 'low_confidence')
    RETURNING 1
  )
  SELECT count(*) INTO touched FROM updated;

  RETURN touched;
END
$$;

GRANT EXECUTE ON FUNCTION public.customer_memory_recompute_scores(uuid)
  TO authenticated, service_role;

-- ── Memory citation RPC (called from auto-reply on every retrieval) ─
-- Atomically bumps use_count + last_used_at on cited memory IDs.

CREATE OR REPLACE FUNCTION public.customer_memory_cite(
  p_memory_ids uuid[]
)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH updated AS (
    UPDATE customer_memory
    SET use_count = use_count + 1,
        last_used_at = now(),
        last_reinforced_at = now(),
        updated_at = now()
    WHERE id = ANY(p_memory_ids)
    RETURNING 1
  )
  SELECT count(*)::integer FROM updated;
$$;

GRANT EXECUTE ON FUNCTION public.customer_memory_cite(uuid[])
  TO authenticated, service_role;

-- ── Memory governance summary (for /admin/memory dashboard) ────────

CREATE OR REPLACE FUNCTION public.customer_memory_summary(
  p_org_id uuid
)
RETURNS TABLE (
  active_count integer,
  low_confidence_count integer,
  contradicted_count integer,
  merged_count integer,
  archived_count integer,
  avg_confidence real,
  avg_use_count real,
  total_customers_with_memory integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    count(*) FILTER (WHERE status = 'active')::integer AS active_count,
    count(*) FILTER (WHERE status = 'low_confidence')::integer AS low_confidence_count,
    count(*) FILTER (WHERE status = 'contradicted')::integer AS contradicted_count,
    count(*) FILTER (WHERE status = 'merged')::integer AS merged_count,
    count(*) FILTER (WHERE status = 'archived')::integer AS archived_count,
    COALESCE(avg(confidence) FILTER (WHERE status = 'active'), 0)::real AS avg_confidence,
    COALESCE(avg(use_count) FILTER (WHERE status = 'active'), 0)::real AS avg_use_count,
    count(DISTINCT customer_id)::integer AS total_customers_with_memory
  FROM customer_memory
  WHERE org_id = p_org_id;
$$;

GRANT EXECUTE ON FUNCTION public.customer_memory_summary(uuid)
  TO authenticated, service_role;
