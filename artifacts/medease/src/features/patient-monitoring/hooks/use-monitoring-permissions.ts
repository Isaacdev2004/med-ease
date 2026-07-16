import { useAuth } from '@/services/auth/auth-context';
import type { MonitoringPermissions } from '@/services/patient-monitoring/types';

export function useMonitoringPermissions(): MonitoringPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('monitoring.read'),
    canWrite: permissions.includes('monitoring.write'),
    canManageAlerts: permissions.includes('monitoring.alerts'),
    canManageDevices: permissions.includes('monitoring.devices'),
    canViewAnalytics: permissions.includes('monitoring.analytics'),
    canExport: permissions.includes('monitoring.export'),
    canShare: permissions.includes('monitoring.share'),
    canAdmin: permissions.includes('monitoring.admin'),
    canManageRpm: permissions.includes('monitoring.rpm'),
  };
}
