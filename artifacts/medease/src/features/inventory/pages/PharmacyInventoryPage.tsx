import { useLocation } from 'wouter';

import { InventoryShell } from '@/features/inventory/components/InventoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function resolvePath(location: string, segment: string) {
  return resolveModuleBasePath(location, segment);
}

function titleFor(location: string) {
  if (location.includes('/stock')) return 'Pharmacy Stock';
  if (location.includes('/expiry')) return 'Expiry Alerts';
  if (location.includes('/purchase-orders')) return 'Purchase Orders';
  return 'Pharmacy Inventory';
}

export default function PharmacyInventoryPage() {
  const [location] = useLocation();
  const segment = location.includes('/stock')
    ? 'stock'
    : location.includes('/expiry')
      ? 'expiry'
      : location.includes('/purchase-orders')
        ? 'purchase-orders'
        : 'inventory';
  return (
    <InventoryShell
      basePath={resolvePath(location, segment)}
      variant="pharmacy"
      title={titleFor(location)}
      department="pharmacy"
    />
  );
}
