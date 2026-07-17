import { Link, useLocation } from 'wouter';

import type { TelemedicineSection } from '@/features/telemedicine/components/TelemedicineSections';
import { cn } from '@/shared/lib/utils';

const PATIENT_TABS: {
  segment: TelemedicineSection | '';
  label: string;
  path: string;
}[] = [
  { segment: '', label: 'Dashboard', path: 'telemedicine' },
  { segment: 'upcoming', label: 'Upcoming', path: 'telemedicine/upcoming' },
  { segment: 'history', label: 'History', path: 'telemedicine/history' },
  {
    segment: 'device-check',
    label: 'Device Check',
    path: 'telemedicine/device-check',
  },
];

type PortalTab = { segment: TelemedicineSection; label: string; path: string };

const CLINICIAN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Telemedicine', path: 'telemedicine' },
  { segment: 'waiting-room', label: 'Waiting Room', path: 'waiting-room' },
  {
    segment: 'current-session',
    label: 'Current Session',
    path: 'current-session',
  },
  { segment: 'history', label: 'History', path: 'telemedicine/history' },
  { segment: 'availability', label: 'Availability', path: 'availability' },
];

const FACILITY_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Telemedicine', path: 'telemedicine' },
  { segment: 'sessions', label: 'Sessions', path: 'sessions' },
  { segment: 'providers', label: 'Providers', path: 'providers' },
  { segment: 'analytics', label: 'Analytics', path: 'analytics' },
];

const ADMIN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Telemedicine', path: 'telemedicine' },
  { segment: 'analytics', label: 'Analytics', path: 'telemedicine/analytics' },
  { segment: 'providers', label: 'Providers', path: 'providers' },
  {
    segment: 'platform-health',
    label: 'Platform Health',
    path: 'platform-health',
  },
];

interface TelemedicineTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
}

function portalRoot(
  basePath: string,
  variant: TelemedicineTabsProps['variant'],
) {
  if (variant === 'clinician')
    return basePath.replace(
      /\/(telemedicine(\/history)?|waiting-room|current-session|availability|session\/[^/]+)$/,
      '',
    );
  if (variant === 'facility')
    return basePath.replace(
      /\/(telemedicine|sessions|providers|analytics)$/,
      '',
    );
  if (variant === 'admin')
    return basePath.replace(
      /\/(telemedicine(\/analytics)?|providers|platform-health)$/,
      '',
    );
  return basePath;
}

function PortalTabs({
  basePath,
  variant,
  tabs,
}: {
  basePath: string;
  variant: 'clinician' | 'facility' | 'admin';
  tabs: PortalTab[];
}) {
  const [location] = useLocation();
  const root = portalRoot(basePath, variant);
  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Telemedicine sections"
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

export function TelemedicineTabs({
  basePath,
  variant = 'patient',
}: TelemedicineTabsProps) {
  const [location] = useLocation();
  if (variant === 'clinician')
    return (
      <PortalTabs
        basePath={basePath}
        variant="clinician"
        tabs={CLINICIAN_TABS}
      />
    );
  if (variant === 'facility')
    return (
      <PortalTabs basePath={basePath} variant="facility" tabs={FACILITY_TABS} />
    );
  if (variant === 'admin')
    return <PortalTabs basePath={basePath} variant="admin" tabs={ADMIN_TABS} />;

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Telemedicine sections"
    >
      {PATIENT_TABS.map((tab) => {
        const href = `/${tab.path}`;
        const active =
          tab.segment === ''
            ? location.endsWith('/telemedicine') &&
              !location.includes('/telemedicine/')
            : location.includes(`/${tab.path.split('/').pop()}`);
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

export function getTelemedicineSectionFromPath(
  pathname: string,
): TelemedicineSection {
  if (pathname.includes('/device-check')) return 'device-check';
  if (pathname.includes('/waiting-room')) return 'waiting-room';
  if (pathname.includes('/current-session')) return 'current-session';
  if (pathname.includes('/upcoming')) return 'upcoming';
  if (pathname.includes('/history')) return 'history';
  if (pathname.includes('/availability')) return 'availability';
  if (pathname.includes('/sessions')) return 'sessions';
  if (pathname.includes('/providers')) return 'providers';
  if (pathname.includes('/platform-health')) return 'platform-health';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/session/')) return 'session';
  const valid: TelemedicineSection[] = [
    'upcoming',
    'history',
    'device-check',
    'waiting-room',
    'current-session',
    'availability',
    'sessions',
    'providers',
    'analytics',
    'platform-health',
    'session',
    'recordings',
    'chat',
  ];
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  return valid.includes(segment as TelemedicineSection)
    ? (segment as TelemedicineSection)
    : 'dashboard';
}
