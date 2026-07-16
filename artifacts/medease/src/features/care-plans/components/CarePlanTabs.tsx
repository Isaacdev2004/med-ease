import { Link, useLocation } from 'wouter';

import type { CarePlanSection } from '@/features/care-plans/components/CarePlanSections';
import { cn } from '@/shared/lib/utils';

const PATIENT_TABS: { segment: CarePlanSection | ''; label: string }[] = [
  { segment: '', label: 'Overview' },
  { segment: 'goals', label: 'Goals' },
  { segment: 'tasks', label: 'Tasks' },
  { segment: 'timeline', label: 'Timeline' },
  { segment: 'team', label: 'Care Team' },
  { segment: 'progress', label: 'Progress' },
  { segment: 'education', label: 'Education' },
];

const CLINICIAN_TABS: { segment: CarePlanSection | ''; label: string; path: string }[] = [
  { segment: 'plans', label: 'Care Plans', path: 'care-plans' },
  { segment: 'pathways', label: 'Pathways', path: 'pathways' },
];

const FACILITY_TABS: { segment: CarePlanSection; label: string; path: string }[] = [
  { segment: 'plans', label: 'Care Plans', path: 'care-plans' },
  { segment: 'coordination', label: 'Coordination', path: 'coordination' },
  { segment: 'ward', label: 'Ward Care', path: 'ward-care' },
];

const ADMIN_TABS: { segment: CarePlanSection; label: string; path: string }[] = [
  { segment: 'plans', label: 'Care Plans', path: 'care-plans' },
  { segment: 'quality', label: 'Care Quality', path: 'care-quality' },
  { segment: 'population', label: 'Population Health', path: 'population-health' },
  { segment: 'analytics', label: 'Analytics', path: 'care-analytics' },
];

interface CarePlanTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
}

function portalRoot(basePath: string, variant: CarePlanTabsProps['variant']) {
  if (variant === 'facility') return basePath.replace(/\/(care-plans|coordination|ward-care)$/, '');
  if (variant === 'admin') return basePath.replace(/\/(care-plans|care-quality|population-health|care-analytics)$/, '');
  if (variant === 'clinician') return basePath.replace(/\/(care-plans|pathways)$/, '');
  return basePath;
}

export function CarePlanTabs({ basePath, variant = 'patient' }: CarePlanTabsProps) {
  const [location] = useLocation();
  const root = portalRoot(basePath, variant);

  if (variant === 'facility' || variant === 'admin') {
    const tabs = variant === 'facility' ? FACILITY_TABS : ADMIN_TABS;
    return (
      <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Care plan sections">
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

  if (variant === 'clinician' && !location.includes('/patient/')) {
    const tabs = CLINICIAN_TABS;
    return (
      <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Care plan sections">
        {tabs.map((tab) => {
          const href = `${root}/${tab.path}`;
          const active = location.endsWith(`/${tab.path}`);
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

  function isActive(segment: CarePlanSection | '') {
    if (segment === '') {
      return location === basePath || location.endsWith('/care-plan');
    }
    return location.endsWith(`/${segment}`);
  }

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Care plan sections">
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

export function getCarePlanSectionFromPath(pathname: string): CarePlanSection {
  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  const valid: CarePlanSection[] = [
    'goals', 'tasks', 'timeline', 'team', 'progress', 'education', 'pathways',
    'plans', 'coordination', 'analytics', 'quality', 'population', 'ward',
  ];
  if (segment === 'care-quality') return 'quality';
  if (segment === 'population-health') return 'population';
  if (segment === 'care-analytics') return 'analytics';
  if (segment === 'ward-care') return 'ward';
  if (segment === 'care-plans') return 'plans';
  if (segment === 'pathways') return 'pathways';
  if (segment === 'coordination') return 'coordination';
  return valid.includes(segment as CarePlanSection) ? (segment as CarePlanSection) : 'dashboard';
}
