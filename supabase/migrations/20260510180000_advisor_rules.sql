-- M1.5 · Chunk 17: Configuration Advisor logic
--
-- Advisor rules are admin-approved auto-reply patterns. They get proposed
-- from two upstream sources:
--   1. Recurring-question clusters (Chunk 16): "this question shows up
--      138 times a month, here's a templated reply that would handle it."
--   2. Approved lessons (Chunk 15): "the team consistently rewrites the
--      AI draft this way; lock that pattern in as a rule."
--
-- Once approved (status='active'), `applyRules(message)` runs ahead of
-- the model call in the auto-reply pipeline. A matching rule short-
-- circuits Gemini entirely and writes a `lesson_applications` row for
-- telemetry.

CREATE TABLE IF NOT EXISTS advisor_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  -- Plain-language statement of when the rule applies.
  condition_text text NOT NULL,
  -- Plain-language statement of what the rule does.
  action_text text NOT NULL,
  -- Structured matching: jsonb with shape:
  --   { "kind": "intent_cluster", "cluster_id": "..." }
  --   { "kind": "keyword", "any_of": ["พัสดุ", "tracking"] }
  --   { "kind": "embedding", "centroid": [..768..], "threshold": 0.78 }
  match_jsonb jsonb NOT NULL,
  -- Structured action:
  --   { "kind": "auto_reply", "template": "..." }
  --   { "kind": "escalate", "queue": "senior" }
  --   { "kind": "tag", "tags": [...] }
  action_jsonb jsonb NOT NULL,
  -- 'cluster' | 'lesson' | 'manual'
  source text NOT NULL,
  source_id text,
  -- 'pending' | 'active' | 'disabled'
  status text NOT NULL DEFAULT 'pending',
  -- Confidence the proposing system (cluster matcher / lesson extractor)
  -- attached at creation. Operators can edit this when approving.
  confidence real NOT NULL DEFAULT 0.5,
  applied_count integer NOT NULL DEFAULT 0,
  last_applied_at timestamptz,
  approved_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS advisor_rules_org_status_idx
  ON advisor_rules (org_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS advisor_rules_org_active_idx
  ON advisor_rules (org_id, status) WHERE status = 'active';

ALTER TABLE advisor_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS advisor_rules_org_member_select ON advisor_rules;
CREATE POLICY advisor_rules_org_member_select ON advisor_rules
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS advisor_rules_admin_modify ON advisor_rules;
CREATE POLICY advisor_rules_admin_modify ON advisor_rules
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));
