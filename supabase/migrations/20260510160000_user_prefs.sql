-- M1.5 · Chunk 19: per-user appearance prefs + org default skin
--
-- The skin/density/language toggles previously lived only in cookies.
-- That works for marketing visitors and unauthenticated traffic, but a
-- signed-in operator who switches devices loses their preference. This
-- migration adds:
--   1. user_prefs — per-user row keyed by auth.users.id. RLS lets a user
--      read + upsert only their own row.
--   2. organizations.default_skin — org-level default that newly-joined
--      users inherit until they override.
--
-- We do NOT seed user_prefs proactively; rows are written lazily on the
-- first PATCH. The GET endpoint falls through to org default + cookie
-- when no row exists.

-- ── user_prefs ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_prefs (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- 'daylight' | 'cockpit' | 'system'
  skin text NOT NULL DEFAULT 'daylight',
  -- 'comfortable' | 'compact'
  density text NOT NULL DEFAULT 'comfortable',
  -- 'th' | 'en'
  language text NOT NULL DEFAULT 'th',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_prefs_self_all ON user_prefs;
CREATE POLICY user_prefs_self_all ON user_prefs
  FOR ALL TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ── organizations.default_skin ───────────────────────────────────────

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS default_skin text NOT NULL DEFAULT 'daylight';
