import { useLocation } from 'wouter';

import { MessagingShell } from '@/features/messaging/components/MessagingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'messaging'
  | 'message-center'
  | 'channels'
  | 'templates'
  | 'campaigns'
  | 'delivery-tracking'
  | 'messaging-analytics'
  | 'integrations';

function resolveSegment(location: string): Segment {
  const paths: Segment[] = [
    'messaging-analytics',
    'delivery-tracking',
    'message-center',
    'integrations',
    'campaigns',
    'channels',
    'templates',
  ];
  for (const p of paths) {
    if (location.includes(`/${p}`)) return p;
  }
  return 'messaging';
}

const TITLES: Record<Segment, string> = {
  messaging: 'Messaging Hub',
  'message-center': 'Message Center',
  channels: 'Channels',
  templates: 'Templates',
  campaigns: 'Campaigns',
  'delivery-tracking': 'Delivery Tracking',
  'messaging-analytics': 'Messaging Analytics',
  integrations: 'Integrations',
};

export default function AdminMessagingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <MessagingShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
