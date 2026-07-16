import { useAuth } from '@/services/auth/auth-context';
import type { ProcurementPermissions } from '@/services/procurement/types';

export function useProcurementPermissions(): ProcurementPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('procurement.read'),
    canWrite: permissions.includes('procurement.write'),
    canApprove: permissions.includes('procurement.approve'),
    canManagePOs: permissions.includes('procurement.purchaseOrders'),
    canManageRFQ: permissions.includes('procurement.rfq'),
    canManageContracts: permissions.includes('procurement.contracts'),
    canManageSuppliers: permissions.includes('procurement.suppliers'),
    canViewAnalytics: permissions.includes('procurement.analytics'),
    canExport: permissions.includes('procurement.export'),
    canAdmin: permissions.includes('procurement.admin'),
  };
}
