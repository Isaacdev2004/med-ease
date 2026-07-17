import { useLocation } from 'wouter';

import { ApiPlatformShell } from '@/features/api-platform/components/ApiPlatformShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'developer-portal'
  | 'api-keys'
  | 'oauth-apps'
  | 'webhooks'
  | 'sdk-management'
  | 'rate-limits'
  | 'api-analytics'
  | 'api-marketplace'
  | 'sandbox'
  | 'partners';

function resolveSegment(location: string): Segment {
  const paths: Segment[] = [
    'api-analytics',
    'api-marketplace',
    'sdk-management',
    'developer-portal',
    'oauth-apps',
    'rate-limits',
    'api-keys',
    'webhooks',
    'sandbox',
    'partners',
  ];
  for (const p of paths) {
    if (location.includes(`/${p}`)) return p;
  }
  return 'developer-portal';
}

const TITLES: Record<Segment, string> = {
  'developer-portal': 'Developer Portal',
  'api-keys': 'API Keys',
  'oauth-apps': 'OAuth Applications',
  webhooks: 'Webhooks',
  'sdk-management': 'SDK Management',
  'rate-limits': 'Rate Limits',
  'api-analytics': 'API Analytics',
  'api-marketplace': 'API Marketplace',
  sandbox: 'Sandbox Environments',
  partners: 'API Partners',
};

export default function AdminApiPlatformPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <ApiPlatformShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
