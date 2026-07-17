export { messagingService } from '@/services/messaging/messaging.service';
export { messagingRepository } from '@/services/messaging/repository';
export { messagingOfflineQueue } from '@/services/messaging/offline-sync';
export {
  computeMessagingAnalytics,
  buildMessagingDashboard,
} from '@/services/messaging/analytics';
export {
  MOCK_MESSAGES,
  MOCK_INBOX,
  MOCK_ANNOUNCEMENTS,
  MOCK_THREADS,
  MOCK_CHAT_MESSAGES,
  MOCK_SECURE_MESSAGES,
  MOCK_BROADCASTS,
  MOCK_TEMPLATES,
  MOCK_CAMPAIGNS,
  MOCK_DELIVERIES,
  MOCK_CHANNELS,
  MOCK_INTEGRATIONS,
} from '@/services/messaging/mock-data';
