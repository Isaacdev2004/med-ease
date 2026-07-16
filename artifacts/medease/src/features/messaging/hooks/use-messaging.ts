import { useQuery } from '@tanstack/react-query';

import { messagingQueries } from '@/features/messaging/queries/messaging.queries';
import type { MessagingFilters } from '@/services/messaging/types';

export function useMessagingDashboard(facilityId?: string) {
  return useQuery(messagingQueries.dashboard(facilityId));
}

export function useMessagingAnalytics(facilityId?: string) {
  return useQuery(messagingQueries.analytics(facilityId));
}

export function useMessages(filters?: MessagingFilters) {
  return useQuery(messagingQueries.messages(filters));
}

export function useInbox(filters?: MessagingFilters) {
  return useQuery(messagingQueries.inbox(filters));
}

export function useAnnouncements(filters?: MessagingFilters) {
  return useQuery(messagingQueries.announcements(filters));
}

export function useChatThreads(filters?: MessagingFilters) {
  return useQuery(messagingQueries.threads(filters));
}

export function useChatMessages(threadId: string, filters?: MessagingFilters) {
  return useQuery(messagingQueries.chatMessages(threadId, filters));
}

export function useSecureMessages(filters?: MessagingFilters) {
  return useQuery(messagingQueries.secureMessages(filters));
}

export function useBroadcasts(filters?: MessagingFilters) {
  return useQuery(messagingQueries.broadcasts(filters));
}

export function useMessageTemplates(filters?: MessagingFilters) {
  return useQuery(messagingQueries.templates(filters));
}

export function useCampaigns(filters?: MessagingFilters) {
  return useQuery(messagingQueries.campaigns(filters));
}

export function useDeliveries(filters?: MessagingFilters) {
  return useQuery(messagingQueries.deliveries(filters));
}

export function useChannels() {
  return useQuery(messagingQueries.channels());
}

export function useIntegrations() {
  return useQuery(messagingQueries.integrations());
}

export function useMessagingSearch(query: string, filters?: MessagingFilters) {
  return useQuery(messagingQueries.search(query, filters));
}

export function useMessagingFavorites(userId?: string) {
  return useQuery(messagingQueries.favorites(userId));
}
