import { Link, useLocation } from 'wouter';

import type { MedicationSection } from '@/features/medications/components/MedicationSections';
import { cn } from '@/shared/lib/utils';

const PATIENT_TABS: { segment: MedicationSection | ''; label: string }[] = [
  { segment: '', label: 'Dashboard' },
  { segment: 'history', label: 'History' },
  { segment: 'reminders', label: 'Reminders' },
  { segment: 'refills', label: 'Refills' },
];

type PortalTab = { segment: MedicationSection; label: string; path: string };

const CLINICIAN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Overview', path: 'medications' },
  { segment: 'prescriptions', label: 'Prescriptions', path: 'prescriptions' },
  {
    segment: 'reconciliation',
    label: 'Reconciliation',
    path: 'reconciliation',
  },
  {
    segment: 'administration',
    label: 'Administration',
    path: 'administration',
  },
  { segment: 'analytics', label: 'Analytics', path: 'analytics' },
];

const PHARMACY_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Overview', path: 'medications' },
  { segment: 'prescriptions', label: 'Prescriptions', path: 'prescriptions' },
  { segment: 'dispensing', label: 'Dispensing', path: 'dispensing' },
  { segment: 'refills', label: 'Refills', path: 'refills' },
  { segment: 'interactions', label: 'Interactions', path: 'interactions' },
  { segment: 'inventory', label: 'Inventory', path: 'inventory' },
];

const FACILITY_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Medications', path: 'medications' },
  { segment: 'emar', label: 'eMAR', path: 'emar' },
  {
    segment: 'administration',
    label: 'Administration',
    path: 'administration',
  },
];

const ADMIN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Medications', path: 'medications' },
  { segment: 'analytics', label: 'Analytics', path: 'medication-analytics' },
  { segment: 'formulary', label: 'Formulary', path: 'formulary' },
];

interface MedicationTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'pharmacy' | 'facility' | 'admin';
}

function portalRoot(basePath: string, variant: MedicationTabsProps['variant']) {
  if (variant === 'clinician') {
    return basePath.replace(
      /\/(medications|prescriptions|reconciliation|administration|analytics)$/,
      '',
    );
  }
  if (variant === 'pharmacy') {
    return basePath.replace(
      /\/(medications|prescriptions|refills|dispensing|interactions|inventory)$/,
      '',
    );
  }
  if (variant === 'facility') {
    return basePath.replace(
      /\/(medications|emar|administration|medication-board|medication-administration)$/,
      '',
    );
  }
  if (variant === 'admin') {
    return basePath.replace(
      /\/(medications|prescriptions|medication-analytics|formulary)$/,
      '',
    );
  }
  return basePath;
}

function PortalMedicationTabs({
  basePath,
  variant,
  tabs,
}: {
  basePath: string;
  variant: 'clinician' | 'pharmacy' | 'facility' | 'admin';
  tabs: PortalTab[];
}) {
  const [location] = useLocation();
  const root = portalRoot(basePath, variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Medication sections"
    >
      {tabs.map((tab) => {
        const href = `${root}/${tab.path}`;
        const active = location.endsWith(`/${tab.path}`);
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

export function MedicationTabs({
  basePath,
  variant = 'patient',
}: MedicationTabsProps) {
  const [location] = useLocation();

  if (variant === 'clinician') {
    return (
      <PortalMedicationTabs
        basePath={basePath}
        variant="clinician"
        tabs={CLINICIAN_TABS}
      />
    );
  }
  if (variant === 'pharmacy') {
    return (
      <PortalMedicationTabs
        basePath={basePath}
        variant="pharmacy"
        tabs={PHARMACY_TABS}
      />
    );
  }
  if (variant === 'facility') {
    return (
      <PortalMedicationTabs
        basePath={basePath}
        variant="facility"
        tabs={FACILITY_TABS}
      />
    );
  }
  if (variant === 'admin') {
    return (
      <PortalMedicationTabs
        basePath={basePath}
        variant="admin"
        tabs={ADMIN_TABS}
      />
    );
  }

  function isActive(segment: MedicationSection | '') {
    if (segment === '') {
      return location === basePath || location.endsWith('/medications');
    }
    return location.endsWith(`/${segment}`);
  }

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Medication sections"
    >
      {PATIENT_TABS.map((tab) => {
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

export function getMedicationSectionFromPath(
  pathname: string,
): MedicationSection {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  if (segment === 'medications' || segment === 'medication-board')
    return 'dashboard';
  if (segment === 'medication-administration') return 'administration';
  if (segment === 'medication-analytics') return 'analytics';
  if (segment === 'prescribe') return 'prescriptions';
  const valid: MedicationSection[] = [
    'today',
    'calendar',
    'history',
    'refills',
    'reminders',
    'logs',
    'interactions',
    'adherence',
    'prescriptions',
    'dispensing',
    'analytics',
    'administration',
    'reconciliation',
    'formulary',
    'inventory',
    'emar',
  ];
  return valid.includes(segment as MedicationSection)
    ? (segment as MedicationSection)
    : 'dashboard';
}
