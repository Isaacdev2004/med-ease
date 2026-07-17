import { useLocation } from 'wouter';

import { PublicHealthShell } from '@/features/public-health/components/PublicHealthShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'public-health'
  | 'disease-surveillance'
  | 'immunizations'
  | 'community-programs'
  | 'sdoh';

function resolveSegment(location: string): Segment {
  if (location.includes('/disease-surveillance')) return 'disease-surveillance';
  if (location.includes('/immunizations')) return 'immunizations';
  if (location.includes('/community-programs')) return 'community-programs';
  if (location.includes('/sdoh')) return 'sdoh';
  return 'public-health';
}

const TITLES: Record<Segment, string> = {
  'public-health': 'Public Health Overview',
  'disease-surveillance': 'Disease Surveillance',
  immunizations: 'Immunizations',
  'community-programs': 'Community Programs',
  sdoh: 'Social Determinants of Health',
};

export default function ProfessionalPublicHealthPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <PublicHealthShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
