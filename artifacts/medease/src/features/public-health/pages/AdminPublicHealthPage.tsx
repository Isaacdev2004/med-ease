import { useLocation } from 'wouter';

import { PublicHealthShell } from '@/features/public-health/components/PublicHealthShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'public-health' | 'epidemiology' | 'immunization-registry' | 'maternal-child-health' | 'school-health' | 'occupational-health' | 'public-health-analytics' | 'community-health-dashboard';

function resolveSegment(location: string): Segment {
  if (location.includes('/epidemiology')) return 'epidemiology';
  if (location.includes('/immunization-registry')) return 'immunization-registry';
  if (location.includes('/maternal-child-health')) return 'maternal-child-health';
  if (location.includes('/school-health')) return 'school-health';
  if (location.includes('/occupational-health')) return 'occupational-health';
  if (location.includes('/public-health-analytics')) return 'public-health-analytics';
  if (location.includes('/community-health-dashboard')) return 'community-health-dashboard';
  return 'public-health';
}

const TITLES: Record<Segment, string> = {
  'public-health': 'Public Health Hub',
  epidemiology: 'Epidemiology',
  'immunization-registry': 'Immunization Registry',
  'maternal-child-health': 'Maternal & Child Health',
  'school-health': 'School Health',
  'occupational-health': 'Occupational Health',
  'public-health-analytics': 'Public Health Analytics',
  'community-health-dashboard': 'Community Health Dashboard',
};

export default function AdminPublicHealthPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <PublicHealthShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
