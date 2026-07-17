import { useLocation } from 'wouter';

import { InventoryShell } from '@/features/inventory/components/InventoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function FacilityInventoryPage() {
  const [location] = useLocation();
  const segment = location.includes('/assets')
    ? 'assets'
    : location.includes('/warehouse')
      ? 'warehouse'
      : 'inventory';
  const title = location.includes('/assets')
    ? 'Medical Assets'
    : location.includes('/warehouse')
      ? 'Warehouse'
      : 'Facility Inventory';
  return (
    <InventoryShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={title}
    />
  );
}
