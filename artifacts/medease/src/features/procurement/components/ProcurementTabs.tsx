import { Link, useLocation } from 'wouter';

import type { ProcurementSection } from '@/features/procurement/components/ProcurementSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: ProcurementSection; label: string; path: string };

const PHARMACY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Procurement', path: 'procurement' },
  { segment: 'purchase-orders', label: 'Purchase Orders', path: 'purchase-orders' },
  { segment: 'suppliers', label: 'Suppliers', path: 'suppliers' },
];

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Procurement', path: 'procurement' },
  { segment: 'requests', label: 'Requests', path: 'requests' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Procurement', path: 'procurement' },
  { segment: 'receiving', label: 'Receiving', path: 'receiving' },
  { segment: 'deliveries', label: 'Deliveries', path: 'deliveries' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Dashboard', path: 'procurement' },
  { segment: 'purchase-orders', label: 'Purchase Orders', path: 'purchase-orders' },
  { segment: 'rfqs', label: 'RFQs', path: 'rfqs' },
  { segment: 'contracts', label: 'Contracts', path: 'contracts' },
  { segment: 'suppliers', label: 'Suppliers', path: 'suppliers' },
  { segment: 'budgets', label: 'Budgets', path: 'budgets' },
  { segment: 'approvals', label: 'Approvals', path: 'approvals' },
  { segment: 'analytics', label: 'Analytics', path: 'analytics' },
];

interface ProcurementTabsProps {
  basePath: string;
  variant?: 'pharmacy' | 'professional' | 'facility' | 'admin';
}

function getTabs(variant: ProcurementTabsProps['variant']) {
  if (variant === 'professional') return PROFESSIONAL_TABS;
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PHARMACY_TABS;
}

export function ProcurementTabs({ basePath: _basePath, variant = 'pharmacy' }: ProcurementTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Procurement sections">
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link key={tab.label} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getProcurementSectionFromPath(pathname: string): ProcurementSection {
  if (pathname.includes('/purchase-orders')) return 'purchase-orders';
  if (pathname.includes('/suppliers')) return 'suppliers';
  if (pathname.includes('/requests')) return 'requests';
  if (pathname.includes('/receiving')) return 'receiving';
  if (pathname.includes('/deliveries')) return 'deliveries';
  if (pathname.includes('/rfqs')) return 'rfqs';
  if (pathname.includes('/contracts')) return 'contracts';
  if (pathname.includes('/budgets')) return 'budgets';
  if (pathname.includes('/approvals')) return 'approvals';
  if (pathname.includes('/analytics')) return 'analytics';
  return 'dashboard';
}
