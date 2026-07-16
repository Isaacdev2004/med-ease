import { useAuth } from '@/services/auth/auth-context';
import type { InventoryPermissions } from '@/services/inventory/types';

export function useInventoryPermissions(): InventoryPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('inventory.read'),
    canWrite: permissions.includes('inventory.write'),
    canProcure: permissions.includes('inventory.procurement'),
    canReceive: permissions.includes('inventory.receive'),
    canIssue: permissions.includes('inventory.issue'),
    canTransfer: permissions.includes('inventory.transfer'),
    canAudit: permissions.includes('inventory.audit'),
    canViewAnalytics: permissions.includes('inventory.analytics'),
    canExport: permissions.includes('inventory.export'),
    canAdmin: permissions.includes('inventory.admin'),
  };
}
