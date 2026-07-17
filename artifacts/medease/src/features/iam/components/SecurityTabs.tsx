import { Link, useLocation } from 'wouter';

import type { IamSection } from '@/features/iam/components/SecuritySections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: IamSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Security', path: 'security' },
  { segment: 'my-access', label: 'My Access', path: 'my-access' },
  { segment: 'my-devices', label: 'My Devices', path: 'my-devices' },
  { segment: 'my-sessions', label: 'My Sessions', path: 'my-sessions' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Security', path: 'security' },
  { segment: 'users', label: 'Users', path: 'users' },
  { segment: 'roles', label: 'Roles', path: 'roles' },
  { segment: 'mfa', label: 'MFA', path: 'mfa' },
  { segment: 'audit', label: 'Audit', path: 'audit' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Security Hub', path: 'security' },
  { segment: 'identity', label: 'Identity', path: 'identity' },
  { segment: 'roles', label: 'Roles', path: 'roles' },
  { segment: 'permissions', label: 'Permissions', path: 'permissions' },
  { segment: 'policies', label: 'Policies', path: 'policies' },
  { segment: 'organizations', label: 'Organizations', path: 'organizations' },
  { segment: 'sessions', label: 'Sessions', path: 'sessions' },
  { segment: 'oauth-clients', label: 'OAuth Clients', path: 'oauth-clients' },
  { segment: 'api-keys', label: 'IAM API Keys', path: 'iam-api-keys' },
  { segment: 'sso', label: 'SSO', path: 'sso' },
  { segment: 'saml', label: 'SAML', path: 'saml' },
  { segment: 'openid', label: 'OpenID', path: 'openid' },
  { segment: 'mfa', label: 'MFA', path: 'mfa' },
  { segment: 'device-trust', label: 'Device Trust', path: 'device-trust' },
  { segment: 'consent', label: 'Consent', path: 'consent' },
  { segment: 'delegation', label: 'Delegation', path: 'delegation' },
  { segment: 'break-glass', label: 'Break-Glass', path: 'break-glass' },
  { segment: 'security-incidents', label: 'Incidents', path: 'security-incidents' },
  { segment: 'security-analytics', label: 'Analytics', path: 'security-analytics' },
  { segment: 'audit-events', label: 'Audit Events', path: 'audit-events' },
];

interface SecurityTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: SecurityTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function SecurityTabs({ basePath: _basePath, variant = 'professional' }: SecurityTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Security sections">
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

const ADMIN_PATH_MAP: [string, IamSection][] = [
  ['/audit-events', 'audit-events'],
  ['/security-analytics', 'security-analytics'],
  ['/security-incidents', 'security-incidents'],
  ['/break-glass', 'break-glass'],
  ['/delegation', 'delegation'],
  ['/device-trust', 'device-trust'],
  ['/oauth-clients', 'oauth-clients'],
  ['/iam-api-keys', 'api-keys'],
  ['/organizations', 'organizations'],
  ['/permissions', 'permissions'],
  ['/openid', 'openid'],
  ['/identity', 'identity'],
  ['/sessions', 'sessions'],
  ['/audit-logs', 'audit-events'],
  ['/policies', 'policies'],
  ['/consent', 'consent'],
  ['/my-sessions', 'my-sessions'],
  ['/my-devices', 'my-devices'],
  ['/my-access', 'my-access'],
  ['/users', 'identity'],
  ['/roles', 'roles'],
  ['/audit', 'audit'],
  ['/saml', 'saml'],
  ['/sso', 'sso'],
  ['/mfa', 'mfa'],
];

export function getIamSectionFromPath(pathname: string): IamSection {
  for (const [path, section] of ADMIN_PATH_MAP) {
    if (pathname.includes(path)) return section;
  }
  return 'dashboard';
}
