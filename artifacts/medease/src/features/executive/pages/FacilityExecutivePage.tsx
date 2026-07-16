import { useLocation } from 'wouter';

import { CommandCenterShell } from '@/features/executive/components/CommandCenterShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'executive' | 'operations-center' | 'capacity' | 'patient-flow' | 'executive-scorecards';

function resolveSegment(location: string): Segment {
  if (location.includes('/operations-center')) return 'operations-center';
  if (location.includes('/patient-flow')) return 'patient-flow';
  if (location.includes('/executive-scorecards')) return 'executive-scorecards';
  if (location.includes('/capacity') && !location.includes('/capacity-planning')) return 'capacity';
  return 'executive';
}

const TITLES: Record<Segment, string> = {
  executive: 'Executive Command Center',
  'operations-center': 'Operations Center',
  capacity: 'Capacity Management',
  'patient-flow': 'Patient Flow Analytics',
  'executive-scorecards': 'Executive Scorecards',
};

export default function FacilityExecutivePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <CommandCenterShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} />;
}
