-- M1.5 · Chunk 18: PDPA wiring
--
-- Three pieces:
--   1. Extend audit_logs to distinguish AI / system / user actors.
--   2. Add org_pdpa_settings — per-org residency, memory mode, retention.
--   3. Add pending_facts — memory queue when memory_mode = 'approval'
--      (admin must approve each extracted fact before it lands in
--      customer_memory).
--
-- The existing audit_logs table from 20260509120000_inbox_ai_audit.sql
-- already has org_id + actor_user_id + action + metadata. We add
-- actor_type so AI / system writes can be filed without a fake user.

-- ── audit_logs · extend ──────────────────────────────────────────────

ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS actor_type text NOT NULL DEFAULT 'user';

-- Index for the admin /audit page filter.
CREATE INDEX IF NOT EXISTS audit_logs_org_actor_idx
  ON audit_logs (org_id, actor_type, created_at DESC);

-- ── org_pdpa_settings ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS org_pdpa_settings (
  org_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  -- 'th' | 'sg' | 'eu'
  residency text NOT NULL DEFAULT 'th',
  -- 'auto' | 'approval' | 'manual'
  memory_mode text NOT NULL DEFAULT 'auto',
  memory_retention_days integer NOT NULL DEFAULT 90,
  inbox_retention_days integer NOT NULL DEFAULT 365,
  audit_retention_days integer NOT NULL DEFAULT 365,
  dpa_signed_at timestamptz,
  dpa_signed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE org_pdpa_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_pdpa_settings_org_member_select ON org_pdpa_settings;
CREATE POLICY org_pdpa_settings_org_member_select ON org_pdpa_settings
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS org_pdpa_settings_admin_modify ON org_pdpa_settings;
CREATE POLICY org_pdpa_settings_admin_modify ON org_pdpa_settings
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- ── pending_facts ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pending_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  source_conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  kind text NOT NULL,
  content text NOT NULL,
  embedding vector(768),
  status text NOT NULL DEFAULT 'pending',
  approved_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pending_facts_org_status_idx
  ON pending_facts (org_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS pending_facts_customer_idx
  ON pending_facts (customer_id);

ALTER TABLE pending_facts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pending_facts_org_member_select ON pending_facts;
CREATE POLICY pending_facts_org_member_select ON pending_facts
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS pending_facts_admin_modify ON pending_facts;
CREATE POLICY pending_facts_admin_modify ON pending_facts
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- ── retention pruning function ───────────────────────────────────────
--
-- Runs daily via pg_cron (separate enabling step required on Supabase).
-- Deletes records past each org's retention window. The function reads
-- org_pdpa_settings; orgs without a row use the table defaults.

CREATE OR REPLACE FUNCTION public.run_pdpa_retention()
RETURNS TABLE (
  table_name text,
  rows_deleted integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  memory_count integer;
  inbox_count integer;
  audit_count integer;
BEGIN
  -- Memory: delete customer_memory rows past their org's window.
  WITH deleted AS (
    DELETE FROM customer_memory cm
    USING org_pdpa_settings s
    WHERE cm.org_id = s.org_id
      AND cm.created_at < now() - (s.memory_retention_days || ' days')::interval
    RETURNING 1
  )
  SELECT count(*) INTO memory_count FROM deleted;

  -- Inbox: delete messages past their org's window.
  WITH deleted AS (
    DELETE FROM messages m
    USING org_pdpa_settings s
    WHERE m.org_id = s.org_id
      AND m.created_at < now() - (s.inbox_retention_days || ' days')::interval
    RETURNING 1
  )
  SELECT count(*) INTO inbox_count FROM deleted;

  -- Audit: delete audit_logs past their org's window.
  WITH deleted AS (
    DELETE FROM audit_logs a
    USING org_pdpa_settings s
    WHERE a.org_id = s.org_id
      AND a.created_at < now() - (s.audit_retention_days || ' days')::interval
    RETURNING 1
  )
  SELECT count(*) INTO audit_count FROM deleted;

  RETURN QUERY VALUES
    ('customer_memory', memory_count),
    ('messages', inbox_count),
    ('audit_logs', audit_count);
END
$$;

-- pg_cron schedule (commented; uncomment after enabling pg_cron in Supabase).
-- SELECT cron.schedule(
--   'pdpa-retention-daily',
--   '0 19 * * *',  -- 03:00 ICT = 19:00 UTC the day prior
--   $$ SELECT public.run_pdpa_retention(); $$
-- );
