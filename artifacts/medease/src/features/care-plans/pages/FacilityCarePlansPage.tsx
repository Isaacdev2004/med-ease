import { useLocation } from 'wouter';

import { CarePlansShell } from '@/features/care-plans/components/CarePlansShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function FacilityCarePlansPage() {
  const [location] = useLocation();
  const segment = location.includes('coordination')
    ? 'coordination'
    : location.includes('ward-care')
      ? 'ward-care'
      : 'care-plans';
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<string, string> = {
    'care-plans': 'Facility Care Plans',
    coordination: 'Clinical Coordination',
    'ward-care': 'Ward Care Plans',
  };
  return <CarePlansShell basePath={basePath} variant="facility" title={titles[segment] ?? 'Care Plans'} />;
}
