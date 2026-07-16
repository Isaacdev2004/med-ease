import { useLocation } from 'wouter';

import { QualityShell } from '@/features/quality/components/QualityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'quality' | 'incidents' | 'policies';

function resolveSegment(location: string): Segment {
  if (location.includes('/incidents')) return 'incidents';
  if (location.includes('/policies')) return 'policies';
  return 'quality';
}

const TITLES: Record<Segment, string> = {
  quality: 'Quality Overview',
  incidents: 'Incident Reporting',
  policies: 'Policies & SOPs',
};

export default function ProfessionalQualityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <QualityShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} />;
}
