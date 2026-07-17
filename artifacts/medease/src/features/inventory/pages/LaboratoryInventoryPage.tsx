import { useLocation } from 'wouter';

import { InventoryShell } from '@/features/inventory/components/InventoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function LaboratoryInventoryPage() {
  const [location] = useLocation();
  const segment = location.includes('/reagents')
    ? 'laboratory/reagents'
    : location.includes('/consumables')
      ? 'laboratory/consumables'
      : 'laboratory/inventory';
  const title = location.includes('/reagents')
    ? 'Lab Reagents'
    : location.includes('/consumables')
      ? 'Lab Consumables'
      : 'Laboratory Inventory';
  return (
    <InventoryShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="laboratory"
      title={title}
      department="laboratory"
    />
  );
}
