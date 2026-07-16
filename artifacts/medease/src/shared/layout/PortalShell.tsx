import { useState, type ReactNode } from 'react';

import type { PortalConfig } from '@/config/navigation/types';
import { Sheet, SheetContent } from '@/shared/ui/sheet';
import { useBreadcrumbs } from '@/shared/hooks/use-breadcrumbs';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { BreadcrumbNav } from '@/shared/layout/BreadcrumbNav';
import { PageContainer } from '@/shared/layout/PageContainer';
import { PortalHeader } from '@/shared/layout/PortalHeader';
import { PortalSidebar } from '@/shared/layout/PortalSidebar';

interface PortalShellProps {
  config: PortalConfig;
  children: ReactNode;
}

export function PortalShell({ config, children }: PortalShellProps) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const breadcrumbs = useBreadcrumbs(config.roleName, config.basePath);

  const sidebar = (
    <PortalSidebar
      portalName={config.roleName}
      portalBasePath={config.basePath}
      navigation={config.navigation}
      collapsed={!isMobile && collapsed}
      onToggleCollapse={() => setCollapsed((value) => !value)}
      onNavigate={() => setMobileOpen(false)}
      className="hidden lg:flex"
    />
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      {sidebar}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <PortalSidebar
            portalName={config.roleName}
            portalBasePath={config.basePath}
            navigation={config.navigation}
            collapsed={false}
            onToggleCollapse={() => setMobileOpen(false)}
            onNavigate={() => setMobileOpen(false)}
            className="flex h-full w-full border-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <PortalHeader
          userName={config.userName}
          roleName={config.roleName}
          onMenuClick={() => setMobileOpen(true)}
        />

        <div className="border-b bg-muted/20 px-4 py-3 lg:px-8">
          <PageContainer className="px-0 lg:px-0">
            <BreadcrumbNav items={breadcrumbs} />
          </PageContainer>
        </div>

        <main
          id="main-content"
          className="flex-1 overflow-y-auto py-6 md:py-8"
          role="main"
        >
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
