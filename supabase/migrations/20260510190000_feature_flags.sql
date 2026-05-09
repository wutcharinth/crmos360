-- M1.5 · Chunk 20: feature flag wiring
--
-- Per-org boolean flags. Falls through to env default (M15_ENABLED_DEFAULT)
-- when no row exists for an org. Designed so design-partner orgs can
-- enable M1.5 surfaces in production while everyone else stays on the
-- pre-M1.5 path.

CREATE TABLE IF NOT EXISTS org_feature_flags (
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  flag_key text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  enabled_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  enabled_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, flag_key)
);

CREATE INDEX IF NOT EXISTS org_feature_flags_flag_idx ON org_feature_flags (flag_key, enabled);

ALTER TABLE org_feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_feature_flags_member_select ON org_feature_flags;
CREATE POLICY org_feature_flags_member_select ON org_feature_flags
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

DROP POLICY IF EXISTS org_feature_flags_admin_modify ON org_feature_flags;
CREATE POLICY org_feature_flags_admin_modify ON org_feature_flags
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));
