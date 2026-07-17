import { Link, useLocation } from 'wouter';

import type { ExecutiveSection } from '@/features/executive/components/ExecutiveSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: ExecutiveSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Executive', path: 'executive' },
  { segment: 'department', label: 'Department Dashboard', path: 'department-dashboard' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Executive', path: 'executive' },
  { segment: 'operations', label: 'Operations Center', path: 'operations-center' },
  { segment: 'capacity', label: 'Capacity', path: 'capacity' },
  { segment: 'patient-flow', label: 'Patient Flow', path: 'patient-flow' },
  { segment: 'scorecards', label: 'Scorecards', path: 'executive-scorecards' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'hub', label: 'Executive Hub', path: 'executive' },
  { segment: 'enterprise-dashboard', label: 'Enterprise Dashboard', path: 'enterprise-dashboard' },
  { segment: 'enterprise-kpis', label: 'Enterprise KPIs', path: 'enterprise-kpis' },
  { segment: 'benchmarking', label: 'Benchmarking', path: 'benchmarking' },
  { segment: 'strategic-initiatives', label: 'Strategic Initiatives', path: 'strategic-initiatives' },
  { segment: 'analytics', label: 'Executive Analytics', path: 'executive-analytics' },
  { segment: 'forecasting', label: 'Forecasting', path: 'executive-forecasting' },
  { segment: 'alerts', label: 'Enterprise Alerts', path: 'enterprise-alerts' },
];

interface CommandCenterTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: CommandCenterTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function CommandCenterTabs({ basePath: _basePath, variant = 'professional' }: CommandCenterTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Executive sections">
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

export function getExecutiveSectionFromPath(pathname: string, variant: 'professional' | 'facility' | 'admin' = 'professional'): ExecutiveSection {
  if (pathname.includes('/department-dashboard')) return 'department';
  if (pathname.includes('/operations-center')) return 'operations';
  if (pathname.includes('/patient-flow')) return 'patient-flow';
  if (pathname.includes('/executive-scorecards')) return 'scorecards';
  if (pathname.includes('/enterprise-dashboard')) return 'enterprise-dashboard';
  if (pathname.includes('/enterprise-kpis')) return 'enterprise-kpis';
  if (pathname.includes('/benchmarking')) return 'benchmarking';
  if (pathname.includes('/strategic-initiatives')) return 'strategic-initiatives';
  if (pathname.includes('/executive-analytics')) return 'analytics';
  if (pathname.includes('/executive-forecasting')) return 'forecasting';
  if (pathname.includes('/enterprise-alerts')) return 'alerts';
  if (pathname.includes('/capacity') && !pathname.includes('/capacity-planning')) return 'capacity';
  if (variant === 'admin' && pathname.includes('/executive') && !pathname.includes('/executive-analytics') && !pathname.includes('/executive-forecasting') && !pathname.includes('/executive-scorecards')) return 'hub';
  return 'dashboard';
}
