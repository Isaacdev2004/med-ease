import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { InventorySectionContent } from '@/features/inventory/components/InventorySections';
import {
  InventoryTabs,
  getInventorySectionFromPath,
} from '@/features/inventory/components/InventoryTabs';
import { useInventoryPermissions } from '@/features/inventory/hooks/use-inventory-permissions';
import type {
  InventoryDepartment,
  InventoryFilters,
} from '@/services/inventory/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface InventoryShellProps {
  basePath: string;
  variant?: 'pharmacy' | 'laboratory' | 'radiology' | 'facility' | 'admin';
  title?: string;
  department?: InventoryDepartment;
  warehouseId?: string;
}

export function InventoryShell({
  basePath,
  variant = 'pharmacy',
  title = 'Inventory',
  department: explicitDepartment,
  warehouseId,
}: InventoryShellProps) {
  const [location] = useLocation();
  const perms = useInventoryPermissions();
  const section = getInventorySectionFromPath(location);

  const scopedFilters = useMemo((): InventoryFilters => {
    const department =
      explicitDepartment ??
      (variant === 'pharmacy'
        ? 'pharmacy'
        : variant === 'laboratory'
          ? 'laboratory'
          : variant === 'radiology'
            ? 'radiology'
            : undefined);
    return {
      ...(department ? { department } : {}),
      ...(warehouseId ? { warehouseId } : {}),
    };
  }, [explicitDepartment, variant, warehouseId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view inventory."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise inventory, pharmacy stock, medical supplies, assets, procurement, and warehouse management."
    >
      <div className="space-y-6">
        <InventoryTabs basePath={basePath} variant={variant} />
        <InventorySectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
