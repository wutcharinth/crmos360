-- Knowledge base for org-specific FAQ / SOP / product info that AI references.
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  category text,
  embedding vector(768),
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS knowledge_articles_org_idx ON knowledge_articles (org_id, archived);
CREATE INDEX IF NOT EXISTS knowledge_articles_embedding_idx
  ON knowledge_articles
  USING hnsw (embedding vector_cosine_ops);

ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS knowledge_articles_select ON knowledge_articles;
CREATE POLICY knowledge_articles_select ON knowledge_articles
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS knowledge_articles_admin_write ON knowledge_articles;
CREATE POLICY knowledge_articles_admin_write ON knowledge_articles
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));
