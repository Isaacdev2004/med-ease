import { Link, useLocation } from 'wouter';

import type { PhmSection } from '@/features/population-health/components/PhmSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: PhmSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Population', path: 'phm' },
  { segment: 'care-gaps', label: 'Care Gaps', path: 'care-gaps' },
  { segment: 'registries', label: 'Registries', path: 'registries' },
  { segment: 'high-risk', label: 'High Risk', path: 'high-risk-patients' },
  { segment: 'outreach', label: 'Outreach', path: 'outreach' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Population Health', path: 'phm' },
  { segment: 'programs', label: 'Programs', path: 'phm-programs' },
  { segment: 'registries', label: 'Registries', path: 'registries' },
  { segment: 'community-health', label: 'Community Health', path: 'community-health' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'analytics', label: 'Analytics', path: 'phm-analytics' },
  { segment: 'quality-measures', label: 'Quality Measures', path: 'quality-measures' },
  { segment: 'population-risk', label: 'Population Risk', path: 'population-risk' },
  { segment: 'executive', label: 'Executive', path: 'phm-executive' },
  { segment: 'campaigns', label: 'Campaigns', path: 'campaigns' },
];

interface PhmTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: PhmTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function PhmTabs({ basePath, variant = 'professional' }: PhmTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Population health sections">
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

export function getPhmSectionFromPath(pathname: string): PhmSection {
  if (pathname.includes('/care-gaps')) return 'care-gaps';
  if (pathname.includes('/high-risk-patients')) return 'high-risk';
  if (pathname.includes('/outreach')) return 'outreach';
  if (pathname.includes('/phm-programs')) return 'programs';
  if (pathname.includes('/community-health')) return 'community-health';
  if (pathname.includes('/phm-analytics')) return 'analytics';
  if (pathname.includes('/quality-measures')) return 'quality-measures';
  if (pathname.includes('/population-risk')) return 'population-risk';
  if (pathname.includes('/phm-executive')) return 'executive';
  if (pathname.includes('/campaigns')) return 'campaigns';
  if (pathname.includes('/registries')) return 'registries';
  return 'dashboard';
}
