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
  { segment: '', label: 'Overview' },
  { segment: 'profile', label: 'Profile' },
  { segment: 'summary', label: 'Summary' },
  { segment: 'vitals', label: 'Vitals' },
  { segment: 'laboratory', label: 'Laboratory' },
  { segment: 'medications', label: 'Medications' },
  { segment: 'allergies', label: 'Allergies' },
  { segment: 'immunizations', label: 'Immunizations' },
  { segment: 'procedures', label: 'Procedures' },
  { segment: 'radiology', label: 'Radiology' },
  { segment: 'notes', label: 'Clinical Notes' },
  { segment: 'care-plans', label: 'Care Plans' },
  { segment: 'timeline', label: 'Timeline' },
  { segment: 'documents', label: 'Documents' },
  { segment: 'family-history', label: 'Family History' },
  { segment: 'lifestyle', label: 'Lifestyle' },
  { segment: 'social-history', label: 'Social History' },
  { segment: 'emergency', label: 'Emergency' },
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
