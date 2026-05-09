-- M1.5 · Chunk 15: lesson extraction pipeline
--
-- Lessons are AI-proposed generalizable patterns drawn from how the team
-- edits AI-suggested replies. The flow:
--   1. AI drafts reply X for conversation C.
--   2. Agent edits to Y (or replaces entirely) before sending.
--   3. extractLessonFromEdit(X, Y, C) calls Gemini to identify whether
--      this edit reflects a generalizable rule worth applying to future
--      messages of the same shape.
--   4. If yes, a row lands in `lessons` with status='pending' for human
--      approval.
--   5. On approval, the lesson can be promoted into a Configuration
--      Advisor rule (Chunk 17) that runs against future inbound.
--
-- `lesson_applications` records each time an approved lesson contributed
-- to (or was used to filter) an AI reply. Lets the admin /knowledge
-- surface show "this lesson has applied 47 times" telemetry.

-- ── lessons ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  source_message_pair_ai_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  source_message_pair_human_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  -- The natural-language statement: "When customer asks X, reply with Y."
  statement text NOT NULL,
  -- Why the AI thought this was generalizable (its own reasoning).
  reasoning text NOT NULL,
  -- Optional embedding for dedupe + similarity search across lessons.
  embedding vector(768),
  -- Optional structured rule the lesson could become.
  suggested_rule_jsonb jsonb,
  -- 'pending' | 'approved' | 'rejected' | 'superseded'
  status text NOT NULL DEFAULT 'pending',
  approved_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lessons_org_status_idx ON lessons (org_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS lessons_conversation_idx ON lessons (source_conversation_id);

-- HNSW vector index for similarity dedupe; only created if the pgvector
-- extension supports it (Supabase: yes since 2024-04). Skip silently if
-- the extension isn't available.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS lessons_embedding_idx ON lessons USING hnsw (embedding vector_cosine_ops)';
  END IF;
END $$;

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lessons_org_member_select ON lessons;
CREATE POLICY lessons_org_member_select ON lessons
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

-- Only admins can approve/reject; agents can read.
DROP POLICY IF EXISTS lessons_org_admin_modify ON lessons;
CREATE POLICY lessons_org_admin_modify ON lessons
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- ── lesson_applications ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lesson_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  -- 'applied' (AI used this lesson in its reasoning)
  -- | 'shadow_applied' (lesson matched but did not actually change reply)
  -- | 'rejected_by_threshold' (matched but confidence fell below cut-off)
  outcome text NOT NULL DEFAULT 'applied',
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_applications_lesson_idx ON lesson_applications (lesson_id, applied_at DESC);
CREATE INDEX IF NOT EXISTS lesson_applications_conversation_idx ON lesson_applications (conversation_id);

ALTER TABLE lesson_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lesson_applications_org_member_select ON lesson_applications;
CREATE POLICY lesson_applications_org_member_select ON lesson_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      WHERE l.id = lesson_applications.lesson_id
      AND public.is_org_member(l.org_id)
    )
  );
