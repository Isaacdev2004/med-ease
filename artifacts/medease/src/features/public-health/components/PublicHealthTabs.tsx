import { Link, useLocation } from 'wouter';

import type { PublicHealthSection } from '@/features/public-health/components/PublicHealthSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: PublicHealthSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Public Health', path: 'public-health' },
  {
    segment: 'surveillance',
    label: 'Disease Surveillance',
    path: 'disease-surveillance',
  },
  { segment: 'immunizations', label: 'Immunizations', path: 'immunizations' },
  {
    segment: 'community-programs',
    label: 'Community Programs',
    path: 'community-programs',
  },
  { segment: 'sdoh', label: 'SDOH', path: 'sdoh' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Public Health', path: 'public-health' },
  { segment: 'outbreaks', label: 'Outbreaks', path: 'outbreaks' },
  {
    segment: 'contact-tracing',
    label: 'Contact Tracing',
    path: 'contact-tracing',
  },
  {
    segment: 'environmental',
    label: 'Environmental Health',
    path: 'environmental-health',
  },
  {
    segment: 'outreach',
    label: 'Community Outreach',
    path: 'community-outreach',
  },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'hub', label: 'Public Health Hub', path: 'public-health' },
  { segment: 'epidemiology', label: 'Epidemiology', path: 'epidemiology' },
  {
    segment: 'immunization-registry',
    label: 'Immunization Registry',
    path: 'immunization-registry',
  },
  {
    segment: 'maternal-child',
    label: 'Maternal & Child',
    path: 'maternal-child-health',
  },
  { segment: 'school-health', label: 'School Health', path: 'school-health' },
  {
    segment: 'occupational',
    label: 'Occupational Health',
    path: 'occupational-health',
  },
  { segment: 'analytics', label: 'Analytics', path: 'public-health-analytics' },
  {
    segment: 'community-dashboard',
    label: 'Community Dashboard',
    path: 'community-health-dashboard',
  },
];

interface PublicHealthTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: PublicHealthTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function PublicHealthTabs({
  basePath: _basePath,
  variant = 'professional',
}: PublicHealthTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Public health sections"
    >
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
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

export function getPublicHealthSectionFromPath(
  pathname: string,
  variant: 'professional' | 'facility' | 'admin' = 'professional',
): PublicHealthSection {
  if (pathname.includes('/disease-surveillance')) return 'surveillance';
  if (
    pathname.includes('/immunizations') &&
    !pathname.includes('/immunization-registry')
  )
    return 'immunizations';
  if (pathname.includes('/community-programs')) return 'community-programs';
  if (pathname.includes('/community-outreach')) return 'outreach';
  if (pathname.includes('/sdoh')) return 'sdoh';
  if (pathname.includes('/outbreaks')) return 'outbreaks';
  if (pathname.includes('/contact-tracing')) return 'contact-tracing';
  if (pathname.includes('/environmental-health')) return 'environmental';
  if (pathname.includes('/epidemiology')) return 'epidemiology';
  if (pathname.includes('/immunization-registry'))
    return 'immunization-registry';
  if (pathname.includes('/maternal-child-health')) return 'maternal-child';
  if (pathname.includes('/school-health')) return 'school-health';
  if (pathname.includes('/occupational-health')) return 'occupational';
  if (pathname.includes('/public-health-analytics')) return 'analytics';
  if (pathname.includes('/community-health-dashboard'))
    return 'community-dashboard';
  if (
    variant === 'admin' &&
    pathname.includes('/public-health') &&
    !pathname.includes('/public-health-analytics')
  )
    return 'hub';
  return 'dashboard';
}
