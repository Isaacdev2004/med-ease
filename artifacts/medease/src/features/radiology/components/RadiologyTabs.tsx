import { Link, useLocation } from 'wouter';

import type { RadiologySection } from '@/features/radiology/components/RadiologySections';
import { cn } from '@/shared/lib/utils';

const PATIENT_TABS: { segment: RadiologySection | ''; label: string }[] = [
  { segment: '', label: 'Overview' },
  { segment: 'history', label: 'History' },
];

const PROFESSIONAL_TABS: { segment: RadiologySection; label: string; path: string }[] = [
  { segment: 'list', label: 'Radiology', path: 'radiology' },
  { segment: 'worklist', label: 'Worklist', path: 'worklist' },
  { segment: 'reports', label: 'Reports', path: 'reports' },
  { segment: 'critical', label: 'Critical', path: 'radiology/critical' },
  { segment: 'compare', label: 'Compare', path: 'compare' },
];

const FACILITY_TABS: { segment: RadiologySection; label: string; path: string }[] = [
  { segment: 'queue', label: 'Radiology', path: 'radiology' },
  { segment: 'dashboard', label: 'Dashboard', path: 'dashboard' },
  { segment: 'imaging', label: 'Imaging', path: 'imaging' },
  { segment: 'devices', label: 'Devices', path: 'devices' },
];

const ADMIN_TABS: { segment: RadiologySection; label: string; path: string }[] = [
  { segment: 'catalog', label: 'Radiology', path: 'radiology' },
  { segment: 'analytics', label: 'Analytics', path: 'radiology/analytics' },
  { segment: 'devices', label: 'Devices', path: 'radiology/devices' },
  { segment: 'workload', label: 'Workload', path: 'radiology/workload' },
];

interface RadiologyTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
}

function portalRoot(basePath: string, variant: RadiologyTabsProps['variant']) {
  if (variant === 'facility') return basePath.replace(/\/(radiology|dashboard|imaging|devices)$/, '');
  if (variant === 'admin') return basePath.replace(/\/radiology(\/.*)?$/, '');
  if (variant === 'clinician') return basePath.replace(/\/(radiology|worklist|reports|compare)(\/.*)?$/, '');
  return basePath;
}

export function RadiologyTabs({ basePath, variant = 'patient' }: RadiologyTabsProps) {
  const [location] = useLocation();
  const root = portalRoot(basePath, variant);

  if (variant === 'facility' || variant === 'admin') {
    const tabs = variant === 'facility' ? FACILITY_TABS : ADMIN_TABS;
    return (
      <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Radiology sections">
        {tabs.map((tab) => {
          const href = `${root}/${tab.path}`;
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

  if (variant === 'clinician' && !location.includes('/patient/') && !location.includes('/viewer/')) {
    return (
      <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Radiology sections">
        {PROFESSIONAL_TABS.map((tab) => {
          const href = `${root}/${tab.path}`;
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

  const tabs = PATIENT_TABS;
  function isActive(segment: RadiologySection | '') {
    if (segment === '') return location === basePath || location.endsWith('/radiology');
    return location.endsWith(`/${segment}`);
  }

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Radiology sections">
      {tabs.map((tab) => {
        const href = tab.segment ? `${basePath}/${tab.segment}` : basePath;
        return (
          <Link key={tab.label} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', isActive(tab.segment) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={isActive(tab.segment) ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getRadiologySectionFromPath(pathname: string): RadiologySection {
  if (pathname.includes('/viewer/')) return 'viewer';
  if (pathname.includes('/report/')) return 'report';
  if (pathname.includes('/worklist')) return 'worklist';
  if (pathname.includes('/critical')) return 'critical';
  if (pathname.includes('/compare')) return 'compare';
  if (pathname.includes('/devices')) return 'devices';
  if (pathname.includes('/workload')) return 'workload';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/dashboard')) return 'dashboard';
  if (pathname.includes('/imaging')) return 'imaging';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/history')) return 'history';
  if (pathname.endsWith('/radiology')) return pathname.includes('/admin') ? 'catalog' : pathname.includes('/facility') ? 'queue' : 'list';
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  if (segment === 'radiology') return 'dashboard';
  return 'dashboard';
}
