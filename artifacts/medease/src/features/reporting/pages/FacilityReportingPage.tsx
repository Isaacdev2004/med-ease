import { useLocation } from 'wouter';

import { ReportingShell } from '@/features/reporting/components/ReportingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'reports' | 'scheduled-reports';

function resolveSegment(location: string): Segment {
  if (location.includes('/scheduled-reports')) return 'scheduled-reports';
  return 'reports';
}

const TITLES: Record<Segment, string> = {
  reports: 'Reports',
  'scheduled-reports': 'Scheduled Reports',
};

export default function FacilityReportingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <ReportingShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} />;
}
