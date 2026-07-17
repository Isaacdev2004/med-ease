import { useLocation } from 'wouter';

import { CdssShell } from '@/features/cdss/components/CdssShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'cdss'
  | 'knowledge-base'
  | 'rules-engine'
  | 'cdss-order-sets'
  | 'cdss-guidelines'
  | 'cdss-analytics'
  | 'cdss-audit';

function resolveSegment(location: string): Segment {
  if (location.includes('/knowledge-base')) return 'knowledge-base';
  if (location.includes('/rules-engine')) return 'rules-engine';
  if (location.includes('/cdss-order-sets')) return 'cdss-order-sets';
  if (location.includes('/cdss-guidelines')) return 'cdss-guidelines';
  if (location.includes('/cdss-analytics')) return 'cdss-analytics';
  if (location.includes('/cdss-audit')) return 'cdss-audit';
  return 'cdss';
}

const TITLES: Record<Segment, string> = {
  cdss: 'Clinical Decision Support',
  'knowledge-base': 'Knowledge Base',
  'rules-engine': 'Rules Engine',
  'cdss-order-sets': 'Order Sets Administration',
  'cdss-guidelines': 'Guidelines Administration',
  'cdss-analytics': 'CDSS Analytics',
  'cdss-audit': 'CDSS Audit Trail',
};

export default function AdminCdssPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <CdssShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
