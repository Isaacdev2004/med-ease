import { useAuth } from '@/services/auth/auth-context';
import type { WorkforcePermissions } from '@/services/workforce/types';

export function useWorkforcePermissions(): WorkforcePermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('workforce.read'),
    canWrite: permissions.includes('workforce.write'),
    canSchedule: permissions.includes('workforce.schedule'),
    canManageAttendance: permissions.includes('workforce.attendance'),
    canManageTraining: permissions.includes('workforce.training'),
    canManagePerformance: permissions.includes('workforce.performance'),
    canManagePayroll: permissions.includes('workforce.payroll'),
    canViewAnalytics: permissions.includes('workforce.analytics'),
    canExport: permissions.includes('workforce.export'),
    canShare: permissions.includes('workforce.share'),
    canAdmin: permissions.includes('workforce.admin'),
  };
}
