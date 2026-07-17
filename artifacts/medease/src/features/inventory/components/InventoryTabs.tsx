import { Link, useLocation } from 'wouter';

import type { InventorySection } from '@/features/inventory/components/InventorySections';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: InventorySection; label: string; path: string };

const PHARMACY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Dashboard', path: 'inventory' },
  { segment: 'stock', label: 'Stock', path: 'stock' },
  { segment: 'expiry', label: 'Expiry', path: 'expiry' },
];

const LAB_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Inventory', path: 'laboratory/inventory' },
  { segment: 'reagents', label: 'Reagents', path: 'laboratory/reagents' },
  {
    segment: 'consumables',
    label: 'Consumables',
    path: 'laboratory/consumables',
  },
];

const RAD_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Inventory', path: 'radiology/inventory' },
  { segment: 'equipment', label: 'Equipment', path: 'radiology/equipment' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Inventory', path: 'inventory' },
  { segment: 'assets', label: 'Assets', path: 'assets' },
  { segment: 'warehouse', label: 'Warehouse', path: 'warehouse' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Inventory', path: 'inventory' },
  { segment: 'assets', label: 'Assets', path: 'assets' },
  { segment: 'analytics', label: 'Analytics', path: 'inventory-analytics' },
];

interface InventoryTabsProps {
  basePath: string;
  variant?: 'pharmacy' | 'laboratory' | 'radiology' | 'facility' | 'admin';
}

function getTabs(variant: InventoryTabsProps['variant']) {
  if (variant === 'laboratory') return LAB_TABS;
  if (variant === 'radiology') return RAD_TABS;
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PHARMACY_TABS;
}

function portalRoot(basePath: string, variant: InventoryTabsProps['variant']) {
  const tabs = getTabs(variant);
  const patterns = tabs.map((t) => t.path.split('/').pop()!).join('|');
  const regex = new RegExp(`/(${patterns.replace(/\//g, '|')})$`);
  return basePath
    .replace(regex, '')
    .replace(
      /\/(laboratory\/inventory|laboratory\/reagents|laboratory\/consumables|radiology\/inventory|radiology\/equipment)$/,
      (m) => m.slice(0, m.lastIndexOf('/')),
    );
}

export function InventoryTabs({
  basePath,
  variant = 'pharmacy',
}: InventoryTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);
  const root = portalRoot(basePath, variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Inventory sections"
    >
      {tabs.map((tab) => {
        const href = `${root}/${tab.path}`;
        const active = location.includes(`/${tab.path}`);
        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getInventorySectionFromPath(
  pathname: string,
): InventorySection {
  if (pathname.includes('/stock')) return 'stock';
  if (pathname.includes('/expiry')) return 'expiry';
  if (pathname.includes('/purchase-orders')) return 'purchase-orders';
  if (pathname.includes('/reagents')) return 'reagents';
  if (pathname.includes('/consumables')) return 'consumables';
  if (pathname.includes('/equipment')) return 'equipment';
  if (pathname.includes('/assets')) return 'assets';
  if (pathname.includes('/warehouse')) return 'warehouse';
  if (pathname.includes('/procurement')) return 'procurement';
  if (pathname.includes('/suppliers')) return 'suppliers';
  if (pathname.includes('/inventory-analytics')) return 'analytics';
  if (pathname.includes('/transfers')) return 'transfers';
  if (pathname.includes('/forecast')) return 'forecast';
  return 'dashboard';
}
