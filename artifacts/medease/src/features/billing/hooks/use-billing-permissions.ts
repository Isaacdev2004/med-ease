import { useAuth } from '@/services/auth/auth-context';
import type { BillingPermissions } from '@/services/billing/types';

export function useBillingPermissions(): BillingPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('billing.read'),
    canWrite: permissions.includes('billing.write'),
    canManageClaims: permissions.includes('billing.claims'),
    canRecordPayments: permissions.includes('billing.payments'),
    canRefund: permissions.includes('billing.refunds'),
    canViewAnalytics: permissions.includes('billing.analytics'),
    canExport: permissions.includes('billing.export'),
    canAdmin: permissions.includes('billing.admin'),
  };
}
