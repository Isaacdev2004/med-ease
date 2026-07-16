import { useLocation } from 'wouter';

import { PhmShell } from '@/features/population-health/components/PhmShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'phm-analytics' | 'quality-measures' | 'population-risk' | 'phm-executive' | 'campaigns';

function resolveSegment(location: string): Segment {
  if (location.includes('/quality-measures')) return 'quality-measures';
  if (location.includes('/population-risk')) return 'population-risk';
  if (location.includes('/phm-executive')) return 'phm-executive';
  if (location.includes('/campaigns')) return 'campaigns';
  return 'phm-analytics';
}

const TITLES: Record<Segment, string> = {
  'phm-analytics': 'Population Analytics',
  'quality-measures': 'Quality Measures',
  'population-risk': 'Population Risk',
  'phm-executive': 'Executive Dashboard',
  campaigns: 'Outreach Campaigns',
};

export default function AdminPhmPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <PhmShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
