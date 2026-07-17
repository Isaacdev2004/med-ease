import { Link, useLocation } from 'wouter';

import type { ApiPlatformSection } from '@/features/api-platform/components/ApiPlatformSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: ApiPlatformSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'developer', label: 'Developer Portal', path: 'developer' },
  { segment: 'api-docs', label: 'API Docs', path: 'api-docs' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'developer', label: 'Developer Portal', path: 'developer' },
  { segment: 'webhooks', label: 'Webhooks', path: 'webhooks' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'developer-portal', label: 'Portal', path: 'developer-portal' },
  { segment: 'api-keys', label: 'API Keys', path: 'api-keys' },
  { segment: 'oauth-apps', label: 'OAuth Apps', path: 'oauth-apps' },
  { segment: 'webhooks', label: 'Webhooks', path: 'webhooks' },
  { segment: 'sdk-management', label: 'SDK', path: 'sdk-management' },
  { segment: 'rate-limits', label: 'Rate Limits', path: 'rate-limits' },
  { segment: 'api-analytics', label: 'Analytics', path: 'api-analytics' },
  { segment: 'api-marketplace', label: 'Marketplace', path: 'api-marketplace' },
  { segment: 'sandbox', label: 'Sandbox', path: 'sandbox' },
  { segment: 'partners', label: 'Partners', path: 'partners' },
];

interface ApiPlatformTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: ApiPlatformTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function ApiPlatformTabs({
  basePath: _basePath,
  variant = 'professional',
}: ApiPlatformTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="API platform sections"
    >
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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

const PATH_MAP: [string, ApiPlatformSection][] = [
  ['/developer-portal', 'developer-portal'],
  ['/api-analytics', 'api-analytics'],
  ['/api-marketplace', 'api-marketplace'],
  ['/sdk-management', 'sdk-management'],
  ['/oauth-apps', 'oauth-apps'],
  ['/rate-limits', 'rate-limits'],
  ['/api-keys', 'api-keys'],
  ['/api-docs', 'api-docs'],
  ['/webhooks', 'webhooks'],
  ['/sandbox', 'sandbox'],
  ['/partners', 'partners'],
  ['/developer', 'developer'],
];

export function getApiPlatformSectionFromPath(
  pathname: string,
): ApiPlatformSection {
  for (const [path, section] of PATH_MAP) {
    if (pathname.includes(path)) return section;
  }
  return 'developer';
}
