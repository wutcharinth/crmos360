// RLS policies below call `public.is_org_member(uuid)` and
// `public.is_org_admin(uuid)` — SECURITY DEFINER helpers defined in
// `supabase/migrations/20260508144917_fix_rls_recursion.sql`. They bypass
// RLS internally, breaking the recursion that bit us at first deploy
// (Postgres 42P17 — the org_members SELECT policy referenced org_members
// itself, so any join through it looped forever). Don't reintroduce inline
// `exists (select 1 from org_members ...)` in policies; use the helpers.

import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';

// Reference to Supabase's auth.users (managed by Supabase).
const authSchema = pgSchema('auth');
export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

// --- Enums ---

export const orgRoleEnum = pgEnum('org_role', ['owner', 'admin', 'agent']);
export const channelEnum = pgEnum('channel', ['line', 'messenger', 'instagram']);
export const conversationStatusEnum = pgEnum('conversation_status', [
  'open',
  'pending',
  'resolved',
  'closed',
]);
export const messageDirectionEnum = pgEnum('message_direction', ['inbound', 'outbound']);
export const aiTaskKindEnum = pgEnum('ai_task_kind', [
  'reply_suggest',
  'summarize',
  'sentiment',
  'translate',
  'escalate_check',
  'memory_extract',
]);

// --- user_profiles ---

export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    pgPolicy('user_profiles_select_self', {
      for: 'select',
      to: 'authenticated',
      using: sql`${t.id} = (select auth.uid())`,
    }),
    pgPolicy('user_profiles_update_self', {
      for: 'update',
      to: 'authenticated',
      using: sql`${t.id} = (select auth.uid())`,
      withCheck: sql`${t.id} = (select auth.uid())`,
    }),
  ],
).enableRLS();

// --- organizations ---

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    plan: text('plan').notNull().default('free'),
    settings: jsonb('settings').notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    pgPolicy('organizations_select_member', {
      for: 'select',
      to: 'authenticated',
      using: sql`public.is_org_member(${t.id})`,
    }),
    pgPolicy('organizations_update_admin', {
      for: 'update',
      to: 'authenticated',
      using: sql`public.is_org_admin(${t.id})`,
      withCheck: sql`public.is_org_admin(${t.id})`,
    }),
    pgPolicy('organizations_insert_self', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`true`,
    }),
  ],
).enableRLS();

// --- org_members ---

export const orgMembers = pgTable(
  'org_members',
  {
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    role: orgRoleEnum('role').notNull().default('agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.orgId, t.userId] }),
    index('org_members_user_idx').on(t.userId),
    // SELECT: only own membership rows. Admin views of other members go through
    // the service-role admin client (see apps/web/app/(app)/admin/team/page.tsx).
    pgPolicy('org_members_select_self', {
      for: 'select',
      to: 'authenticated',
      using: sql`${t.userId} = (select auth.uid())`,
    }),
    pgPolicy('org_members_modify_admin', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_admin(${t.orgId})`,
      withCheck: sql`public.is_org_admin(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- org_invites ---

export const orgInvites = pgTable(
  'org_invites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: orgRoleEnum('role').notNull().default('agent'),
    token: text('token').notNull().unique(),
    invitedBy: uuid('invited_by').references(() => authUsers.id),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('org_invites_org_email_unique').on(t.orgId, t.email),
    pgPolicy('org_invites_admin_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_admin(${t.orgId})`,
      withCheck: sql`public.is_org_admin(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- customers ---

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name'),
    avatarUrl: text('avatar_url'),
    channelIds: jsonb('channel_ids').notNull().default(sql`'{}'::jsonb`), // { line: "U123", messenger: "PSID..." }
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    custom: jsonb('custom').notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('customers_org_idx').on(t.orgId),
    pgPolicy('customers_org_member_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_member(${t.orgId})`,
      withCheck: sql`public.is_org_member(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- conversations ---

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    channel: channelEnum('channel').notNull(),
    channelThreadId: text('channel_thread_id'),
    status: conversationStatusEnum('status').notNull().default('open'),
    assigneeId: uuid('assignee_id').references(() => authUsers.id, { onDelete: 'set null' }),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }).defaultNow().notNull(),
    unreadCount: integer('unread_count').notNull().default(0),
    autoReplyEnabled: boolean('auto_reply_enabled').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('conversations_org_status_idx').on(t.orgId, t.status, t.lastMessageAt),
    index('conversations_customer_idx').on(t.customerId),
    pgPolicy('conversations_org_member_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_member(${t.orgId})`,
      withCheck: sql`public.is_org_member(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- messages ---

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    direction: messageDirectionEnum('direction').notNull(),
    senderUserId: uuid('sender_user_id').references(() => authUsers.id, { onDelete: 'set null' }),
    body: text('body'),
    attachments: jsonb('attachments').notNull().default(sql`'[]'::jsonb`),
    raw: jsonb('raw'),
    aiGenerated: boolean('ai_generated').notNull().default(false),
    sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('messages_conversation_idx').on(t.conversationId, t.sentAt),
    pgPolicy('messages_org_member_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_member(${t.orgId})`,
      withCheck: sql`public.is_org_member(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- customer_memory ---

export const customerMemory = pgTable(
  'customer_memory',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull(), // 'summary' | 'fact' | 'note'
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 768 }),
    sourceConversationId: uuid('source_conversation_id').references(() => conversations.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('customer_memory_customer_idx').on(t.customerId),
    pgPolicy('customer_memory_org_member_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_member(${t.orgId})`,
      withCheck: sql`public.is_org_member(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- integrations ---

export const integrations = pgTable(
  'integrations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(), // 'line' | 'messenger' etc.
    config: jsonb('config').notNull().default(sql`'{}'::jsonb`), // channel creds (encrypted at app layer)
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('integrations_org_provider_unique').on(t.orgId, t.provider),
    pgPolicy('integrations_admin_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_admin(${t.orgId})`,
      withCheck: sql`public.is_org_admin(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- ai_logs ---

export const aiLogs = pgTable(
  'ai_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    conversationId: uuid('conversation_id').references(() => conversations.id, {
      onDelete: 'set null',
    }),
    kind: aiTaskKindEnum('kind').notNull(),
    model: text('model'),
    prompt: jsonb('prompt'),
    response: jsonb('response'),
    accepted: boolean('accepted'),
    latencyMs: integer('latency_ms'),
    costMicros: integer('cost_micros'), // micro-dollars
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('ai_logs_org_created_idx').on(t.orgId, t.createdAt),
    pgPolicy('ai_logs_org_member_select', {
      for: 'select',
      to: 'authenticated',
      using: sql`public.is_org_member(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- audit_logs ---

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    actorUserId: uuid('actor_user_id').references(() => authUsers.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetKind: text('target_kind'),
    targetId: text('target_id'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('audit_logs_org_created_idx').on(t.orgId, t.createdAt),
    pgPolicy('audit_logs_admin_select', {
      for: 'select',
      to: 'authenticated',
      using: sql`public.is_org_admin(${t.orgId})`,
    }),
  ],
).enableRLS();

// --- lessons ---
// AI-proposed generalizable patterns drawn from how the team edits
// AI-suggested replies. Approved lessons can be promoted into
// Configuration Advisor rules.

export const lessons = pgTable(
  'lessons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    sourceConversationId: uuid('source_conversation_id').references(
      () => conversations.id,
      { onDelete: 'set null' },
    ),
    sourceMessagePairAiId: uuid('source_message_pair_ai_id').references(
      () => messages.id,
      { onDelete: 'set null' },
    ),
    sourceMessagePairHumanId: uuid('source_message_pair_human_id').references(
      () => messages.id,
      { onDelete: 'set null' },
    ),
    statement: text('statement').notNull(),
    reasoning: text('reasoning').notNull(),
    embedding: vector('embedding', { dimensions: 768 }),
    suggestedRule: jsonb('suggested_rule_jsonb'),
    // 'pending' | 'approved' | 'rejected' | 'superseded'
    status: text('status').notNull().default('pending'),
    approvedByUserId: uuid('approved_by_user_id').references(() => authUsers.id, {
      onDelete: 'set null',
    }),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    rejectedAt: timestamp('rejected_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('lessons_org_status_idx').on(t.orgId, t.status, t.createdAt),
    index('lessons_conversation_idx').on(t.sourceConversationId),
    pgPolicy('lessons_org_member_select', {
      for: 'select',
      to: 'authenticated',
      using: sql`public.is_org_member(${t.orgId})`,
    }),
    pgPolicy('lessons_org_admin_modify', {
      for: 'all',
      to: 'authenticated',
      using: sql`public.is_org_admin(${t.orgId})`,
      withCheck: sql`public.is_org_admin(${t.orgId})`,
    }),
  ],
).enableRLS();

export const lessonApplications = pgTable(
  'lesson_applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    conversationId: uuid('conversation_id').references(() => conversations.id, {
      onDelete: 'set null',
    }),
    messageId: uuid('message_id').references(() => messages.id, {
      onDelete: 'set null',
    }),
    outcome: text('outcome').notNull().default('applied'),
    appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('lesson_applications_lesson_idx').on(t.lessonId, t.appliedAt),
    index('lesson_applications_conversation_idx').on(t.conversationId),
  ],
).enableRLS();

// --- prospect_threads ---
// Marketing-site concierge chatbot. NOT scoped to an org (no tenant yet
// at conversation time). Access is service-role + admin-allowlist only.

export const prospectThreads = pgTable(
  'prospect_threads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: text('session_id').notNull().unique(),
    email: text('email'),
    name: text('name'),
    vertical: text('vertical'),
    status: text('status').notNull().default('open'),
    utmSource: text('utm_source'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('prospect_threads_session_idx').on(t.sessionId),
    index('prospect_threads_created_idx').on(t.createdAt),
    index('prospect_threads_status_idx').on(t.status, t.lastMessageAt),
  ],
);

export const prospectMessages = pgTable(
  'prospect_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    threadId: uuid('thread_id')
      .notNull()
      .references(() => prospectThreads.id, { onDelete: 'cascade' }),
    direction: text('direction').notNull(), // 'in' | 'out'
    body: text('body').notNull(),
    aiGenerated: boolean('ai_generated').notNull().default(false),
    tokensInput: integer('tokens_input'),
    tokensOutput: integer('tokens_output'),
    costMicros: integer('cost_micros'),
    flagged: text('flagged'), // 'jailbreak' | 'pii' | 'toxic' | NULL
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('prospect_messages_thread_idx').on(t.threadId, t.createdAt)],
);

// --- llm_usage ---
// Cost ledger across every Gemini / Claude call. Scoped optionally to
// an org (in-product features) or NULL (marketing concierge).

export const llmUsage = pgTable(
  'llm_usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
    feature: text('feature').notNull(),
    model: text('model').notNull(),
    tokensInput: integer('tokens_input').notNull().default(0),
    tokensOutput: integer('tokens_output').notNull().default(0),
    costMicros: integer('cost_micros').notNull().default(0),
    refType: text('ref_type'),
    refId: text('ref_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('llm_usage_created_idx').on(t.createdAt),
    index('llm_usage_feature_idx').on(t.feature, t.createdAt),
    pgPolicy('llm_usage_org_admin_select', {
      for: 'select',
      to: 'authenticated',
      using: sql`${t.orgId} IS NOT NULL AND public.is_org_admin(${t.orgId})`,
    }),
  ],
).enableRLS();

// Inferred types for app code.
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type OrgMember = typeof orgMembers.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type CustomerMemory = typeof customerMemory.$inferSelect;
export type AiLog = typeof aiLogs.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type LessonApplication = typeof lessonApplications.$inferSelect;
export type NewLessonApplication = typeof lessonApplications.$inferInsert;
export type ProspectThread = typeof prospectThreads.$inferSelect;
export type NewProspectThread = typeof prospectThreads.$inferInsert;
export type ProspectMessage = typeof prospectMessages.$inferSelect;
export type NewProspectMessage = typeof prospectMessages.$inferInsert;
export type LlmUsageEntry = typeof llmUsage.$inferSelect;
export type NewLlmUsageEntry = typeof llmUsage.$inferInsert;
