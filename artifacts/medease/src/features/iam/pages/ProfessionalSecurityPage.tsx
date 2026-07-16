import { useLocation } from 'wouter';

import { SecurityShell } from '@/features/iam/components/SecurityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'security' | 'my-access' | 'my-devices' | 'my-sessions';

function resolveSegment(location: string): Segment {
  if (location.includes('/my-access')) return 'my-access';
  if (location.includes('/my-devices')) return 'my-devices';
  if (location.includes('/my-sessions')) return 'my-sessions';
  return 'security';
}

const TITLES: Record<Segment, string> = {
  security: 'Security',
  'my-access': 'My Access',
  'my-devices': 'My Devices',
  'my-sessions': 'My Sessions',
};

export default function ProfessionalSecurityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <SecurityShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} />;
}
