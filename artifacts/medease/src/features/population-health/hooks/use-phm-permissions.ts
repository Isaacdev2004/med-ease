import { useAuth } from '@/services/auth/auth-context';
import type { PhmPermissions } from '@/services/population-health/types';

export function usePhmPermissions(): PhmPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('phm.read'),
    canWrite: permissions.includes('phm.write'),
    canManageRegistries: permissions.includes('phm.registries'),
    canManageGaps: permissions.includes('phm.gaps'),
    canManageRisk: permissions.includes('phm.risk'),
    canManageCohorts: permissions.includes('phm.cohorts'),
    canManageOutreach: permissions.includes('phm.outreach'),
    canViewAnalytics: permissions.includes('phm.analytics'),
    canExport: permissions.includes('phm.export'),
    canShare: permissions.includes('phm.share'),
    canAdmin: permissions.includes('phm.admin'),
  };
}
