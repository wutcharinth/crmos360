-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- Enums
CREATE TYPE "public"."ai_task_kind" AS ENUM('reply_suggest', 'summarize', 'sentiment', 'translate', 'escalate_check', 'memory_extract');
CREATE TYPE "public"."channel" AS ENUM('line', 'messenger', 'instagram');
CREATE TYPE "public"."conversation_status" AS ENUM('open', 'pending', 'resolved', 'closed');
CREATE TYPE "public"."message_direction" AS ENUM('inbound', 'outbound');
CREATE TYPE "public"."org_role" AS ENUM('owner', 'admin', 'agent');

-- Tables
CREATE TABLE "ai_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"conversation_id" uuid,
	"kind" "ai_task_kind" NOT NULL,
	"model" text,
	"prompt" jsonb,
	"response" jsonb,
	"accepted" boolean,
	"latency_ms" integer,
	"cost_micros" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "ai_logs" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"channel" "channel" NOT NULL,
	"channel_thread_id" text,
	"status" "conversation_status" DEFAULT 'open' NOT NULL,
	"assignee_id" uuid,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "customer_memory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(768),
	"source_conversation_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "customer_memory" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text,
	"avatar_url" text,
	"channel_ids" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"custom" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "integrations_org_provider_unique" UNIQUE("org_id","provider")
);
ALTER TABLE "integrations" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"direction" "message_direction" NOT NULL,
	"sender_user_id" uuid,
	"body" text,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"raw" jsonb,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "org_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "org_role" DEFAULT 'agent' NOT NULL,
	"token" text NOT NULL,
	"invited_by" uuid,
	"accepted_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "org_invites_token_unique" UNIQUE("token"),
	CONSTRAINT "org_invites_org_email_unique" UNIQUE("org_id","email")
);
ALTER TABLE "org_invites" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "org_members" (
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "org_role" DEFAULT 'agent' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "org_members_org_id_user_id_pk" PRIMARY KEY("org_id","user_id")
);
ALTER TABLE "org_members" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;

-- Foreign keys (auth.users is owned by Supabase; we reference it but don't create it)
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "auth"."users"("id") ON DELETE set null;
ALTER TABLE "customer_memory" ADD CONSTRAINT "customer_memory_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "customer_memory" ADD CONSTRAINT "customer_memory_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade;
ALTER TABLE "customer_memory" ADD CONSTRAINT "customer_memory_source_conversation_id_conversations_id_fk" FOREIGN KEY ("source_conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null;
ALTER TABLE "customers" ADD CONSTRAINT "customers_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade;
ALTER TABLE "messages" ADD CONSTRAINT "messages_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "auth"."users"("id") ON DELETE set null;
ALTER TABLE "org_invites" ADD CONSTRAINT "org_invites_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "org_invites" ADD CONSTRAINT "org_invites_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id");
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade;
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade;
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade;

-- Indexes
CREATE INDEX "ai_logs_org_created_idx" ON "ai_logs" USING btree ("org_id","created_at");
CREATE INDEX "conversations_org_status_idx" ON "conversations" USING btree ("org_id","status","last_message_at");
CREATE INDEX "conversations_customer_idx" ON "conversations" USING btree ("customer_id");
CREATE INDEX "customer_memory_customer_idx" ON "customer_memory" USING btree ("customer_id");
CREATE INDEX "customers_org_idx" ON "customers" USING btree ("org_id");
CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("conversation_id","sent_at");
CREATE INDEX "org_members_user_idx" ON "org_members" USING btree ("user_id");

-- HNSW index for vector similarity search (Phase 1.4)
CREATE INDEX "customer_memory_embedding_idx" ON "customer_memory" USING hnsw ("embedding" vector_cosine_ops);

-- RLS policies
CREATE POLICY "ai_logs_org_member_select" ON "ai_logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "ai_logs"."org_id" and m.user_id = (select auth.uid())));
CREATE POLICY "conversations_org_member_all" ON "conversations" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "conversations"."org_id" and m.user_id = (select auth.uid()))) WITH CHECK (exists (select 1 from public.org_members m where m.org_id = "conversations"."org_id" and m.user_id = (select auth.uid())));
CREATE POLICY "customer_memory_org_member_all" ON "customer_memory" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "customer_memory"."org_id" and m.user_id = (select auth.uid()))) WITH CHECK (exists (select 1 from public.org_members m where m.org_id = "customer_memory"."org_id" and m.user_id = (select auth.uid())));
CREATE POLICY "customers_org_member_all" ON "customers" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "customers"."org_id" and m.user_id = (select auth.uid()))) WITH CHECK (exists (select 1 from public.org_members m where m.org_id = "customers"."org_id" and m.user_id = (select auth.uid())));
CREATE POLICY "integrations_admin_all" ON "integrations" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "integrations"."org_id" and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))) WITH CHECK (exists (select 1 from public.org_members m where m.org_id = "integrations"."org_id" and m.user_id = (select auth.uid()) and m.role in ('owner','admin')));
CREATE POLICY "messages_org_member_all" ON "messages" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "messages"."org_id" and m.user_id = (select auth.uid()))) WITH CHECK (exists (select 1 from public.org_members m where m.org_id = "messages"."org_id" and m.user_id = (select auth.uid())));
CREATE POLICY "org_invites_admin_all" ON "org_invites" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "org_invites"."org_id" and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))) WITH CHECK (exists (select 1 from public.org_members m where m.org_id = "org_invites"."org_id" and m.user_id = (select auth.uid()) and m.role in ('owner','admin')));
CREATE POLICY "org_members_select_self_or_org" ON "org_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("org_members"."user_id" = (select auth.uid()) or exists (select 1 from public.org_members m2 where m2.org_id = "org_members"."org_id" and m2.user_id = (select auth.uid())));
CREATE POLICY "org_members_modify_admin" ON "org_members" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from public.org_members m2 where m2.org_id = "org_members"."org_id" and m2.user_id = (select auth.uid()) and m2.role in ('owner','admin'))) WITH CHECK (exists (select 1 from public.org_members m2 where m2.org_id = "org_members"."org_id" and m2.user_id = (select auth.uid()) and m2.role in ('owner','admin')));
CREATE POLICY "organizations_select_member" ON "organizations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "organizations"."id" and m.user_id = (select auth.uid())));
CREATE POLICY "organizations_update_admin" ON "organizations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (select 1 from public.org_members m where m.org_id = "organizations"."id" and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))) WITH CHECK (exists (select 1 from public.org_members m where m.org_id = "organizations"."id" and m.user_id = (select auth.uid()) and m.role in ('owner','admin')));
CREATE POLICY "organizations_insert_self" ON "organizations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);
CREATE POLICY "user_profiles_select_self" ON "user_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("user_profiles"."id" = (select auth.uid()));
CREATE POLICY "user_profiles_update_self" ON "user_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("user_profiles"."id" = (select auth.uid())) WITH CHECK ("user_profiles"."id" = (select auth.uid()));
