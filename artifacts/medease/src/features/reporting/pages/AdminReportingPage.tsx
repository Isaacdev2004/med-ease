import { useLocation } from 'wouter';

import { ReportingShell } from '@/features/reporting/components/ReportingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'reports'
  | 'report-designer'
  | 'report-library'
  | 'report-schedules'
  | 'report-exports'
  | 'report-analytics'
  | 'compliance-reports';

function resolveSegment(location: string): Segment {
  const paths: Segment[] = [
    'compliance-reports',
    'report-analytics',
    'report-exports',
    'report-schedules',
    'report-library',
    'report-designer',
  ];
  for (const p of paths) {
    if (location.includes(`/${p}`)) return p;
  }
  return 'reports';
}

const TITLES: Record<Segment, string> = {
  reports: 'Report Hub',
  'report-designer': 'Report Designer',
  'report-library': 'Report Library',
  'report-schedules': 'Report Schedules',
  'report-exports': 'Report Exports',
  'report-analytics': 'Report Analytics',
  'compliance-reports': 'Compliance Reports',
};

export default function AdminReportingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <ReportingShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
