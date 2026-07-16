import { ChevronLeft, ChevronRight, HelpCircle, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import type { NavItem } from '@/config/navigation/types';
import { useUnreadNotificationCount } from '@/features/notifications/hooks/use-notifications';
import { toPortalRelativePath } from '@/shared/hooks/use-portal-path';
import { NotificationBadge } from '@/shared/notifications/NotificationBadge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { LAYOUT } from '@/shared/layout/constants';
import { RoleSwitcher } from '@/shared/layout/RoleSwitcher';

interface PortalSidebarProps {
  portalName: string;
  portalBasePath: string;
  navigation: NavItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function PortalSidebar({
  portalName,
  portalBasePath,
  navigation,
  collapsed,
  onToggleCollapse,
  onNavigate,
  className,
}: PortalSidebarProps) {
  const [location, setLocation] = useLocation();
  const relativeLocation = toPortalRelativePath(location, portalBasePath);
  const unreadQuery = useUnreadNotificationCount();
  const unreadCount = unreadQuery.data ?? 0;

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-sidebar transition-[width] duration-200 ease-out',
        className,
      )}
      style={{
        width: collapsed
          ? LAYOUT.sidebarWidthCollapsed
          : LAYOUT.sidebarWidthExpanded,
      }}
      aria-label={`${portalName} navigation`}
    >
      <div
        className="flex items-center border-b px-3 shrink-0"
        style={{ height: LAYOUT.headerHeight }}
      >
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 font-semibold min-w-0',
            collapsed && 'justify-center w-full',
          )}
          onClick={onNavigate}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-serif italic text-lg font-bold leading-none">M</span>
          </div>
          {!collapsed ? (
            <span className="text-lg text-sidebar-foreground truncate">Med'ease</span>
          ) : null}
        </Link>
      </div>

      {!collapsed ? (
        <div className="px-4 py-4">
          <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            {portalName}
          </p>
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {navigation.map((item) => {
          const isActive =
            relativeLocation === item.href || relativeLocation.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                  : 'text-sidebar-foreground/70',
                collapsed && 'justify-center px-2',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-primary' : 'text-sidebar-foreground/50',
                )}
              />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
              {item.href.endsWith('/notifications') && unreadCount > 0 ? (
                <NotificationBadge count={unreadCount} className="ml-auto" />
              ) : item.badge && !collapsed ? (
                <span className="ml-auto text-xs text-muted-foreground">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t p-3 space-y-2">
        {!collapsed ? (
          <>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              size="sm"
              onClick={() => setLocation('/')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
            <RoleSwitcher className="pt-2" />
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {!collapsed ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full hidden md:flex lg:hidden justify-start"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Collapse
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
