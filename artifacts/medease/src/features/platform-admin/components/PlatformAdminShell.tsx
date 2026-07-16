import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { PlatformAdminSectionContent } from '@/features/platform-admin/components/PlatformAdminSections';
import { PlatformAdminTabs, getPlatformAdminSectionFromPath } from '@/features/platform-admin/components/PlatformAdminTabs';
import { usePlatformAdminPermissions } from '@/features/platform-admin/hooks/use-platform-admin-permissions';
import type { PlatformFilters } from '@/services/platform-admin/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface PlatformAdminShellProps {
  basePath: string;
  variant?: 'admin' | 'readonly';
  title?: string;
  tenantId?: string;
  facilityId?: string;
}

export function PlatformAdminShell({
  basePath,
  variant = 'admin',
  title = 'Platform Administration',
  tenantId,
  facilityId,
}: PlatformAdminShellProps) {
  const [location] = useLocation();
  const perms = usePlatformAdminPermissions();
  const section = getPlatformAdminSectionFromPath(location);
  const scopedFilters = useMemo((): PlatformFilters => ({ tenantId, facilityId }), [tenantId, facilityId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view platform administration." />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Multi-tenant platform administration — tenant lifecycle, facility configuration, localization, branding, licensing, system health, and operational controls."
    >
      <div className="space-y-6">
        <PlatformAdminTabs basePath={basePath} variant={variant} />
        <PlatformAdminSectionContent section={section} filters={scopedFilters} variant={variant} />
      </div>
    </PageShell>
  );
}
