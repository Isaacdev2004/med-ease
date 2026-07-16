import { useLocation } from 'wouter';

import { PhmShell } from '@/features/population-health/components/PhmShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'phm' | 'phm-programs' | 'registries' | 'community-health';

function resolveSegment(location: string): Segment {
  if (location.includes('/phm-programs')) return 'phm-programs';
  if (location.includes('/registries')) return 'registries';
  if (location.includes('/community-health')) return 'community-health';
  return 'phm';
}

const TITLES: Record<Segment, string> = {
  phm: 'Population Health',
  'phm-programs': 'Chronic Disease Programs',
  registries: 'Disease Registries',
  'community-health': 'Community Health',
};

export default function FacilityPhmPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <PhmShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} />;
}
