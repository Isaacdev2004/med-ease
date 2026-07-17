import { useLocation } from 'wouter';

import { InventoryShell } from '@/features/inventory/components/InventoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function RadiologyInventoryPage() {
  const [location] = useLocation();
  const segment = location.includes('/equipment')
    ? 'radiology/equipment'
    : 'radiology/inventory';
  const title = location.includes('/equipment')
    ? 'Imaging Equipment'
    : 'Radiology Inventory';
  return (
    <InventoryShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="radiology"
      title={title}
      department="radiology"
    />
  );
}
