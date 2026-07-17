import { computeMessagingAnalytics } from '@/services/messaging/analytics';
import { nextBroadcastStatus } from '@/services/messaging/broadcast-engine';
import { nextCampaignStatus } from '@/services/messaging/campaign-engine';
import { nextMessageStatus } from '@/services/messaging/channel-engine';
import { extractVariables } from '@/services/messaging/template-engine';
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_BROADCASTS,
  MOCK_CAMPAIGNS,
  MOCK_CHANNELS,
  MOCK_CHAT_MESSAGES,
  MOCK_DELIVERIES,
  MOCK_INBOX,
  MOCK_INTEGRATIONS,
  MOCK_MESSAGES,
  MOCK_SECURE_MESSAGES,
  MOCK_TEMPLATES,
  MOCK_THREADS,
  buildMessagingDashboard,
} from '@/services/messaging/mock-data';
import type {
  BroadcastInput,
  CreateCampaignInput,
  CreateTemplateInput,
  MarkReadInput,
  MessagingFavorite,
  MessagingFilters,
  SendMessageInput,
} from '@/services/messaging/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class MessagingRepository {
  private messages = [...MOCK_MESSAGES];
  private inbox = [...MOCK_INBOX];
  private announcements = [...MOCK_ANNOUNCEMENTS];
  private threads = [...MOCK_THREADS];
  private chatMessages = [...MOCK_CHAT_MESSAGES];
  private secureMessages = [...MOCK_SECURE_MESSAGES];
  private broadcasts = [...MOCK_BROADCASTS];
  private templates = [...MOCK_TEMPLATES];
  private campaigns = [...MOCK_CAMPAIGNS];
  private deliveries = [...MOCK_DELIVERIES];
  private favorites: MessagingFavorite[] = [];
  private nextId = 880000;

  dashboard(facilityId?: string) { return buildMessagingDashboard(facilityId); }
  analytics(facilityId?: string) { return computeMessagingAnalytics(facilityId); }

  getMessages(filters?: MessagingFilters) {
    let items = this.messages;
    if (filters?.facilityId) items = items.filter((m) => m.facilityId === filters.facilityId);
    if (filters?.channel) items = items.filter((m) => m.channel === filters.channel);
    if (filters?.status) items = items.filter((m) => m.status === filters.status);
    if (filters?.userId) items = items.filter((m) => m.senderId === filters.userId || m.recipientId === filters.userId);
    if (filters?.q) items = items.filter((m) => matchQ(filters.q, m.subject, m.body));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getMessage(messageId: string) { return this.messages.find((m) => m.messageId === messageId) ?? null; }

  getInbox(filters?: MessagingFilters) {
    let items = this.inbox;
    if (filters?.userId) items = items.filter((i) => i.recipientId === filters.userId);
    if (filters?.channel) items = items.filter((i) => i.channel === filters.channel);
    if (filters?.status === 'unread') items = items.filter((i) => !i.isRead);
    if (filters?.q) items = items.filter((i) => matchQ(filters.q, i.subject, i.preview));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAnnouncements(filters?: MessagingFilters) {
    let items = this.announcements;
    if (filters?.facilityId) items = items.filter((a) => a.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((a) => matchQ(filters.q, a.title, a.body));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getThreads(filters?: MessagingFilters) {
    let items = this.threads;
    if (filters?.facilityId) items = items.filter((t) => t.facilityId === filters.facilityId);
    if (filters?.userId) items = items.filter((t) => t.participantIds.includes(filters.userId!));
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.title));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getChatMessages(threadId: string, filters?: MessagingFilters) {
    let items = this.chatMessages.filter((m) => m.threadId === threadId);
    if (filters?.q) items = items.filter((m) => matchQ(filters.q, m.body));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSecureMessages(filters?: MessagingFilters) {
    let items = this.secureMessages;
    if (filters?.userId) items = items.filter((m) => m.senderId === filters.userId || m.recipientId === filters.userId);
    if (filters?.q) items = items.filter((m) => matchQ(filters.q, m.subject, m.body));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBroadcasts(filters?: MessagingFilters) {
    let items = this.broadcasts;
    if (filters?.facilityId) items = items.filter((b) => b.facilityId === filters.facilityId);
    if (filters?.status) items = items.filter((b) => b.status === filters.status);
    if (filters?.q) items = items.filter((b) => matchQ(filters.q, b.title, b.body));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTemplates(filters?: MessagingFilters) {
    let items = this.templates;
    if (filters?.channel) items = items.filter((t) => t.channel === filters.channel);
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.name, t.subject));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTemplate(templateId: string) { return this.templates.find((t) => t.templateId === templateId) ?? null; }

  getCampaigns(filters?: MessagingFilters) {
    let items = this.campaigns;
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    if (filters?.q) items = items.filter((c) => matchQ(filters.q, c.name, c.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCampaign(campaignId: string) { return this.campaigns.find((c) => c.campaignId === campaignId) ?? null; }

  getDeliveries(filters?: MessagingFilters) {
    let items = this.deliveries;
    if (filters?.channel) items = items.filter((d) => d.channel === filters.channel);
    if (filters?.status) items = items.filter((d) => d.status === filters.status);
    if (filters?.q) items = items.filter((d) => matchQ(filters.q, d.messageId, d.recipientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getChannels() { return MOCK_CHANNELS; }

  getIntegrations() { return MOCK_INTEGRATIONS; }

  send(input: SendMessageInput) {
    const message = {
      messageId: `msg-${this.nextId++}`,
      subject: input.subject,
      body: input.body,
      channel: input.channel,
      status: nextMessageStatus('send'),
      senderId: input.senderId,
      recipientId: input.recipientId,
      facilityId: input.facilityId,
      templateId: input.templateId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.messages.unshift(message);

    const delivery = {
      deliveryId: `dlv-${this.nextId++}`,
      messageId: message.messageId,
      channel: input.channel,
      recipientId: input.recipientId,
      status: nextMessageStatus('deliver'),
      attempts: 1,
      lastAttemptAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
    };
    this.deliveries.unshift(delivery);

    const inboxItem = {
      inboxId: `inb-${this.nextId++}`,
      messageId: message.messageId,
      subject: input.subject,
      preview: input.body.slice(0, 80),
      channel: input.channel,
      senderId: input.senderId,
      recipientId: input.recipientId,
      isRead: false,
      isStarred: false,
      priority: 'normal' as const,
      receivedAt: new Date().toISOString(),
    };
    this.inbox.unshift(inboxItem);

    return message;
  }

  markRead(input: MarkReadInput) {
    const item = this.inbox.find((i) => i.inboxId === input.inboxId && i.recipientId === input.userId);
    if (!item) return null;
    item.isRead = true;
    const msg = this.messages.find((m) => m.messageId === item.messageId);
    if (msg) msg.status = nextMessageStatus('read');
    return item;
  }

  createTemplate(input: CreateTemplateInput) {
    const template = {
      templateId: `tpl-${this.nextId++}`,
      name: input.name,
      subject: input.subject,
      body: input.body,
      channel: input.channel,
      category: input.category,
      variables: input.variables ?? extractVariables(input.body),
      usageCount: 0,
      isActive: true,
      updatedAt: new Date().toISOString(),
    };
    this.templates.unshift(template);
    return template;
  }

  createCampaign(input: CreateCampaignInput) {
    const campaign = {
      campaignId: `cmp-${this.nextId++}`,
      name: input.name,
      description: input.description,
      channels: input.channels,
      templateId: input.templateId,
      status: input.scheduledAt ? 'scheduled' as const : 'draft' as const,
      audienceSize: input.audienceSize,
      sentCount: 0,
      deliveredCount: 0,
      openRate: 0,
      scheduledAt: input.scheduledAt,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    };
    this.campaigns.unshift(campaign);
    return campaign;
  }

  broadcast(input: BroadcastInput) {
    const broadcast = {
      broadcastId: `brc-${this.nextId++}`,
      title: input.title,
      body: input.body,
      channels: input.channels,
      audience: input.audience,
      status: input.scheduledAt ? 'scheduled' as const : nextBroadcastStatus('send'),
      scheduledAt: input.scheduledAt,
      sentAt: input.scheduledAt ? undefined : new Date().toISOString(),
      recipientCount: 0,
      deliveredCount: 0,
      facilityId: input.facilityId,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    };
    this.broadcasts.unshift(broadcast);
    return broadcast;
  }

  startCampaign(campaignId: string) {
    const campaign = this.campaigns.find((c) => c.campaignId === campaignId);
    if (!campaign) return null;
    campaign.status = nextCampaignStatus('start');
    campaign.startedAt = new Date().toISOString();
    return campaign;
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.messages.length };
  }

  favorite(userId: string, entityType: MessagingFavorite['entityType'], entityId: string) {
    if (!this.favorites.some((f) => f.userId === userId && f.entityId === entityId)) {
      this.favorites.push({ userId, entityType, entityId, createdAt: new Date().toISOString() });
    }
    return { userId, entityType, entityId };
  }

  getFavorites(userId: string) { return this.favorites.filter((f) => f.userId === userId); }

  search(query: string, filters?: MessagingFilters) {
    const msgs = this.messages.filter((m) => matchQ(query, m.subject, m.body));
    const tpls = this.templates.filter((t) => matchQ(query, t.name, t.subject));
    return {
      messages: paginate(msgs, filters?.page, filters?.pageSize),
      templates: paginate(tpls, filters?.page, filters?.pageSize),
    };
  }
}

export const messagingRepository = new MessagingRepository();
