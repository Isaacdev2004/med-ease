import { useAuth } from '@/services/auth/auth-context';
import type { ReportPermissions } from '@/services/reporting/types';

export function useReportingPermissions(): ReportPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('reporting.read'),
    canWrite: permissions.includes('reporting.write'),
    canDesign: permissions.includes('reporting.design'),
    canSchedule: permissions.includes('reporting.schedule'),
    canExport: permissions.includes('reporting.export'),
    canAnalytics: permissions.includes('reporting.analytics'),
    canAdmin: permissions.includes('reporting.admin'),
  };
}
