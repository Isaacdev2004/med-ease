import { Link, useLocation } from 'wouter';

import type { FacilitiesSection } from '@/features/facilities/components/FacilitiesSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: FacilitiesSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Facilities', path: 'facilities' },
  { segment: 'equipment', label: 'Equipment', path: 'equipment' },
  { segment: 'maintenance', label: 'Maintenance', path: 'maintenance' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Dashboard', path: 'facilities' },
  { segment: 'buildings', label: 'Buildings', path: 'buildings' },
  { segment: 'assets', label: 'Assets', path: 'facility-assets' },
  { segment: 'maintenance', label: 'Maintenance', path: 'maintenance' },
  { segment: 'utilities', label: 'Utilities', path: 'utilities' },
  { segment: 'environment', label: 'Environment', path: 'environment' },
  { segment: 'housekeeping', label: 'Housekeeping', path: 'housekeeping' },
  { segment: 'fleet', label: 'Fleet', path: 'fleet' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Facilities', path: 'facilities' },
  { segment: 'buildings', label: 'Buildings', path: 'buildings' },
  { segment: 'assets', label: 'Assets', path: 'facilities-assets' },
  { segment: 'workOrders', label: 'Work Orders', path: 'work-orders' },
  { segment: 'calibration', label: 'Calibration', path: 'calibration' },
  { segment: 'vendors', label: 'Vendors', path: 'vendors' },
  { segment: 'contracts', label: 'Contracts', path: 'contracts' },
  { segment: 'analytics', label: 'Analytics', path: 'facilities-analytics' },
  { segment: 'systemHealth', label: 'System Health', path: 'system-health' },
];

interface FacilitiesTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: FacilitiesTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function FacilitiesTabs({ basePath, variant = 'professional' }: FacilitiesTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Facilities sections">
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

export function getFacilitiesSectionFromPath(pathname: string): FacilitiesSection {
  if (pathname.includes('/equipment')) return 'equipment';
  if (pathname.includes('/buildings')) return 'buildings';
  if (pathname.includes('/facility-assets') || pathname.includes('/facilities-assets')) return 'assets';
  if (pathname.includes('/maintenance') || pathname.includes('/work-orders')) return pathname.includes('/work-orders') ? 'workOrders' : 'maintenance';
  if (pathname.includes('/utilities')) return 'utilities';
  if (pathname.includes('/environment')) return 'environment';
  if (pathname.includes('/housekeeping')) return 'housekeeping';
  if (pathname.includes('/fleet')) return 'fleet';
  if (pathname.includes('/calibration')) return 'calibration';
  if (pathname.includes('/vendors')) return 'vendors';
  if (pathname.includes('/contracts')) return 'contracts';
  if (pathname.includes('/facilities-analytics')) return 'analytics';
  if (pathname.includes('/system-health')) return 'systemHealth';
  return 'dashboard';
}
