import { useLocation } from 'wouter';

import { FacilitiesShell } from '@/features/facilities/components/FacilitiesShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'facilities' | 'equipment' | 'maintenance';

function resolveSegment(location: string): Segment {
  if (location.includes('/equipment')) return 'equipment';
  if (location.includes('/maintenance')) return 'maintenance';
  return 'facilities';
}

const TITLES: Record<Segment, string> = {
  facilities: 'Equipment Dashboard',
  equipment: 'Medical Equipment',
  maintenance: 'Maintenance Requests',
};

export default function ProfessionalFacilitiesPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <FacilitiesShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
      facilityId="fac-001"
    />
  );
}
