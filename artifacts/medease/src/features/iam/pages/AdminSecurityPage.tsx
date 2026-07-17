import { useLocation } from 'wouter';

import { SecurityShell } from '@/features/iam/components/SecurityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'security'
  | 'identity'
  | 'roles'
  | 'permissions'
  | 'policies'
  | 'organizations'
  | 'tenants'
  | 'sessions'
  | 'oauth-clients'
  | 'api-keys'
  | 'sso'
  | 'saml'
  | 'openid'
  | 'mfa'
  | 'device-trust'
  | 'consent'
  | 'delegation'
  | 'break-glass'
  | 'security-incidents'
  | 'security-analytics'
  | 'audit-events';

function resolveSegment(location: string): Segment {
  const paths: Segment[] = [
    'audit-events',
    'security-analytics',
    'security-incidents',
    'break-glass',
    'delegation',
    'device-trust',
    'oauth-clients',
    'api-keys',
    'organizations',
    'permissions',
    'openid',
    'identity',
    'tenants',
    'sessions',
    'policies',
    'consent',
    'saml',
    'sso',
    'mfa',
    'roles',
  ];
  for (const p of paths) {
    if (location.includes(`/${p}`)) return p;
  }
  return 'security';
}

const TITLES: Record<Segment, string> = {
  security: 'Security Hub',
  identity: 'Identity',
  roles: 'Roles',
  permissions: 'Permissions',
  policies: 'Policies',
  organizations: 'Organizations',
  tenants: 'Tenants',
  sessions: 'Sessions',
  'oauth-clients': 'OAuth Clients',
  'api-keys': 'API Keys',
  sso: 'SSO',
  saml: 'SAML',
  openid: 'OpenID Connect',
  mfa: 'MFA',
  'device-trust': 'Device Trust',
  consent: 'Consent Management',
  delegation: 'Delegated Access',
  'break-glass': 'Break-Glass Access',
  'security-incidents': 'Security Incidents',
  'security-analytics': 'Security Analytics',
  'audit-events': 'Audit Events',
};

export default function AdminSecurityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <SecurityShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
