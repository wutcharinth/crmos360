-- M1.5 · concierge persistence + LLM usage ledger
--
-- Backs the marketing chatbot (apps/web/lib/concierge/store.ts) and the
-- admin dashboard pages (/admin, /admin/prospects, /admin/cost,
-- /admin/jailbreak). The current Next.js implementation uses an
-- in-memory store; once this migration is applied, the store can be
-- swapped to a Supabase-backed implementation with the same shape.
--
-- prospect_threads + prospect_messages are NOT scoped to an org. They
-- are owned by FlowAIOS itself (visitors on the marketing site, no
-- tenant yet). Access is gated by service role / admin allowlist, not
-- RLS.
--
-- llm_usage IS optionally scoped to an org for in-product features
-- (auto-reply, memory, lessons, advisor). Concierge usage rows have
-- org_id = NULL.

-- ── prospect_threads ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prospect_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  email text,
  name text,
  -- 'commerce' | 'customer-ops' | 'services' | 'b2b' | NULL
  vertical text,
  -- 'open' | 'handed_off' | 'closed'
  status text NOT NULL DEFAULT 'open',
  utm_source text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prospect_threads_session_idx ON prospect_threads (session_id);
CREATE INDEX IF NOT EXISTS prospect_threads_created_idx ON prospect_threads (created_at DESC);
CREATE INDEX IF NOT EXISTS prospect_threads_status_idx ON prospect_threads (status, last_message_at DESC);

-- Disable RLS — admin-only access via service role + email allowlist.
-- Revoke implicit grants from anon/authenticated to be safe.
ALTER TABLE prospect_threads DISABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE prospect_threads FROM anon, authenticated;

-- ── prospect_messages ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prospect_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES prospect_threads(id) ON DELETE CASCADE,
  -- 'in' (visitor) | 'out' (concierge)
  direction text NOT NULL,
  body text NOT NULL,
  ai_generated boolean NOT NULL DEFAULT false,
  tokens_input integer,
  tokens_output integer,
  cost_micros integer,
  -- 'jailbreak' | 'pii' | 'toxic' | NULL
  flagged text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prospect_messages_thread_idx ON prospect_messages (thread_id, created_at);
CREATE INDEX IF NOT EXISTS prospect_messages_flagged_idx ON prospect_messages (flagged) WHERE flagged IS NOT NULL;

ALTER TABLE prospect_messages DISABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE prospect_messages FROM anon, authenticated;

-- ── llm_usage ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS llm_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- NULL for marketing concierge usage; org_id for in-product features.
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  -- 'concierge' | 'auto-reply' | 'memory' | 'lessons' | 'advisor' | 'sentiment' | 'embeddings'
  feature text NOT NULL,
  model text NOT NULL,
  tokens_input integer NOT NULL DEFAULT 0,
  tokens_output integer NOT NULL DEFAULT 0,
  cost_micros integer NOT NULL DEFAULT 0,
  -- e.g. 'prospect_thread' / 'conversation' / 'customer_memory' / 'lesson'
  ref_type text,
  ref_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS llm_usage_created_idx ON llm_usage (created_at DESC);
CREATE INDEX IF NOT EXISTS llm_usage_feature_idx ON llm_usage (feature, created_at DESC);
CREATE INDEX IF NOT EXISTS llm_usage_org_idx ON llm_usage (org_id, created_at DESC) WHERE org_id IS NOT NULL;

-- Org-admin readable rows (scoped). NULL-org rows (concierge) are
-- service-role only.
ALTER TABLE llm_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS llm_usage_org_admin_select ON llm_usage;
CREATE POLICY llm_usage_org_admin_select ON llm_usage
  FOR SELECT TO authenticated
  USING (org_id IS NOT NULL AND public.is_org_admin(org_id));
