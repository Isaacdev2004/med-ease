import { Link, useLocation } from 'wouter';

import { cn } from '@/shared/lib/utils';

export type RecordSection =
  | 'dashboard'
  | 'profile'
  | 'summary'
  | 'vitals'
  | 'laboratory'
  | 'medications'
  | 'allergies'
  | 'immunizations'
  | 'procedures'
  | 'radiology'
  | 'timeline'
  | 'documents'
  | 'emergency'
  | 'notes'
  | 'care-plans'
  | 'family-history'
  | 'lifestyle'
  | 'social-history';

const PATIENT_TABS: { segment: RecordSection | ''; label: string }[] = [
  { segment: '', label: 'Aperçu' },
  { segment: 'profile', label: 'Général' },
  { segment: 'summary', label: 'Administratif' },
  { segment: 'emergency', label: 'Urgence' },
  { segment: 'vitals', label: 'Physique' },
  { segment: 'immunizations', label: 'Vaccination' },
  { segment: 'laboratory', label: 'Laboratoire' },
  { segment: 'medications', label: 'Médicaments' },
  { segment: 'allergies', label: 'Allergies' },
  { segment: 'procedures', label: 'Actes' },
  { segment: 'radiology', label: 'Imagerie' },
  { segment: 'notes', label: 'Notes cliniques' },
  { segment: 'care-plans', label: 'Parcours' },
  { segment: 'timeline', label: 'Historique' },
  { segment: 'documents', label: 'Documents' },
  { segment: 'family-history', label: 'Antécédents familiaux' },
  { segment: 'lifestyle', label: 'Mode de vie' },
  { segment: 'social-history', label: 'Histoire sociale' },
];

interface RecordTabsProps {
  basePath: string;
  medicationsOnly?: boolean;
}

export function RecordTabs({ basePath, medicationsOnly }: RecordTabsProps) {
  const [location] = useLocation();
  const tabs = medicationsOnly
    ? PATIENT_TABS.filter(
        (t) => t.segment === '' || t.segment === 'medications',
      )
    : PATIENT_TABS;

  function isActive(segment: RecordSection | '') {
    if (segment === '') {
      return (
        location === basePath ||
        location.endsWith('/records') ||
        location.match(/\/patient\/[^/]+$/)
      );
    }
    return location.endsWith(`/${segment}`);
  }

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Health record sections"
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

export function getSectionFromPath(pathname: string): RecordSection {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  const valid: RecordSection[] = [
    'profile',
    'summary',
    'vitals',
    'laboratory',
    'medications',
    'allergies',
    'immunizations',
    'procedures',
    'radiology',
    'timeline',
    'documents',
    'emergency',
    'notes',
    'care-plans',
    'family-history',
    'lifestyle',
    'social-history',
  ];
  return valid.includes(segment as RecordSection)
    ? (segment as RecordSection)
    : 'dashboard';
}
