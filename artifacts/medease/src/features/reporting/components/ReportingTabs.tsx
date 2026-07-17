import { Link, useLocation } from 'wouter';

import type { ReportingSection } from '@/features/reporting/components/ReportingSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: ReportingSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Reports', path: 'reports' },
  { segment: 'my-reports', label: 'My Reports', path: 'my-reports' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Reports', path: 'reports' },
  {
    segment: 'scheduled-reports',
    label: 'Scheduled',
    path: 'scheduled-reports',
  },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Reports', path: 'reports' },
  { segment: 'report-designer', label: 'Designer', path: 'report-designer' },
  { segment: 'report-library', label: 'Library', path: 'report-library' },
  { segment: 'report-schedules', label: 'Schedules', path: 'report-schedules' },
  { segment: 'report-exports', label: 'Exports', path: 'report-exports' },
  { segment: 'report-analytics', label: 'Analytics', path: 'report-analytics' },
  {
    segment: 'compliance-reports',
    label: 'Compliance',
    path: 'compliance-reports',
  },
];

interface ReportingTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: ReportingTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function ReportingTabs({
  basePath: _basePath,
  variant = 'professional',
}: ReportingTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Reporting sections"
    >
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link
            key={tab.path}
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

const PATH_MAP: [string, ReportingSection][] = [
  ['/compliance-reports', 'compliance-reports'],
  ['/report-analytics', 'report-analytics'],
  ['/report-exports', 'report-exports'],
  ['/report-schedules', 'report-schedules'],
  ['/report-library', 'report-library'],
  ['/report-designer', 'report-designer'],
  ['/scheduled-reports', 'scheduled-reports'],
  ['/my-reports', 'my-reports'],
];

export function getReportingSectionFromPath(
  pathname: string,
): ReportingSection {
  for (const [path, section] of PATH_MAP) {
    if (pathname.includes(path)) return section;
  }
  return 'dashboard';
}
