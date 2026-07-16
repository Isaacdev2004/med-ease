import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { messagingService } from '@/services/messaging/messaging.service';
import type { MessagingFilters } from '@/services/messaging/types';

export const messagingQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.messaging.dashboard(facilityId),
    queryFn: () => messagingService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.messaging.analytics(facilityId),
    queryFn: () => messagingService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  messages: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.messages(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getMessages(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  message: (messageId: string) => ({
    queryKey: queryKeys.messaging.message(messageId),
    queryFn: () => messagingService.getMessage(messageId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(messageId),
  }),
  inbox: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.inbox(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getInbox(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  announcements: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.announcements(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getAnnouncements(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  threads: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.threads(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getThreads(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  chatMessages: (threadId: string, filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.chatMessages(threadId, filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getChatMessages(threadId, filters),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(threadId),
  }),
  secureMessages: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.secureMessages(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getSecureMessages(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  broadcasts: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.broadcasts(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getBroadcasts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  templates: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.templates(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getTemplates(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  template: (templateId: string) => ({
    queryKey: queryKeys.messaging.template(templateId),
    queryFn: () => messagingService.getTemplate(templateId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(templateId),
  }),
  campaigns: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.campaigns(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getCampaigns(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  campaign: (campaignId: string) => ({
    queryKey: queryKeys.messaging.campaign(campaignId),
    queryFn: () => messagingService.getCampaign(campaignId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(campaignId),
  }),
  deliveries: (filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.deliveries(filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.getDeliveries(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  channels: () => ({
    queryKey: queryKeys.messaging.channels(),
    queryFn: () => messagingService.getChannels(),
    staleTime: CACHE_TIMES.patientList,
  }),
  integrations: () => ({
    queryKey: queryKeys.messaging.integrations(),
    queryFn: () => messagingService.getIntegrations(),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, filters?: MessagingFilters) => ({
    queryKey: queryKeys.messaging.search(query, filters as Record<string, unknown> | undefined),
    queryFn: () => messagingService.search(query, filters),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.messaging.favorites(userId),
    queryFn: () => messagingService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
