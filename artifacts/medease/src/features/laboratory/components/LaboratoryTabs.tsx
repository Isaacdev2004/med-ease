import { Link, useLocation } from 'wouter';

import type { LaboratorySection } from '@/features/laboratory/components/LaboratorySections';
import { cn } from '@/shared/lib/utils';

const PATIENT_TABS: { segment: LaboratorySection | ''; label: string }[] = [
  { segment: '', label: 'Overview' },
  { segment: 'history', label: 'History' },
  { segment: 'trends', label: 'Trends' },
];

const PROFESSIONAL_TABS: {
  segment: LaboratorySection;
  label: string;
  path: string;
}[] = [
  { segment: 'list', label: 'Laboratory', path: 'laboratory' },
  { segment: 'results', label: 'Results', path: 'results' },
  { segment: 'critical', label: 'Critical', path: 'laboratory/critical' },
  { segment: 'microbiology', label: 'Microbiology', path: 'microbiology' },
  { segment: 'pathology', label: 'Pathology', path: 'pathology' },
];

const FACILITY_TABS: {
  segment: LaboratorySection;
  label: string;
  path: string;
}[] = [
  { segment: 'queue', label: 'Laboratory', path: 'laboratory' },
  { segment: 'dashboard', label: 'Dashboard', path: 'dashboard' },
  { segment: 'specimens', label: 'Specimens', path: 'specimens' },
  { segment: 'quality', label: 'Quality', path: 'quality' },
];

const ADMIN_TABS: {
  segment: LaboratorySection;
  label: string;
  path: string;
}[] = [
  { segment: 'catalog', label: 'Laboratory', path: 'laboratory' },
  { segment: 'analytics', label: 'Analytics', path: 'laboratory/analytics' },
  {
    segment: 'instruments',
    label: 'Instruments',
    path: 'laboratory/instruments',
  },
  { segment: 'quality', label: 'Quality', path: 'laboratory/quality' },
];

interface LaboratoryTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
}

function portalRoot(basePath: string, variant: LaboratoryTabsProps['variant']) {
  if (variant === 'facility')
    return basePath.replace(/\/(laboratory|dashboard|specimens|quality)$/, '');
  if (variant === 'admin') return basePath.replace(/\/laboratory(\/.*)?$/, '');
  if (variant === 'clinician')
    return basePath.replace(
      /\/(laboratory|results|microbiology|pathology)(\/.*)?$/,
      '',
    );
  return basePath;
}

export function LaboratoryTabs({
  basePath,
  variant = 'patient',
}: LaboratoryTabsProps) {
  const [location] = useLocation();
  const root = portalRoot(basePath, variant);

  if (variant === 'facility' || variant === 'admin') {
    const tabs = variant === 'facility' ? FACILITY_TABS : ADMIN_TABS;
    return (
      <nav
        className="flex flex-wrap gap-1 border-b pb-2"
        aria-label="Laboratory sections"
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

  if (variant === 'clinician' && !location.includes('/patient/')) {
    return (
      <nav
        className="flex flex-wrap gap-1 border-b pb-2"
        aria-label="Laboratory sections"
      >
        {PROFESSIONAL_TABS.map((tab) => {
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

  const tabs = PATIENT_TABS;
  function isActive(segment: LaboratorySection | '') {
    if (segment === '')
      return location === basePath || location.endsWith('/laboratory');
    return location.endsWith(`/${segment}`);
  }

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Laboratory sections"
    >
      {tabs.map((tab) => {
        const href = tab.segment ? `${basePath}/${tab.segment}` : basePath;
        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isActive(tab.segment)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-current={isActive(tab.segment) ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getLaboratorySectionFromPath(
  pathname: string,
): LaboratorySection {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  const valid: LaboratorySection[] = [
    'orders',
    'results',
    'history',
    'trends',
    'list',
    'critical',
    'queue',
    'specimens',
    'verification',
    'pending',
    'catalog',
    'analytics',
    'reports',
    'quality',
    'microbiology',
    'pathology',
    'bloodBank',
    'instruments',
    'dashboard',
  ];
  if (segment === 'laboratory')
    return pathname.includes('/admin')
      ? 'catalog'
      : pathname.includes('/facility')
        ? 'queue'
        : 'list';
  if (segment === 'critical') return 'critical';
  if (segment === 'verification' || segment === 'quality') return 'quality';
  if (segment === 'specimens') return 'specimens';
  if (segment === 'analytics') return 'analytics';
  if (segment === 'instruments') return 'instruments';
  if (segment === 'dashboard') return 'dashboard';
  if (segment === 'microbiology') return 'microbiology';
  if (segment === 'pathology') return 'pathology';
  if (segment === 'results') return 'results';
  return valid.includes(segment as LaboratorySection)
    ? (segment as LaboratorySection)
    : 'dashboard';
}
