import { Link, useLocation } from 'wouter';

import type { ResearchSection } from '@/features/research/components/ResearchSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: ResearchSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Research Overview', path: 'research' },
  { segment: 'trials', label: 'Clinical Trials', path: 'clinical-trials' },
  { segment: 'participants', label: 'Participants', path: 'participants' },
  { segment: 'visits', label: 'Study Visits', path: 'study-visits' },
  {
    segment: 'adverse-events',
    label: 'Adverse Events',
    path: 'adverse-events',
  },
  { segment: 'biospecimens', label: 'Biospecimens', path: 'biospecimens' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Research', path: 'research' },
  { segment: 'sites', label: 'Study Sites', path: 'study-sites' },
  { segment: 'recruitment', label: 'Recruitment', path: 'recruitment' },
  {
    segment: 'facility-dashboard',
    label: 'Research Dashboard',
    path: 'research-dashboard',
  },
  { segment: 'innovation', label: 'Innovation', path: 'innovation' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'hub', label: 'Research Hub', path: 'research' },
  { segment: 'trials-admin', label: 'Trials', path: 'trials' },
  { segment: 'regulatory', label: 'Regulatory', path: 'regulatory' },
  { segment: 'publications', label: 'Publications', path: 'publications' },
  { segment: 'grants', label: 'Grants', path: 'grants' },
  { segment: 'analytics', label: 'Analytics', path: 'research-analytics' },
  { segment: 'protocols', label: 'Protocols', path: 'protocols' },
  { segment: 'audit', label: 'Audit', path: 'research-audit' },
];

interface ResearchTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: ResearchTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function ResearchTabs({
  basePath: _basePath,
  variant = 'professional',
}: ResearchTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Research sections"
    >
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
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

export function getResearchSectionFromPath(
  pathname: string,
  variant: 'professional' | 'facility' | 'admin' = 'professional',
): ResearchSection {
  if (
    pathname.includes('/clinical-trials') ||
    (variant === 'admin' && pathname.includes('/trials'))
  )
    return variant === 'admin' ? 'trials-admin' : 'trials';
  if (pathname.includes('/participants')) return 'participants';
  if (pathname.includes('/study-visits')) return 'visits';
  if (pathname.includes('/adverse-events')) return 'adverse-events';
  if (pathname.includes('/biospecimens')) return 'biospecimens';
  if (pathname.includes('/study-sites')) return 'sites';
  if (pathname.includes('/recruitment')) return 'recruitment';
  if (pathname.includes('/research-dashboard')) return 'facility-dashboard';
  if (pathname.includes('/innovation')) return 'innovation';
  if (pathname.includes('/regulatory')) return 'regulatory';
  if (pathname.includes('/publications')) return 'publications';
  if (pathname.includes('/grants')) return 'grants';
  if (pathname.includes('/research-analytics')) return 'analytics';
  if (pathname.includes('/protocols')) return 'protocols';
  if (pathname.includes('/research-audit')) return 'audit';
  if (
    variant === 'admin' &&
    pathname.includes('/research') &&
    !pathname.includes('/research-analytics') &&
    !pathname.includes('/research-dashboard') &&
    !pathname.includes('/research-audit')
  )
    return 'hub';
  return 'dashboard';
}
