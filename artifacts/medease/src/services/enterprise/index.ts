import { useApiAuth } from '@/services/auth/auth-service';
import { createEnterpriseLiveRepository } from '@/services/enterprise/live-repository';
import { httpTransport } from '@workspace/repository-transport';

/**
 * Split a mock repository into mock (demo) vs live enterprise HTTP (API mode).
 * Call from each module's repository.ts after moving the mock class export.
 */
export function bindEnterpriseRepository<T extends object>(
  module: string,
  mockRepository: T,
): T {
  return useApiAuth
    ? createEnterpriseLiveRepository(module, mockRepository)
    : mockRepository;
}

export async function fetchNotifications(filters?: {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}) {
  return httpTransport.get('/api/notifications', {
    query: filters as Record<string, string | number | boolean | undefined>,
  });
}

export async function markNotificationRead(id: string) {
  return httpTransport.post(`/api/notifications/${id}/read`, { body: {} });
}

export async function markAllNotificationsRead() {
  return httpTransport.post('/api/notifications/read-all', { body: {} });
}

export async function fetchPreferences() {
  return httpTransport.get('/api/settings/preferences');
}

export async function savePreferences(preferences: Record<string, unknown>) {
  return httpTransport.put('/api/settings/preferences', {
    body: { preferences },
  });
}
