import { useLocation } from 'wouter';

import { WorkforceShell } from '@/features/workforce/components/WorkforceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  'workforce' | 'staff' | 'scheduling' | 'attendance' | 'leave' | 'training';

function resolveSegment(location: string): Segment {
  if (location.includes('/staff')) return 'staff';
  if (location.includes('/scheduling')) return 'scheduling';
  if (location.includes('/attendance')) return 'attendance';
  if (location.includes('/leave')) return 'leave';
  if (location.includes('/training')) return 'training';
  return 'workforce';
}

const TITLES: Record<Segment, string> = {
  workforce: 'Staff Dashboard',
  staff: 'Healthcare Staff',
  scheduling: 'Staff Scheduling',
  attendance: 'Attendance',
  leave: 'Leave Management',
  training: 'Training',
};

export default function FacilityWorkforcePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <WorkforceShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
      facilityId="fac-001"
    />
  );
}
