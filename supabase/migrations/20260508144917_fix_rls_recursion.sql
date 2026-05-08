-- Fix infinite recursion (Postgres 42P17) in RLS policies.
-- The original org_members SELECT policy referenced org_members itself in its
-- USING clause, which triggers recursive policy evaluation. Same pattern in
-- every "exists (select 1 from org_members ...)" subquery on policies for
-- other tables: the subquery itself runs through the recursive policy.
--
-- Standard fix: SECURITY DEFINER helper functions that bypass RLS for the
-- internal lookup, then policies call those helpers instead of inline EXISTS.

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_id = _org_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_id = _org_id AND user_id = auth.uid() AND role IN ('owner','admin')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid) TO authenticated;

-- Drop recursive policies
DROP POLICY IF EXISTS "org_members_select_self_or_org" ON public.org_members;
DROP POLICY IF EXISTS "org_members_modify_admin" ON public.org_members;
DROP POLICY IF EXISTS "organizations_select_member" ON public.organizations;
DROP POLICY IF EXISTS "organizations_update_admin" ON public.organizations;
DROP POLICY IF EXISTS "customers_org_member_all" ON public.customers;
DROP POLICY IF EXISTS "conversations_org_member_all" ON public.conversations;
DROP POLICY IF EXISTS "messages_org_member_all" ON public.messages;
DROP POLICY IF EXISTS "customer_memory_org_member_all" ON public.customer_memory;
DROP POLICY IF EXISTS "ai_logs_org_member_select" ON public.ai_logs;
DROP POLICY IF EXISTS "integrations_admin_all" ON public.integrations;
DROP POLICY IF EXISTS "org_invites_admin_all" ON public.org_invites;

-- Recreate using helpers
-- org_members: user can only see their own membership rows; admin ops use helper
CREATE POLICY "org_members_select_self" ON public.org_members
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "org_members_modify_admin" ON public.org_members
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- organizations
CREATE POLICY "organizations_select_member" ON public.organizations
  FOR SELECT TO authenticated
  USING (public.is_org_member(id));

CREATE POLICY "organizations_update_admin" ON public.organizations
  FOR UPDATE TO authenticated
  USING (public.is_org_admin(id))
  WITH CHECK (public.is_org_admin(id));

-- customers
CREATE POLICY "customers_org_member_all" ON public.customers
  FOR ALL TO authenticated
  USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- conversations
CREATE POLICY "conversations_org_member_all" ON public.conversations
  FOR ALL TO authenticated
  USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- messages
CREATE POLICY "messages_org_member_all" ON public.messages
  FOR ALL TO authenticated
  USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- customer_memory
CREATE POLICY "customer_memory_org_member_all" ON public.customer_memory
  FOR ALL TO authenticated
  USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- ai_logs
CREATE POLICY "ai_logs_org_member_select" ON public.ai_logs
  FOR SELECT TO authenticated
  USING (public.is_org_member(org_id));

-- integrations (admin-only)
CREATE POLICY "integrations_admin_all" ON public.integrations
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));

-- org_invites (admin-only)
CREATE POLICY "org_invites_admin_all" ON public.org_invites
  FOR ALL TO authenticated
  USING (public.is_org_admin(org_id))
  WITH CHECK (public.is_org_admin(org_id));
