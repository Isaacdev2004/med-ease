import { useLocation } from 'wouter';

import { WorkforceShell } from '@/features/workforce/components/WorkforceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'workforce' | 'employees' | 'departments' | 'organization' | 'schedules' | 'payroll' | 'performance' | 'credentials' | 'workforce-analytics';

function resolveSegment(location: string): Segment {
  if (location.includes('/employees')) return 'employees';
  if (location.includes('/departments')) return 'departments';
  if (location.includes('/organization')) return 'organization';
  if (location.includes('/schedules')) return 'schedules';
  if (location.includes('/payroll')) return 'payroll';
  if (location.includes('/performance')) return 'performance';
  if (location.includes('/credentials')) return 'credentials';
  if (location.includes('/workforce-analytics')) return 'workforce-analytics';
  return 'workforce';
}

const TITLES: Record<Segment, string> = {
  workforce: 'HR Dashboard',
  employees: 'Employees',
  departments: 'Departments',
  organization: 'Organization',
  schedules: 'Schedules',
  payroll: 'Payroll',
  performance: 'Performance',
  credentials: 'Credentials',
  'workforce-analytics': 'Workforce Analytics',
};

export default function AdminWorkforcePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <WorkforceShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
