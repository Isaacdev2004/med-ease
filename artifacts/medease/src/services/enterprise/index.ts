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
  try {
    return await httpTransport.get('/api/notifications', {
      query: filters as Record<string, string | number | boolean | undefined>,
    });
  } catch {
    // Soft-fail: bell should not break portal when auth/permission races.
    return { items: [], total: 0, page: 1, pageSize: filters?.pageSize ?? 100 };
  }
}

export async function markNotificationRead(id: string) {
  try {
    return await httpTransport.post(`/api/notifications/${id}/read`, {
      body: {},
    });
  } catch {
    return null;
  }
}

export async function markAllNotificationsRead() {
  try {
    return await httpTransport.post('/api/notifications/read-all', {
      body: {},
    });
  } catch {
    return null;
  }
}

export async function fetchPreferences() {
  return httpTransport.get('/api/settings/preferences');
}

export async function savePreferences(preferences: Record<string, unknown>) {
  return httpTransport.put('/api/settings/preferences', {
    body: { preferences },
  });
}
