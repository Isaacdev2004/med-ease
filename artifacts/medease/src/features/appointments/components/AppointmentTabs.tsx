import { Link, useLocation } from 'wouter';

import { cn } from '@/shared/lib/utils';

export type AppointmentTabSection =
  | 'dashboard'
  | 'book'
  | 'calendar'
  | 'upcoming'
  | 'history'
  | 'schedule'
  | 'waitlist'
  | 'queue'
  | 'telemedicine'
  | 'resources'
  | 'analytics'
  | 'follow-ups';

const PATIENT_TABS: { segment: AppointmentTabSection | ''; label: string }[] = [
  { segment: '', label: 'Aperçu' },
  { segment: 'book', label: 'Prendre RDV' },
  { segment: 'calendar', label: 'Calendrier' },
  { segment: 'upcoming', label: 'À venir' },
  { segment: 'history', label: 'Historique' },
  { segment: 'telemedicine', label: 'Téléconsultation' },
];

const CLINICIAN_TABS: { segment: AppointmentTabSection | ''; label: string }[] =
  [
    { segment: '', label: 'Tableau de bord' },
    { segment: 'schedule', label: 'Planning' },
    { segment: 'calendar', label: 'Calendrier' },
    { segment: 'queue', label: 'File d’attente' },
    { segment: 'waitlist', label: 'Liste d’attente' },
    { segment: 'analytics', label: 'Analyses' },
    { segment: 'follow-ups', label: 'Suivis' },
  ];

const FACILITY_TABS: { segment: AppointmentTabSection | ''; label: string }[] =
  [
    { segment: '', label: 'Planning' },
    { segment: 'resources', label: 'Ressources' },
    { segment: 'calendar', label: 'Calendrier' },
    { segment: 'queue', label: 'File d’attente' },
    { segment: 'analytics', label: 'Analyses' },
  ];

interface AppointmentTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
}

export function AppointmentTabs({
  basePath,
  variant = 'patient',
}: AppointmentTabsProps) {
  const [location] = useLocation();
  const tabs =
    variant === 'patient'
      ? PATIENT_TABS
      : variant === 'facility'
        ? FACILITY_TABS
        : CLINICIAN_TABS;

  function isActive(segment: AppointmentTabSection | '') {
    if (segment === '') {
      return (
        location === basePath ||
        location.endsWith('/appointments') ||
        location.endsWith('/schedule')
      );
    }
    return location.endsWith(`/${segment}`);
  }

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Appointment sections"
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

export function getAppointmentSectionFromPath(
  pathname: string,
): AppointmentTabSection {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  const valid: AppointmentTabSection[] = [
    'book',
    'calendar',
    'upcoming',
    'history',
    'schedule',
    'waitlist',
    'queue',
    'telemedicine',
    'resources',
    'analytics',
    'follow-ups',
  ];
  return valid.includes(segment as AppointmentTabSection)
    ? (segment as AppointmentTabSection)
    : 'dashboard';
}
