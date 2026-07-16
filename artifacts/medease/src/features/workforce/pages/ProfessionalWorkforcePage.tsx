import { useLocation } from 'wouter';

import { WorkforceShell } from '@/features/workforce/components/WorkforceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'workforce' | 'workforce-schedule' | 'attendance' | 'training' | 'performance';

function resolveSegment(location: string): Segment {
  if (location.includes('/workforce-schedule')) return 'workforce-schedule';
  if (location.includes('/attendance')) return 'attendance';
  if (location.includes('/training')) return 'training';
  if (location.includes('/performance')) return 'performance';
  return 'workforce';
}

const TITLES: Record<Segment, string> = {
  workforce: 'My Workforce',
  'workforce-schedule': 'My Schedule',
  attendance: 'My Attendance',
  training: 'My Training',
  performance: 'My Performance',
};

export default function ProfessionalWorkforcePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <WorkforceShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} employeeId="emp-00001" />;
}
