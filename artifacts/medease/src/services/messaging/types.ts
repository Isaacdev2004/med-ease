export type MessageChannel =
  'sms' | 'email' | 'push' | 'whatsapp' | 'teams' | 'slack' | 'in_app';
export type MessageStatus =
  'draft' | 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced';
export type CampaignStatus =
  'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled';
export type BroadcastStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled';
export type ChannelHealth = 'healthy' | 'degraded' | 'offline';

export interface MessagingFilters {
  q?: string;
  tenantId?: string;
  facilityId?: string;
  channel?: MessageChannel;
  status?: string;
  userId?: string;
  recipientId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Message {
  messageId: string;
  subject: string;
  body: string;
  channel: MessageChannel;
  status: MessageStatus;
  senderId: string;
  recipientId: string;
  facilityId?: string;
  templateId?: string;
  campaignId?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface InboxItem {
  inboxId: string;
  messageId: string;
  subject: string;
  preview: string;
  channel: MessageChannel;
  senderId: string;
  recipientId: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  receivedAt: string;
}

export interface Announcement {
  announcementId: string;
  title: string;
  body: string;
  authorId: string;
  facilityId?: string;
  audience: 'all' | 'staff' | 'patients' | 'department';
  department?: string;
  priority: 'normal' | 'important' | 'critical';
  publishedAt: string;
  expiresAt?: string;
  readCount: number;
}

export interface ChatThread {
  threadId: string;
  title: string;
  participantIds: string[];
  lastMessageAt: string;
  unreadCount: number;
  isSecure: boolean;
  facilityId?: string;
}

export interface ChatMessage {
  chatMessageId: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
  isRead: boolean;
}

export interface SecureMessage {
  secureMessageId: string;
  subject: string;
  body: string;
  senderId: string;
  recipientId: string;
  encryptionLevel: 'standard' | 'hipaa' | 'e2e';
  status: MessageStatus;
  expiresAt?: string;
  createdAt: string;
}

export interface Broadcast {
  broadcastId: string;
  title: string;
  body: string;
  channels: MessageChannel[];
  audience: string;
  status: BroadcastStatus;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  deliveredCount: number;
  facilityId?: string;
  createdBy: string;
  createdAt: string;
}

export interface MessageTemplate {
  templateId: string;
  name: string;
  subject: string;
  body: string;
  channel: MessageChannel;
  category: string;
  variables: string[];
  usageCount: number;
  isActive: boolean;
  updatedAt: string;
}

export interface Campaign {
  campaignId: string;
  name: string;
  description: string;
  channels: MessageChannel[];
  templateId: string;
  status: CampaignStatus;
  audienceSize: number;
  sentCount: number;
  deliveredCount: number;
  openRate: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface DeliveryRecord {
  deliveryId: string;
  messageId: string;
  channel: MessageChannel;
  recipientId: string;
  status: MessageStatus;
  attempts: number;
  lastAttemptAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface ChannelConfig {
  channelId: string;
  channel: MessageChannel;
  name: string;
  provider: string;
  health: ChannelHealth;
  enabled: boolean;
  dailyLimit: number;
  sentToday: number;
  failureRate: number;
  lastCheckedAt: string;
}

export interface Integration {
  integrationId: string;
  name: string;
  provider: string;
  channel: MessageChannel;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
}

export interface MessagingDashboard {
  totalMessages: number;
  unreadInbox: number;
  activeCampaigns: number;
  pendingDeliveries: number;
  channelHealthScore: number;
  broadcastsToday: number;
  deliveryRate: number;
  messageTrend: { label: string; value: number }[];
  channelBreakdown: { label: string; value: number }[];
  recentMessages: Message[];
}

export interface MessagingAnalytics {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  avgDeliveryTimeMs: number;
  messagesSentDaily: number;
  channelPerformance: { label: string; value: number }[];
  messageTrend: { label: string; value: number }[];
  campaignPerformance: { label: string; value: number }[];
}

export interface MessagingPermissions {
  canView: boolean;
  canWrite: boolean;
  canSend: boolean;
  canTemplates: boolean;
  canCampaigns: boolean;
  canChannels: boolean;
  canAnalytics: boolean;
  canExport: boolean;
  canAdmin: boolean;
}

export interface MessagingFavorite {
  userId: string;
  entityType: 'message' | 'template' | 'campaign' | 'thread';
  entityId: string;
  createdAt: string;
}

export interface SendMessageInput {
  subject: string;
  body: string;
  channel: MessageChannel;
  senderId: string;
  recipientId: string;
  facilityId?: string;
  templateId?: string;
}

export interface CreateTemplateInput {
  name: string;
  subject: string;
  body: string;
  channel: MessageChannel;
  category: string;
  variables?: string[];
}

export interface CreateCampaignInput {
  name: string;
  description: string;
  channels: MessageChannel[];
  templateId: string;
  audienceSize: number;
  scheduledAt?: string;
  createdBy: string;
}

export interface BroadcastInput {
  title: string;
  body: string;
  channels: MessageChannel[];
  audience: string;
  facilityId?: string;
  createdBy: string;
  scheduledAt?: string;
}

export interface MarkReadInput {
  inboxId: string;
  userId: string;
}
