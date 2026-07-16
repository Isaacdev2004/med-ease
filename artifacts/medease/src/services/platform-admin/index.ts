export { platformAdminService } from '@/services/platform-admin/platform-admin.service';
export { platformAdminRepository } from '@/services/platform-admin/repository';
export { platformAdminOfflineQueue } from '@/services/platform-admin/offline-sync';
export { computePlatformAnalytics, buildPlatformDashboard } from '@/services/platform-admin/analytics';
export {
  MOCK_TENANTS,
  MOCK_HOSPITALS,
  MOCK_FACILITIES,
  MOCK_DEPARTMENTS,
  MOCK_LOCALIZATION,
  MOCK_BRANDING,
  MOCK_LICENSES,
  MOCK_SUBSCRIPTIONS,
  MOCK_STORAGE,
  MOCK_FEATURE_FLAGS,
  MOCK_SYSTEM_JOBS,
  MOCK_WORKERS,
  MOCK_QUEUES,
  MOCK_SYSTEM_HEALTH,
  MOCK_BACKUPS,
  MOCK_MAINTENANCE,
  MOCK_PLATFORM_AUDITS,
  MOCK_EMAIL_SERVERS,
  MOCK_SMS_SERVERS,
} from '@/services/platform-admin/mock-data';
