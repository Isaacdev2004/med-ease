import { useLocation } from 'wouter';

import { MessagingShell } from '@/features/messaging/components/MessagingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'messaging' | 'inbox' | 'announcements';

function resolveSegment(location: string): Segment {
  if (location.includes('/inbox')) return 'inbox';
  if (location.includes('/announcements')) return 'announcements';
  return 'messaging';
}

const TITLES: Record<Segment, string> = {
  messaging: 'Messaging',
  inbox: 'Inbox',
  announcements: 'Announcements',
};

export default function ProfessionalMessagingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <MessagingShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} />;
}
