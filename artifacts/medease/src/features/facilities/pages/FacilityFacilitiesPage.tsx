import { useLocation } from 'wouter';

import { FacilitiesShell } from '@/features/facilities/components/FacilitiesShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'facilities' | 'buildings' | 'facility-assets' | 'maintenance' | 'utilities' | 'environment' | 'housekeeping' | 'fleet';

function resolveSegment(location: string): Segment {
  if (location.includes('/buildings')) return 'buildings';
  if (location.includes('/facility-assets')) return 'facility-assets';
  if (location.includes('/maintenance')) return 'maintenance';
  if (location.includes('/utilities')) return 'utilities';
  if (location.includes('/environment')) return 'environment';
  if (location.includes('/housekeeping')) return 'housekeeping';
  if (location.includes('/fleet')) return 'fleet';
  return 'facilities';
}

const TITLES: Record<Segment, string> = {
  facilities: 'Facilities Dashboard',
  buildings: 'Buildings & Rooms',
  'facility-assets': 'Assets & Equipment',
  maintenance: 'Maintenance',
  utilities: 'Utilities',
  environment: 'Environmental Monitoring',
  housekeeping: 'Housekeeping',
  fleet: 'Fleet Management',
};

export default function FacilityFacilitiesPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <FacilitiesShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} facilityId="fac-001" />;
}
