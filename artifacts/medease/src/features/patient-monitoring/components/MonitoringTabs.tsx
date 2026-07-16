import { Link, useLocation } from 'wouter';

import type { MonitoringSection } from '@/features/patient-monitoring/components/MonitoringSections';
import { cn } from '@/shared/lib/utils';

const PATIENT_TABS: { segment: MonitoringSection | ''; label: string; path: string }[] = [
  { segment: '', label: 'Dashboard', path: 'monitoring' },
  { segment: 'vitals', label: 'Vitals', path: 'vitals' },
  { segment: 'observations', label: 'Observations', path: 'observations' },
  { segment: 'rpm', label: 'RPM', path: 'rpm' },
];

type PortalTab = { segment: MonitoringSection; label: string; path: string };

const CLINICIAN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Monitoring', path: 'monitoring' },
  { segment: 'alerts', label: 'Alerts', path: 'alerts' },
  { segment: 'devices', label: 'Devices', path: 'devices' },
  { segment: 'analytics', label: 'Analytics', path: 'analytics' },
];

const FACILITY_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Ward Dashboard', path: 'dashboard' },
  { segment: 'dashboard', label: 'Monitoring', path: 'monitoring' },
  { segment: 'devices', label: 'Devices', path: 'devices' },
  { segment: 'alerts', label: 'Alerts', path: 'alerts' },
];

const ADMIN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Monitoring', path: 'monitoring' },
  { segment: 'rpm', label: 'RPM', path: 'rpm' },
  { segment: 'analytics', label: 'Analytics', path: 'monitoring/analytics' },
  { segment: 'devices', label: 'Devices', path: 'devices' },
];

interface MonitoringTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
}

function portalRoot(basePath: string, variant: MonitoringTabsProps['variant']) {
  if (variant === 'clinician') return basePath.replace(/\/(monitoring|alerts|devices|analytics)$/, '');
  if (variant === 'facility') return basePath.replace(/\/(monitoring|dashboard|devices|alerts)$/, '');
  if (variant === 'admin') return basePath.replace(/\/(monitoring(\/analytics)?|rpm|devices)$/, '');
  return basePath;
}

function PortalTabs({ basePath, variant, tabs }: { basePath: string; variant: 'clinician' | 'facility' | 'admin'; tabs: PortalTab[] }) {
  const [location] = useLocation();
  const root = portalRoot(basePath, variant);
  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Monitoring sections">
      {tabs.map((tab) => {
        const href = `${root}/${tab.path}`;
        const active = location.endsWith(`/${tab.path}`) || location.includes(`/${tab.path}`);
        return (
          <Link key={tab.label} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MonitoringTabs({ basePath, variant = 'patient' }: MonitoringTabsProps) {
  const [location] = useLocation();
  if (variant === 'clinician') return <PortalTabs basePath={basePath} variant="clinician" tabs={CLINICIAN_TABS} />;
  if (variant === 'facility') return <PortalTabs basePath={basePath} variant="facility" tabs={FACILITY_TABS} />;
  if (variant === 'admin') return <PortalTabs basePath={basePath} variant="admin" tabs={ADMIN_TABS} />;

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Monitoring sections">
      {PATIENT_TABS.map((tab) => {
        const href = `/${tab.path}`;
        const active = tab.segment === ''
          ? location.endsWith('/monitoring') && !location.includes('/monitoring/')
          : location.endsWith(`/${tab.path}`) || location.includes(`/${tab.path}`);
        return (
          <Link key={tab.label} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getMonitoringSectionFromPath(pathname: string): MonitoringSection {
  if (pathname.includes('/vitals')) return 'vitals';
  if (pathname.includes('/observations')) return 'observations';
  if (pathname.includes('/rpm') && !pathname.includes('/monitoring')) return 'rpm';
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  if (segment === 'monitoring' || segment === 'dashboard') return 'dashboard';
  if (pathname.includes('/monitoring/analytics')) return 'analytics';
  const valid: MonitoringSection[] = ['vitals', 'observations', 'rpm', 'alerts', 'devices', 'analytics', 'scores', 'timeline', 'history'];
  return valid.includes(segment as MonitoringSection) ? (segment as MonitoringSection) : 'dashboard';
}
