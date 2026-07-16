import { useAuth } from '@/services/auth/auth-context';
import type { FinancePermissions } from '@/services/finance/types';

export function useFinancePermissions(): FinancePermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('finance.read'),
    canWrite: permissions.includes('finance.write'),
    canManageGL: permissions.includes('finance.gl'),
    canManageAP: permissions.includes('finance.ap'),
    canManageAR: permissions.includes('finance.ar'),
    canManageCash: permissions.includes('finance.cash'),
    canManageAssets: permissions.includes('finance.assets'),
    canManageBudget: permissions.includes('finance.budget'),
    canViewAnalytics: permissions.includes('finance.analytics'),
    canExport: permissions.includes('finance.export'),
    canShare: permissions.includes('finance.share'),
    canAdmin: permissions.includes('finance.admin'),
  };
}
