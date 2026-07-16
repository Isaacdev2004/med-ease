import { useLocation } from 'wouter';

import { ReportingShell } from '@/features/reporting/components/ReportingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'reports' | 'my-reports';

function resolveSegment(location: string): Segment {
  if (location.includes('/my-reports')) return 'my-reports';
  return 'reports';
}

const TITLES: Record<Segment, string> = {
  reports: 'Reports',
  'my-reports': 'My Reports',
};

export default function ProfessionalReportingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <ReportingShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} />;
}
