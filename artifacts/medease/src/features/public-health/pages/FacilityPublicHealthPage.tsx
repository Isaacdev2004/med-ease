import { useLocation } from 'wouter';

import { PublicHealthShell } from '@/features/public-health/components/PublicHealthShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'public-health'
  | 'outbreaks'
  | 'contact-tracing'
  | 'environmental-health'
  | 'community-outreach';

function resolveSegment(location: string): Segment {
  if (location.includes('/outbreaks')) return 'outbreaks';
  if (location.includes('/contact-tracing')) return 'contact-tracing';
  if (location.includes('/environmental-health')) return 'environmental-health';
  if (location.includes('/community-outreach')) return 'community-outreach';
  return 'public-health';
}

const TITLES: Record<Segment, string> = {
  'public-health': 'Public Health',
  outbreaks: 'Outbreak Response',
  'contact-tracing': 'Contact Tracing',
  'environmental-health': 'Environmental Health',
  'community-outreach': 'Community Outreach',
};

export default function FacilityPublicHealthPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <PublicHealthShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
