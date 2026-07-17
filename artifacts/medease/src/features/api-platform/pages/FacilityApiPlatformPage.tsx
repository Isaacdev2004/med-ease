import { useLocation } from 'wouter';

import { ApiPlatformShell } from '@/features/api-platform/components/ApiPlatformShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'developer' | 'webhooks';

function resolveSegment(location: string): Segment {
  if (location.includes('/webhooks')) return 'webhooks';
  return 'developer';
}

const TITLES: Record<Segment, string> = {
  developer: 'Developer Portal',
  webhooks: 'Webhooks',
};

export default function FacilityApiPlatformPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <ApiPlatformShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
