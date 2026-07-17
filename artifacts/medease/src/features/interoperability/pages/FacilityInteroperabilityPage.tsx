import { useLocation } from 'wouter';

import { InteroperabilityShell } from '@/features/interoperability/components/InteroperabilityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'interoperability'
  | 'interface-engine'
  | 'integration-queue'
  | 'webhooks'
  | 'api-clients';

function resolveSegment(location: string): Segment {
  if (location.includes('/interface-engine')) return 'interface-engine';
  if (location.includes('/integration-queue')) return 'integration-queue';
  if (location.includes('/webhooks')) return 'webhooks';
  if (location.includes('/api-clients')) return 'api-clients';
  return 'interoperability';
}

const TITLES: Record<Segment, string> = {
  interoperability: 'Integration Dashboard',
  'interface-engine': 'Interface Engine',
  'integration-queue': 'Queue Monitor',
  webhooks: 'Webhooks',
  'api-clients': 'API Clients',
};

export default function FacilityInteroperabilityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <InteroperabilityShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
