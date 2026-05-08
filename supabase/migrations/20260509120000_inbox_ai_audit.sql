-- M1.2/M1.3: per-conversation auto-reply toggle + AI-generated message flag
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS auto_reply_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS ai_generated boolean NOT NULL DEFAULT false;

-- M1.6: audit log for admin dashboard
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_kind text,
  target_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_org_created_idx ON audit_logs (org_id, created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_logs_admin_select ON audit_logs;
CREATE POLICY audit_logs_admin_select ON audit_logs
  FOR SELECT TO authenticated
  USING (public.is_org_admin(org_id));
