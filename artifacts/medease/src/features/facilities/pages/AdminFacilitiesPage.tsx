import { useLocation } from 'wouter';

import { FacilitiesShell } from '@/features/facilities/components/FacilitiesShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'facilities' | 'buildings' | 'facilities-assets' | 'work-orders' | 'calibration' | 'vendors' | 'contracts' | 'facilities-analytics' | 'system-health';

function resolveSegment(location: string): Segment {
  if (location.includes('/buildings')) return 'buildings';
  if (location.includes('/facilities-assets')) return 'facilities-assets';
  if (location.includes('/work-orders')) return 'work-orders';
  if (location.includes('/calibration')) return 'calibration';
  if (location.includes('/vendors')) return 'vendors';
  if (location.includes('/contracts')) return 'contracts';
  if (location.includes('/facilities-analytics')) return 'facilities-analytics';
  if (location.includes('/system-health')) return 'system-health';
  return 'facilities';
}

const TITLES: Record<Segment, string> = {
  facilities: 'Facilities Management',
  buildings: 'Buildings',
  'facilities-assets': 'Assets',
  'work-orders': 'Work Orders',
  calibration: 'Calibration',
  vendors: 'Vendors',
  contracts: 'Contracts',
  'facilities-analytics': 'Facilities Analytics',
  'system-health': 'System Health',
};

export default function AdminFacilitiesPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <FacilitiesShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
