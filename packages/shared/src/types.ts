export type Channel = 'line' | 'messenger' | 'instagram';

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed';

export type OrgRole = 'owner' | 'admin' | 'agent';

export type MessageDirection = 'inbound' | 'outbound';

export type AiTaskKind =
  | 'reply_suggest'
  | 'summarize'
  | 'sentiment'
  | 'translate'
  | 'escalate_check'
  | 'memory_extract';
