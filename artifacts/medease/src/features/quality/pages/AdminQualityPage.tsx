import { useLocation } from 'wouter';

import { QualityShell } from '@/features/quality/components/QualityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'quality'
  | 'risk-register'
  | 'capa'
  | 'accreditation'
  | 'document-control'
  | 'regulatory'
  | 'quality-analytics'
  | 'eqms-audits';

function resolveSegment(location: string): Segment {
  if (location.includes('/risk-register')) return 'risk-register';
  if (location.includes('/capa')) return 'capa';
  if (location.includes('/accreditation')) return 'accreditation';
  if (location.includes('/document-control')) return 'document-control';
  if (location.includes('/regulatory')) return 'regulatory';
  if (location.includes('/quality-analytics')) return 'quality-analytics';
  if (location.includes('/eqms-audits')) return 'eqms-audits';
  return 'quality';
}

const TITLES: Record<Segment, string> = {
  quality: 'Enterprise Quality Management',
  'risk-register': 'Enterprise Risk Register',
  capa: 'CAPA Management',
  accreditation: 'Accreditation Readiness',
  'document-control': 'Document Control',
  regulatory: 'Regulatory Compliance',
  'quality-analytics': 'Quality Analytics',
  'eqms-audits': 'Audits & Inspections',
};

export default function AdminQualityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <QualityShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
