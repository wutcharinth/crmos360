// Types for mock fixtures + new M1.5 surfaces. These extend the DB schema
// shape from `@crmos360/db` where new surfaces have no migration yet.
// Once migrations land in Phase 5, replace these with the inferred types
// from drizzle and adjust fixtures accordingly.

export type MockChannel =
  | 'line'
  | 'shopee'
  | 'tiktok'
  | 'lazada'
  | 'messenger'
  | 'instagram'
  | 'email';

export type ConversationStatus =
  | 'open'
  | 'pending'
  | 'resolved'
  | 'closed'
  | 'escalated';

export type ConfidenceTier = 'auto' | 'approval' | 'escalate';

export interface MockCustomer {
  id: string;
  orgId: string;
  name: string;
  avatarColor: string; // tailwind utility for avatar bg
  channelIds: Partial<Record<MockChannel, string>>;
  tags: string[];
  vertical: 'commerce' | 'customer-ops' | 'services' | 'b2b';
  memory: MockMemoryEntry[];
}

export interface MockMemoryEntry {
  id: string;
  kind: 'fact' | 'summary' | 'note';
  content: string;
  createdAt: string;
  status?: 'approved' | 'pending'; // for PDPA approval-mode demo
}

export interface MockMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  body: string;
  sentAt: string;
  aiGenerated?: boolean;
  confidence?: number; // 0-1, present on AI-generated messages
  senderName?: string; // for outbound human-sent
}

export interface MockConversation {
  id: string;
  orgId: string;
  customerId: string;
  channel: MockChannel;
  status: ConversationStatus;
  vertical: MockCustomer['vertical'];
  unreadCount: number;
  lastMessageAt: string;
  autoReplyEnabled: boolean;
  confidence: ConfidenceTier; // most recent AI decision
  confidenceScore: number; // 0-1
  assigneeName: string | null;
  messages: MockMessage[];
  // Handoff card payload (only when status === 'escalated')
  handoff?: {
    summary: string[]; // 3 bullets
    reasoning: string;
    suggestedReply: string;
    suggestedConfidence: number;
    relevantMemory: string[]; // IDs of MockMemoryEntry
  };
}

export interface MockLesson {
  id: string;
  orgId: string;
  statement: string;
  reasoning: string;
  sourceConversationId: string | null;
  status: 'pending' | 'approved' | 'rejected';
  suggestedRule: { condition: string; action: string } | null;
  createdAt: string;
  approvedAt: string | null;
  approvedByName: string | null;
}

export interface MockDashboardCluster {
  id: string;
  representativeMessage: string;
  volume: number;
  weekOverWeek: number; // percentage delta
  channels: MockChannel[];
  sampleConversationIds: string[];
}

export interface MockSentimentPoint {
  date: string; // YYYY-MM-DD
  positive: number;
  neutral: number;
  negative: number;
  channel?: MockChannel;
}

export interface MockAutomateNextCandidate {
  id: string;
  trigger: string;
  proposedAction: string;
  confidence: number;
  matchingClusterId?: string;
  estimatedCoverage: number; // percentage of inbound it would handle
}

export interface MockBottleneckCard {
  id: string;
  kind: 'slow-response' | 'after-hours' | 'agent-workload' | 'rule-coverage';
  title: string;
  metric: string;
  delta: string;
  description: string;
}

export interface MockDashboardMetrics {
  recurringQuestions: MockDashboardCluster[];
  sentimentTrend: MockSentimentPoint[];
  automateNext: MockAutomateNextCandidate[];
  bottlenecks: MockBottleneckCard[];
}

export interface MockAdvisorRule {
  id: string;
  orgId: string;
  name: string;
  condition: string; // human-readable pattern
  action: string;
  source: 'cluster' | 'lesson' | 'manual';
  sourceId: string | null;
  status: 'pending' | 'active' | 'disabled';
  confidence: number;
  appliedCount: number;
  lastAppliedAt: string | null;
  sampleMatches: string[]; // sample message bodies that would match
}

export interface MockAuditLogEntry {
  id: string;
  orgId: string;
  actorType: 'ai' | 'user' | 'system';
  actorName: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}
