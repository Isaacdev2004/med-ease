import { MessageSquare } from 'lucide-react';

import {
  AnnouncementCard,
  BroadcastPanel,
  CampaignCard,
  ChannelCard,
  ChatPanel,
  DashboardPanel,
  DeliveryTimeline,
  ExportToolbar,
  InboxPanel,
  IntegrationCard,
  MessageCard,
  MessagingAnalyticsPanel,
  SecureMessageCard,
  TemplateCard,
} from '@/features/messaging/components/MessagingComponents';
import {
  useAnnouncements,
  useBroadcasts,
  useCampaigns,
  useChannels,
  useChatMessages,
  useChatThreads,
  useDeliveries,
  useInbox,
  useIntegrations,
  useMessageTemplates,
  useMessages,
  useMessagingAnalytics,
  useMessagingDashboard,
  useSecureMessages,
} from '@/features/messaging/hooks/use-messaging';
import { useMessagingMutations } from '@/features/messaging/mutations/messaging.mutations';
import type { MessagingFilters } from '@/services/messaging/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

export type MessagingSection =
  | 'dashboard'
  | 'inbox'
  | 'announcements'
  | 'broadcasts'
  | 'message-templates'
  | 'message-center'
  | 'channels'
  | 'templates'
  | 'campaigns'
  | 'delivery-tracking'
  | 'messaging-analytics'
  | 'integrations';

interface SectionProps {
  filters?: MessagingFilters;
  variant?: 'professional' | 'facility' | 'admin';
}

export function DashboardSection({ filters }: SectionProps) {
  const dashboard = useMessagingDashboard(filters?.facilityId);
  const messages = useMessages(filters);
  const { exportData, send } = useMessagingMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading messaging dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={MessageSquare} title="No messaging data" />;
  return (
    <div className="space-y-6">
      <DashboardPanel dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(messages.data?.items ?? []).slice(0, 6).map((m) => (
          <MessageCard key={m.messageId} message={m} />
        ))}
      </div>
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
      {(messages.data?.items ?? [])[0] && (
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() =>
            send.mutate({
              subject: 'Test Message',
              body: 'Demo message from messaging dashboard.',
              channel: 'in_app',
              senderId: filters?.userId ?? 'current-user',
              recipientId: 'user-00010',
              facilityId: filters?.facilityId,
            })
          }
        >
          Send test message (demo)
        </button>
      )}
    </div>
  );
}

export function InboxSection({ filters }: SectionProps) {
  const inbox = useInbox({ ...filters, userId: filters?.userId });
  const { markRead } = useMessagingMutations();
  if (inbox.isLoading) return <LoadingView />;
  return (
    <InboxPanel
      items={inbox.data?.items ?? []}
      onMarkRead={(inboxId) =>
        markRead.mutate({ inboxId, userId: filters?.userId ?? 'current-user' })
      }
    />
  );
}

export function AnnouncementsSection({ filters }: SectionProps) {
  const announcements = useAnnouncements(filters);
  if (announcements.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(announcements.data?.items ?? []).map((a) => (
        <AnnouncementCard key={a.announcementId} announcement={a} />
      ))}
    </div>
  );
}

export function BroadcastsSection({ filters }: SectionProps) {
  const broadcasts = useBroadcasts(filters);
  const { broadcast } = useMessagingMutations();
  if (broadcasts.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <BroadcastPanel broadcasts={broadcasts.data?.items ?? []} />
      <button
        type="button"
        className="text-sm text-primary underline"
        onClick={() =>
          broadcast.mutate({
            title: 'Facility Alert',
            body: 'Demo broadcast message.',
            channels: ['email', 'push'],
            audience: 'All Staff',
            facilityId: filters?.facilityId,
            createdBy: filters?.userId ?? 'current-user',
          })
        }
      >
        Send broadcast (demo)
      </button>
    </div>
  );
}

export function MessageTemplatesSection({ filters }: SectionProps) {
  const templates = useMessageTemplates(filters);
  const { createTemplate } = useMessagingMutations();
  if (templates.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(templates.data?.items ?? []).map((t) => (
          <TemplateCard key={t.templateId} template={t} />
        ))}
      </div>
      <button
        type="button"
        className="text-sm text-primary underline"
        onClick={() =>
          createTemplate.mutate({
            name: 'New Template',
            subject: 'Hello {{name}}',
            body: 'Your appointment is on {{date}}.',
            channel: 'email',
            category: 'clinical',
          })
        }
      >
        Create template (demo)
      </button>
    </div>
  );
}

export function MessageCenterSection({ filters }: SectionProps) {
  const threads = useChatThreads(filters);
  const firstThread = threads.data?.items?.[0]?.threadId ?? '';
  const chatMessages = useChatMessages(firstThread);
  const secure = useSecureMessages(filters);
  if (threads.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <ChatPanel
        threads={threads.data?.items ?? []}
        messages={chatMessages.data?.items ?? []}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(secure.data?.items ?? []).slice(0, 6).map((m) => (
          <SecureMessageCard key={m.secureMessageId} message={m} />
        ))}
      </div>
    </div>
  );
}

export function ChannelsSection() {
  const channels = useChannels();
  if (channels.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(channels.data ?? []).map((c) => (
        <ChannelCard key={c.channelId} channel={c} />
      ))}
    </div>
  );
}

export function TemplatesSection({ filters }: SectionProps) {
  return <MessageTemplatesSection filters={filters} />;
}

export function CampaignsSection({ filters }: SectionProps) {
  const campaigns = useCampaigns(filters);
  const { createCampaign, startCampaign } = useMessagingMutations();
  if (campaigns.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(campaigns.data?.items ?? []).map((c) => (
          <CampaignCard key={c.campaignId} campaign={c} />
        ))}
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() =>
            createCampaign.mutate({
              name: 'Outreach Campaign',
              description: 'Demo multi-channel campaign.',
              channels: ['email', 'sms'],
              templateId: 'tpl-001',
              audienceSize: 5000,
              createdBy: filters?.userId ?? 'current-user',
            })
          }
        >
          Create campaign (demo)
        </button>
        {(campaigns.data?.items ?? [])[0] && (
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() =>
              startCampaign.mutate(campaigns.data!.items[0]!.campaignId)
            }
          >
            Start first campaign (demo)
          </button>
        )}
      </div>
    </div>
  );
}

export function DeliveryTrackingSection({ filters }: SectionProps) {
  const deliveries = useDeliveries(filters);
  if (deliveries.isLoading) return <LoadingView />;
  return <DeliveryTimeline deliveries={deliveries.data?.items ?? []} />;
}

export function AnalyticsSection({ filters }: SectionProps) {
  const analytics = useMessagingAnalytics(filters?.facilityId);
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return null;
  return <MessagingAnalyticsPanel analytics={analytics.data} />;
}

export function IntegrationsSection() {
  const integrations = useIntegrations();
  if (integrations.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(integrations.data ?? []).map((i) => (
        <IntegrationCard key={i.integrationId} integration={i} />
      ))}
    </div>
  );
}

export function MessagingSectionContent({
  section,
  filters,
}: {
  section: MessagingSection;
  filters?: MessagingFilters;
  variant?: 'professional' | 'facility' | 'admin';
}) {
  switch (section) {
    case 'inbox':
      return <InboxSection filters={filters} />;
    case 'announcements':
      return <AnnouncementsSection filters={filters} />;
    case 'broadcasts':
      return <BroadcastsSection filters={filters} />;
    case 'message-templates':
      return <MessageTemplatesSection filters={filters} />;
    case 'message-center':
      return <MessageCenterSection filters={filters} />;
    case 'channels':
      return <ChannelsSection />;
    case 'templates':
      return <TemplatesSection filters={filters} />;
    case 'campaigns':
      return <CampaignsSection filters={filters} />;
    case 'delivery-tracking':
      return <DeliveryTrackingSection filters={filters} />;
    case 'messaging-analytics':
      return <AnalyticsSection filters={filters} />;
    case 'integrations':
      return <IntegrationsSection />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
