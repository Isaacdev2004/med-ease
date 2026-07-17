import { useLocation } from 'wouter';

import { SecurityShell } from '@/features/iam/components/SecurityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'security' | 'users' | 'roles' | 'mfa' | 'audit';

function resolveSegment(location: string): Segment {
  if (location.includes('/users')) return 'users';
  if (location.includes('/roles')) return 'roles';
  if (location.includes('/mfa')) return 'mfa';
  if (location.includes('/audit')) return 'audit';
  return 'security';
}

const TITLES: Record<Segment, string> = {
  security: 'Security',
  users: 'Users',
  roles: 'Roles',
  mfa: 'MFA',
  audit: 'Audit',
};

export default function FacilitySecurityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <SecurityShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
