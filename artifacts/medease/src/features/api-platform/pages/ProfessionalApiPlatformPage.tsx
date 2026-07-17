import { useLocation } from 'wouter';

import { ApiPlatformShell } from '@/features/api-platform/components/ApiPlatformShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'developer' | 'api-docs';

function resolveSegment(location: string): Segment {
  if (location.includes('/api-docs')) return 'api-docs';
  return 'developer';
}

const TITLES: Record<Segment, string> = {
  developer: 'Developer Portal',
  'api-docs': 'API Documentation',
};

export default function ProfessionalApiPlatformPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <ApiPlatformShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
