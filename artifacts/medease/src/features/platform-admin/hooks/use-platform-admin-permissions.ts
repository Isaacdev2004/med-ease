import { useAuth } from '@/services/auth/auth-context';
import type { PlatformPermissions } from '@/services/platform-admin/types';

export function usePlatformAdminPermissions(): PlatformPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('platform.read'),
    canWrite: permissions.includes('platform.write'),
    canTenants: permissions.includes('platform.tenants'),
    canFacilities: permissions.includes('platform.facilities'),
    canLocalization: permissions.includes('platform.localization'),
    canBranding: permissions.includes('platform.branding'),
    canJobs: permissions.includes('platform.jobs'),
    canHealth: permissions.includes('platform.health'),
    canAudit: permissions.includes('platform.audit'),
    canAdmin: permissions.includes('platform.admin'),
  };
}
