import { Link, useLocation } from 'wouter';

import type { PlatformAdminSection } from '@/features/platform-admin/components/PlatformAdminSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: PlatformAdminSection; label: string; path: string };

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Platform', path: 'platform' },
  { segment: 'tenants', label: 'Tenants', path: 'tenants' },
  { segment: 'hospital-setup', label: 'Hospitals', path: 'hospital-setup' },
  { segment: 'facility-setup', label: 'Facilities', path: 'facility-setup' },
  { segment: 'departments', label: 'Departments', path: 'departments' },
  { segment: 'localization', label: 'Localization', path: 'localization' },
  { segment: 'branding', label: 'Branding', path: 'branding' },
  { segment: 'licenses', label: 'Licenses', path: 'licenses' },
  { segment: 'storage', label: 'Storage', path: 'storage' },
  {
    segment: 'feature-flags-admin',
    label: 'Feature Flags',
    path: 'feature-flags-admin',
  },
  { segment: 'system-jobs', label: 'System Jobs', path: 'system-jobs' },
  { segment: 'system-health', label: 'System Health', path: 'system-health' },
  { segment: 'backups', label: 'Backups', path: 'backups' },
  { segment: 'maintenance', label: 'Maintenance', path: 'maintenance' },
  { segment: 'platform-audit', label: 'Audit', path: 'platform-audit' },
  {
    segment: 'configurations',
    label: 'Configurations',
    path: 'configurations',
  },
];

const READONLY_TABS: Tab[] = [
  {
    segment: 'platform-settings',
    label: 'Platform Settings',
    path: 'platform-settings',
  },
];

interface PlatformAdminTabsProps {
  basePath: string;
  variant?: 'admin' | 'readonly';
}

export function PlatformAdminTabs({
  basePath: _basePath,
  variant = 'admin',
}: PlatformAdminTabsProps) {
  const [location] = useLocation();
  const tabs = variant === 'readonly' ? READONLY_TABS : ADMIN_TABS;

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Platform admin sections"
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

const PATH_MAP: [string, PlatformAdminSection][] = [
  ['/feature-flags-admin', 'feature-flags-admin'],
  ['/feature-flags', 'feature-flags-admin'],
  ['/system-status', 'system-health'],
  ['/platform-audit', 'platform-audit'],
  ['/hospital-setup', 'hospital-setup'],
  ['/facility-setup', 'facility-setup'],
  ['/platform-settings', 'platform-settings'],
  ['/system-health', 'system-health'],
  ['/system-jobs', 'system-jobs'],
  ['/departments', 'departments'],
  ['/localization', 'localization'],
  ['/maintenance', 'maintenance'],
  ['/configurations', 'configurations'],
  ['/tenants', 'tenants'],
  ['/branding', 'branding'],
  ['/licenses', 'licenses'],
  ['/storage', 'storage'],
  ['/backups', 'backups'],
];

export function getPlatformAdminSectionFromPath(
  pathname: string,
): PlatformAdminSection {
  for (const [path, section] of PATH_MAP) {
    if (pathname.includes(path)) return section;
  }
  if (pathname.includes('/platform-settings')) return 'platform-settings';
  return 'dashboard';
}
