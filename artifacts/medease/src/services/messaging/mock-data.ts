import {
  activeCampaignCount,
  campaignOpenRate,
} from '@/services/messaging/campaign-engine';
import { channelHealthScore } from '@/services/messaging/channel-engine';
import {
  avgDeliveryTimeMs,
  bounceRate,
  deliverySuccessRate,
  pendingDeliveryCount,
} from '@/services/messaging/delivery-engine';
import { broadcastsTodayCount } from '@/services/messaging/broadcast-engine';
import { unreadInboxCount } from '@/services/messaging/inbox-engine';
import type {
  Announcement,
  Broadcast,
  Campaign,
  ChannelConfig,
  ChatMessage,
  ChatThread,
  DeliveryRecord,
  InboxItem,
  Integration,
  Message,
  MessageTemplate,
  MessagingAnalytics,
  MessagingDashboard,
  SecureMessage,
} from '@/services/messaging/types';

const SCALE = {
  messages: 300,
  inbox: 150,
  announcements: 40,
  threads: 50,
  templates: 60,
  campaigns: 35,
  deliveries: 400,
  broadcasts: 30,
};
const ENTERPRISE = {
  messages: 12_000_000,
  inbox: 850_000,
  campaigns: 2_400,
  templates: 1_200,
  deliveries: 15_000_000,
  broadcasts: 48_000,
  channels: 7,
};

const CHANNELS = [
  'sms',
  'email',
  'push',
  'whatsapp',
  'teams',
  'slack',
  'in_app',
] as const;
const SUBJECTS = [
  'Appointment Reminder',
  'Lab Results Available',
  'Prescription Ready',
  'Shift Change Notice',
  'Policy Update',
  'Emergency Alert',
  'Patient Discharge Summary',
  'Meeting Invitation',
  'Credential Renewal',
  'Quality Review Required',
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_MESSAGES: Message[] = Array.from(
  { length: SCALE.messages },
  (_, i) => ({
    messageId: `msg-${String(i + 1).padStart(5, '0')}`,
    subject: SUBJECTS[i % SUBJECTS.length]!,
    body: `Message body for ${SUBJECTS[i % SUBJECTS.length]}. Please review and take appropriate action.`,
    channel: CHANNELS[i % CHANNELS.length]!,
    status: (
      ['sent', 'delivered', 'read', 'queued', 'failed', 'bounced'] as const
    )[i % 6]!,
    senderId: `user-${String((i % 20) + 1).padStart(5, '0')}`,
    recipientId: `user-${String((i % 25) + 10).padStart(5, '0')}`,
    facilityId:
      i % 3 === 0 ? `fac-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
    templateId:
      i % 4 === 0 ? `tpl-${String((i % 20) + 1).padStart(3, '0')}` : undefined,
    campaignId:
      i % 5 === 0 ? `cmp-${String((i % 15) + 1).padStart(3, '0')}` : undefined,
    sentAt: i % 6 !== 3 ? daysAgo(i % 14) : undefined,
    deliveredAt: i % 6 <= 2 ? daysAgo(i % 10) : undefined,
    readAt: i % 6 === 2 ? daysAgo(i % 5) : undefined,
    createdAt: daysAgo(i % 21),
  }),
);

export const MOCK_INBOX: InboxItem[] = Array.from(
  { length: SCALE.inbox },
  (_, i) => ({
    inboxId: `inb-${String(i + 1).padStart(5, '0')}`,
    messageId: MOCK_MESSAGES[i % MOCK_MESSAGES.length]!.messageId,
    subject: SUBJECTS[i % SUBJECTS.length]!,
    preview: `Preview text for message ${i + 1}…`,
    channel: CHANNELS[i % CHANNELS.length]!,
    senderId: `user-${String((i % 15) + 1).padStart(5, '0')}`,
    recipientId: `user-${String((i % 10) + 20).padStart(5, '0')}`,
    isRead: i % 3 === 0,
    isStarred: i % 7 === 0,
    priority: (['low', 'normal', 'high', 'urgent'] as const)[i % 4]!,
    receivedAt: daysAgo(i % 14),
  }),
);

export const MOCK_ANNOUNCEMENTS: Announcement[] = Array.from(
  { length: SCALE.announcements },
  (_, i) => ({
    announcementId: `ann-${String(i + 1).padStart(4, '0')}`,
    title: `Announcement ${(i % 15) + 1}: ${SUBJECTS[i % SUBJECTS.length]}`,
    body: `Important facility announcement regarding ${SUBJECTS[i % SUBJECTS.length]!.toLowerCase()}. All staff please review.`,
    authorId: `user-${String((i % 5) + 1).padStart(5, '0')}`,
    facilityId:
      i % 2 === 0 ? `fac-${String((i % 8) + 1).padStart(3, '0')}` : undefined,
    audience: (['all', 'staff', 'patients', 'department'] as const)[i % 4]!,
    department:
      i % 4 === 3
        ? ['Nursing', 'Pharmacy', 'Radiology', 'Admin'][i % 4]
        : undefined,
    priority: (['normal', 'important', 'critical'] as const)[i % 3]!,
    publishedAt: daysAgo(i % 30),
    expiresAt: i % 3 === 0 ? daysAgo(-(i % 14)) : undefined,
    readCount: 50 + i * 12,
  }),
);

export const MOCK_THREADS: ChatThread[] = Array.from(
  { length: SCALE.threads },
  (_, i) => ({
    threadId: `thr-${String(i + 1).padStart(4, '0')}`,
    title: `Thread ${(i % 20) + 1}`,
    participantIds: [
      `user-${String((i % 10) + 1).padStart(5, '0')}`,
      `user-${String((i % 10) + 11).padStart(5, '0')}`,
    ],
    lastMessageAt: daysAgo(i % 7),
    unreadCount: i % 4,
    isSecure: i % 3 === 0,
    facilityId:
      i % 2 === 0 ? `fac-${String((i % 5) + 1).padStart(3, '0')}` : undefined,
  }),
);

export const MOCK_CHAT_MESSAGES: ChatMessage[] = Array.from(
  { length: 200 },
  (_, i) => ({
    chatMessageId: `cht-${String(i + 1).padStart(5, '0')}`,
    threadId: MOCK_THREADS[i % MOCK_THREADS.length]!.threadId,
    senderId: `user-${String((i % 15) + 1).padStart(5, '0')}`,
    body: `Chat message ${i + 1} content.`,
    sentAt: daysAgo(i % 10),
    isRead: i % 2 === 0,
  }),
);

export const MOCK_SECURE_MESSAGES: SecureMessage[] = Array.from(
  { length: 25 },
  (_, i) => ({
    secureMessageId: `sec-${String(i + 1).padStart(4, '0')}`,
    subject: `Secure: ${SUBJECTS[i % SUBJECTS.length]}`,
    body: 'Encrypted message content — PHI protected.',
    senderId: `user-${String((i % 8) + 1).padStart(5, '0')}`,
    recipientId: `user-${String((i % 8) + 10).padStart(5, '0')}`,
    encryptionLevel: (['standard', 'hipaa', 'e2e'] as const)[i % 3]!,
    status: (['sent', 'delivered', 'read'] as const)[i % 3]!,
    expiresAt: daysAgo(-(i % 30)),
    createdAt: daysAgo(i % 14),
  }),
);

export const MOCK_BROADCASTS: Broadcast[] = Array.from(
  { length: SCALE.broadcasts },
  (_, i) => ({
    broadcastId: `brc-${String(i + 1).padStart(4, '0')}`,
    title: `Broadcast ${(i % 12) + 1}`,
    body: `Facility-wide broadcast message ${i + 1}.`,
    channels: [
      CHANNELS[i % CHANNELS.length]!,
      CHANNELS[(i + 1) % CHANNELS.length]!,
    ],
    audience: ['All Staff', 'Nursing Unit', 'Emergency Dept', 'Outpatient'][
      i % 4
    ]!,
    status: (['sent', 'scheduled', 'draft', 'cancelled'] as const)[i % 4]!,
    scheduledAt: i % 4 === 1 ? daysAgo(-(i % 5)) : undefined,
    sentAt: i % 4 === 0 ? daysAgo(i % 7) : undefined,
    recipientCount: 500 + i * 100,
    deliveredCount: 450 + i * 90,
    facilityId: `fac-${String((i % 6) + 1).padStart(3, '0')}`,
    createdBy: `user-${String((i % 5) + 1).padStart(5, '0')}`,
    createdAt: daysAgo(i % 21),
  }),
);

export const MOCK_TEMPLATES: MessageTemplate[] = Array.from(
  { length: SCALE.templates },
  (_, i) => ({
    templateId: `tpl-${String(i + 1).padStart(3, '0')}`,
    name: `Template ${(i % 20) + 1}`,
    subject: SUBJECTS[i % SUBJECTS.length]!,
    body: `Hello {{name}}, your {{event}} is scheduled for {{date}}. {{facility}}`,
    channel: CHANNELS[i % CHANNELS.length]!,
    category: ['clinical', 'operational', 'marketing', 'compliance'][i % 4]!,
    variables: ['name', 'event', 'date', 'facility'],
    usageCount: 100 + i * 25,
    isActive: i % 8 !== 0,
    updatedAt: daysAgo(i % 60),
  }),
);

export const MOCK_CAMPAIGNS: Campaign[] = Array.from(
  { length: SCALE.campaigns },
  (_, i) => ({
    campaignId: `cmp-${String(i + 1).padStart(3, '0')}`,
    name: `Campaign ${(i % 15) + 1}`,
    description: `Multi-channel outreach campaign ${i + 1}`,
    channels: [
      CHANNELS[i % CHANNELS.length]!,
      CHANNELS[(i + 2) % CHANNELS.length]!,
    ],
    templateId: MOCK_TEMPLATES[i % MOCK_TEMPLATES.length]!.templateId,
    status: (
      ['running', 'scheduled', 'completed', 'draft', 'cancelled'] as const
    )[i % 5]!,
    audienceSize: 1000 + i * 500,
    sentCount: 800 + i * 400,
    deliveredCount: 750 + i * 380,
    openRate: 15 + (i % 40),
    scheduledAt: i % 5 === 1 ? daysAgo(-(i % 10)) : undefined,
    startedAt: i % 5 !== 3 ? daysAgo(i % 14) : undefined,
    completedAt: i % 5 === 2 ? daysAgo(i % 7) : undefined,
    createdBy: `user-${String((i % 8) + 1).padStart(5, '0')}`,
    createdAt: daysAgo(i % 30),
  }),
);

export const MOCK_DELIVERIES: DeliveryRecord[] = Array.from(
  { length: SCALE.deliveries },
  (_, i) => ({
    deliveryId: `dlv-${String(i + 1).padStart(5, '0')}`,
    messageId: MOCK_MESSAGES[i % MOCK_MESSAGES.length]!.messageId,
    channel: CHANNELS[i % CHANNELS.length]!,
    recipientId: `user-${String((i % 30) + 1).padStart(5, '0')}`,
    status: (
      ['queued', 'sent', 'delivered', 'read', 'failed', 'bounced'] as const
    )[i % 6]!,
    attempts: 1 + (i % 3),
    lastAttemptAt: daysAgo(i % 5),
    deliveredAt: i % 6 <= 2 ? daysAgo(i % 3) : undefined,
    errorMessage: i % 6 >= 4 ? 'Delivery timeout' : undefined,
  }),
);

export const MOCK_CHANNELS: ChannelConfig[] = CHANNELS.map((channel, i) => ({
  channelId: `chn-${String(i + 1).padStart(3, '0')}`,
  channel,
  name: channel.replace('_', ' ').toUpperCase(),
  provider: [
    'Twilio',
    'SendGrid',
    'Firebase',
    'Meta',
    'Microsoft',
    'Slack',
    'Med-Ease',
  ][i]!,
  health: (
    [
      'healthy',
      'healthy',
      'degraded',
      'healthy',
      'healthy',
      'offline',
      'healthy',
    ] as const
  )[i]!,
  enabled: i !== 5,
  dailyLimit: [5000, 50000, 100000, 10000, 20000, 15000, 200000][i]!,
  sentToday: [1200, 8500, 42000, 2100, 5600, 0, 95000][i]!,
  failureRate: [0.5, 1.2, 0.8, 2.1, 0.3, 0, 0.1][i]!,
  lastCheckedAt: daysAgo(0),
}));

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    integrationId: 'int-001',
    name: 'Twilio SMS',
    provider: 'Twilio',
    channel: 'sms',
    status: 'connected',
    lastSyncAt: daysAgo(0),
  },
  {
    integrationId: 'int-002',
    name: 'SendGrid Email',
    provider: 'SendGrid',
    channel: 'email',
    status: 'connected',
    lastSyncAt: daysAgo(0),
  },
  {
    integrationId: 'int-003',
    name: 'Firebase Push',
    provider: 'Firebase',
    channel: 'push',
    status: 'connected',
    lastSyncAt: daysAgo(1),
  },
  {
    integrationId: 'int-004',
    name: 'WhatsApp Business',
    provider: 'Meta',
    channel: 'whatsapp',
    status: 'connected',
    lastSyncAt: daysAgo(0),
  },
  {
    integrationId: 'int-005',
    name: 'Microsoft Teams',
    provider: 'Microsoft',
    channel: 'teams',
    status: 'connected',
    lastSyncAt: daysAgo(2),
  },
  {
    integrationId: 'int-006',
    name: 'Slack Workspace',
    provider: 'Slack',
    channel: 'slack',
    status: 'error',
    lastSyncAt: daysAgo(5),
  },
];

export function buildMessagingDashboard(
  facilityId?: string,
): MessagingDashboard {
  let messages = MOCK_MESSAGES;
  const inbox = MOCK_INBOX;
  let broadcasts = MOCK_BROADCASTS;
  if (facilityId) {
    messages = messages.filter((m) => m.facilityId === facilityId);
    broadcasts = broadcasts.filter((b) => b.facilityId === facilityId);
  }

  return {
    totalMessages: ENTERPRISE.messages,
    unreadInbox: unreadInboxCount(inbox) * 120,
    activeCampaigns: activeCampaignCount(MOCK_CAMPAIGNS),
    pendingDeliveries: pendingDeliveryCount(MOCK_DELIVERIES) * 50,
    channelHealthScore: channelHealthScore(MOCK_CHANNELS),
    broadcastsToday: broadcastsTodayCount(broadcasts),
    deliveryRate: deliverySuccessRate(MOCK_DELIVERIES),
    messageTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value: 1200 + i * 180,
      }),
    ),
    channelBreakdown: CHANNELS.map((label) => ({
      label,
      value: messages.filter((m) => m.channel === label).length * 800,
    })),
    recentMessages: messages.slice(0, 8),
  };
}

export function computeMessagingAnalytics(
  facilityId?: string,
): MessagingAnalytics {
  const dashboard = buildMessagingDashboard(facilityId);

  return {
    deliveryRate: deliverySuccessRate(MOCK_DELIVERIES),
    openRate: campaignOpenRate(MOCK_CAMPAIGNS),
    clickRate: 12.4,
    bounceRate: bounceRate(MOCK_DELIVERIES),
    avgDeliveryTimeMs: avgDeliveryTimeMs(MOCK_DELIVERIES),
    messagesSentDaily: 18500,
    channelPerformance: CHANNELS.map((label, i) => ({
      label,
      value: 85 + (i % 12),
    })),
    messageTrend: dashboard.messageTrend,
    campaignPerformance: [
      'Q1 Outreach',
      'Patient Reminders',
      'Staff Alerts',
      'Compliance Notices',
    ].map((label, i) => ({
      label,
      value: 70 + i * 8,
    })),
  };
}
