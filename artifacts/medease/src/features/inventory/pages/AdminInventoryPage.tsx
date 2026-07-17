import { useLocation } from 'wouter';

import { InventoryShell } from '@/features/inventory/components/InventoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function AdminInventoryPage() {
  const [location] = useLocation();
  const segment = location.includes('/assets')
    ? 'assets'
    : location.includes('/inventory-analytics')
      ? 'analytics'
      : 'inventory';
  const titles: Record<string, string> = {
    assets: 'Assets',
    analytics: 'Inventory Analytics',
    inventory: 'Inventory',
  };
  return (
    <InventoryShell
      basePath={resolveModuleBasePath(
        location,
        segment === 'analytics' ? 'inventory-analytics' : segment,
      )}
      variant="admin"
      title={titles[segment] ?? 'Inventory'}
    />
  );
}
