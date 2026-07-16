import { useAuth } from '@/services/auth/auth-context';
import type { ApiPlatformPermissions } from '@/services/api-platform/types';

export function useApiPlatformPermissions(): ApiPlatformPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('api.read'),
    canWrite: permissions.includes('api.write'),
    canKeys: permissions.includes('api.keys'),
    canOAuth: permissions.includes('api.oauth'),
    canWebhooks: permissions.includes('api.webhooks'),
    canSdk: permissions.includes('api.sdk'),
    canAnalytics: permissions.includes('api.analytics'),
    canMarketplace: permissions.includes('api.marketplace'),
    canAdmin: permissions.includes('api.admin'),
  };
}
