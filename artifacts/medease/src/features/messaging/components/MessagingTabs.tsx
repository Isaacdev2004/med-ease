import { Link, useLocation } from 'wouter';

import type { MessagingSection } from '@/features/messaging/components/MessagingSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: MessagingSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Messaging', path: 'messaging' },
  { segment: 'inbox', label: 'Inbox', path: 'inbox' },
  { segment: 'announcements', label: 'Announcements', path: 'announcements' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Messaging', path: 'messaging' },
  { segment: 'broadcasts', label: 'Broadcasts', path: 'broadcasts' },
  {
    segment: 'message-templates',
    label: 'Templates',
    path: 'message-templates',
  },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Messaging', path: 'messaging' },
  {
    segment: 'message-center',
    label: 'Message Center',
    path: 'message-center',
  },
  { segment: 'channels', label: 'Channels', path: 'channels' },
  { segment: 'templates', label: 'Templates', path: 'templates' },
  { segment: 'campaigns', label: 'Campaigns', path: 'campaigns' },
  {
    segment: 'delivery-tracking',
    label: 'Delivery',
    path: 'delivery-tracking',
  },
  {
    segment: 'messaging-analytics',
    label: 'Analytics',
    path: 'messaging-analytics',
  },
  { segment: 'integrations', label: 'Integrations', path: 'integrations' },
];

interface MessagingTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: MessagingTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function MessagingTabs({
  basePath: _basePath,
  variant = 'professional',
}: MessagingTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Messaging sections"
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

const PATH_MAP: [string, MessagingSection][] = [
  ['/messaging-analytics', 'messaging-analytics'],
  ['/delivery-tracking', 'delivery-tracking'],
  ['/message-center', 'message-center'],
  ['/message-templates', 'message-templates'],
  ['/announcements', 'announcements'],
  ['/integrations', 'integrations'],
  ['/broadcasts', 'broadcasts'],
  ['/campaigns', 'campaigns'],
  ['/channels', 'channels'],
  ['/templates', 'templates'],
  ['/inbox', 'inbox'],
];

export function getMessagingSectionFromPath(
  pathname: string,
): MessagingSection {
  for (const [path, section] of PATH_MAP) {
    if (pathname.includes(path)) return section;
  }
  return 'dashboard';
}
