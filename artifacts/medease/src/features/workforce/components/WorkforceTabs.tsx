import { Link, useLocation } from 'wouter';

import type { WorkforceSection } from '@/features/workforce/components/WorkforceSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: WorkforceSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Workforce', path: 'workforce' },
  { segment: 'schedule', label: 'My Schedule', path: 'workforce-schedule' },
  { segment: 'attendance', label: 'Attendance', path: 'attendance' },
  { segment: 'training', label: 'Training', path: 'training' },
  { segment: 'performance', label: 'Performance', path: 'performance' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Staff Dashboard', path: 'workforce' },
  { segment: 'staff', label: 'Staff', path: 'staff' },
  { segment: 'scheduling', label: 'Scheduling', path: 'scheduling' },
  { segment: 'attendance', label: 'Attendance', path: 'attendance' },
  { segment: 'leave', label: 'Leave', path: 'leave' },
  { segment: 'training', label: 'Training', path: 'training' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'HR Dashboard', path: 'workforce' },
  { segment: 'employees', label: 'Employees', path: 'employees' },
  {
    segment: 'departments',
    label: 'Departments',
    path: 'workforce-departments',
  },
  { segment: 'organization', label: 'Organization', path: 'organization' },
  { segment: 'schedules', label: 'Schedules', path: 'schedules' },
  { segment: 'payroll', label: 'Payroll', path: 'payroll' },
  { segment: 'performance', label: 'Performance', path: 'performance' },
  { segment: 'credentials', label: 'Credentials', path: 'credentials' },
  { segment: 'analytics', label: 'Analytics', path: 'workforce-analytics' },
];

interface WorkforceTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: WorkforceTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function WorkforceTabs({
  basePath: _basePath,
  variant = 'professional',
}: WorkforceTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Workforce sections"
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

export function getWorkforceSectionFromPath(
  pathname: string,
): WorkforceSection {
  if (pathname.includes('/workforce-schedule')) return 'schedule';
  if (pathname.includes('/employees')) return 'employees';
  if (pathname.includes('/workforce-departments')) return 'departments';
  if (pathname.includes('/organization')) return 'organization';
  if (pathname.includes('/schedules') || pathname.includes('/scheduling'))
    return pathname.includes('/scheduling') ? 'scheduling' : 'schedules';
  if (pathname.includes('/staff')) return 'staff';
  if (pathname.includes('/attendance')) return 'attendance';
  if (pathname.includes('/leave')) return 'leave';
  if (pathname.includes('/training')) return 'training';
  if (pathname.includes('/performance')) return 'performance';
  if (pathname.includes('/payroll')) return 'payroll';
  if (pathname.includes('/credentials')) return 'credentials';
  if (pathname.includes('/workforce-analytics')) return 'analytics';
  return 'dashboard';
}
