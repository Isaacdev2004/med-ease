import { useAuth } from '@/services/auth/auth-context';
import type { ExecutivePermissions } from '@/services/executive/types';

export function useExecutivePermissions(): ExecutivePermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('executive.read'),
    canWrite: permissions.includes('executive.write'),
    canKpis: permissions.includes('executive.kpis'),
    canOperations: permissions.includes('executive.operations'),
    canCapacity: permissions.includes('executive.capacity'),
    canAnalytics: permissions.includes('executive.analytics'),
    canBenchmarking: permissions.includes('executive.benchmarking'),
    canForecasting: permissions.includes('executive.forecasting'),
    canExport: permissions.includes('executive.export'),
    canShare: permissions.includes('executive.share'),
    canAdmin: permissions.includes('executive.admin'),
  };
}
