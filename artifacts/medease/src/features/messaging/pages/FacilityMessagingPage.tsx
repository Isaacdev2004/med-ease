import { useLocation } from 'wouter';

import { MessagingShell } from '@/features/messaging/components/MessagingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'messaging' | 'broadcasts' | 'message-templates';

function resolveSegment(location: string): Segment {
  if (location.includes('/broadcasts')) return 'broadcasts';
  if (location.includes('/message-templates')) return 'message-templates';
  return 'messaging';
}

const TITLES: Record<Segment, string> = {
  messaging: 'Messaging',
  broadcasts: 'Broadcasts',
  'message-templates': 'Message Templates',
};

export default function FacilityMessagingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <MessagingShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
