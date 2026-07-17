import { useLocation } from 'wouter';

import { QualityShell } from '@/features/quality/components/QualityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  'eqms' | 'incidents' | 'infection-control' | 'eqms-audits' | 'compliance';

function resolveSegment(location: string): Segment {
  if (location.includes('/incidents')) return 'incidents';
  if (location.includes('/infection-control')) return 'infection-control';
  if (location.includes('/eqms-audits')) return 'eqms-audits';
  if (location.includes('/compliance')) return 'compliance';
  return 'eqms';
}

const TITLES: Record<Segment, string> = {
  eqms: 'Quality Management',
  incidents: 'Incidents',
  'infection-control': 'Infection Prevention & Control',
  'eqms-audits': 'Audits & Inspections',
  compliance: 'Compliance',
};

export default function FacilityQualityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <QualityShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
