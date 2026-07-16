import { useAuth } from '@/services/auth/auth-context';
import type { CdssPermissions } from '@/services/cdss/types';

export function useCdssPermissions(): CdssPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('cdss.read'),
    canWrite: permissions.includes('cdss.write'),
    canManageAlerts: permissions.includes('cdss.alerts'),
    canManageGuidelines: permissions.includes('cdss.guidelines'),
    canManageProtocols: permissions.includes('cdss.protocols'),
    canManageOrderSets: permissions.includes('cdss.orderSets'),
    canViewAnalytics: permissions.includes('cdss.analytics'),
    canExport: permissions.includes('cdss.export'),
    canShare: permissions.includes('cdss.share'),
    canAdmin: permissions.includes('cdss.admin'),
  };
}
