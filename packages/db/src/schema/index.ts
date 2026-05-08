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
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.id} and m.user_id = (select auth.uid()))`,
    }),
    pgPolicy('organizations_update_admin', {
      for: 'update',
      to: 'authenticated',
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.id} and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))`,
      withCheck: sql`exists (select 1 from public.org_members m where m.org_id = ${t.id} and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))`,
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
    pgPolicy('org_members_select_self_or_org', {
      for: 'select',
      to: 'authenticated',
      using: sql`${t.userId} = (select auth.uid()) or exists (select 1 from public.org_members m2 where m2.org_id = ${t.orgId} and m2.user_id = (select auth.uid()))`,
    }),
    pgPolicy('org_members_modify_admin', {
      for: 'all',
      to: 'authenticated',
      using: sql`exists (select 1 from public.org_members m2 where m2.org_id = ${t.orgId} and m2.user_id = (select auth.uid()) and m2.role in ('owner','admin'))`,
      withCheck: sql`exists (select 1 from public.org_members m2 where m2.org_id = ${t.orgId} and m2.user_id = (select auth.uid()) and m2.role in ('owner','admin'))`,
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
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))`,
      withCheck: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))`,
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
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
      withCheck: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
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
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('conversations_org_status_idx').on(t.orgId, t.status, t.lastMessageAt),
    index('conversations_customer_idx').on(t.customerId),
    pgPolicy('conversations_org_member_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
      withCheck: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
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
    sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('messages_conversation_idx').on(t.conversationId, t.sentAt),
    pgPolicy('messages_org_member_all', {
      for: 'all',
      to: 'authenticated',
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
      withCheck: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
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
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
      withCheck: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
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
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))`,
      withCheck: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()) and m.role in ('owner','admin'))`,
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
      using: sql`exists (select 1 from public.org_members m where m.org_id = ${t.orgId} and m.user_id = (select auth.uid()))`,
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
