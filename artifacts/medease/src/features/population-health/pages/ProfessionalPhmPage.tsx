import { useLocation } from 'wouter';

import { PhmShell } from '@/features/population-health/components/PhmShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  'phm' | 'care-gaps' | 'registries' | 'high-risk-patients' | 'outreach';

function resolveSegment(location: string): Segment {
  if (location.includes('/care-gaps')) return 'care-gaps';
  if (location.includes('/registries')) return 'registries';
  if (location.includes('/high-risk-patients')) return 'high-risk-patients';
  if (location.includes('/outreach')) return 'outreach';
  return 'phm';
}

const TITLES: Record<Segment, string> = {
  phm: 'Population Dashboard',
  'care-gaps': 'Care Gap Management',
  registries: 'Disease Registries',
  'high-risk-patients': 'High Risk Patients',
  outreach: 'Outreach Campaigns',
};

export default function ProfessionalPhmPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <PhmShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
