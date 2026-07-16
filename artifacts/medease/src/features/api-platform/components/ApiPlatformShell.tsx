import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { ApiPlatformSectionContent } from '@/features/api-platform/components/ApiPlatformSections';
import { ApiPlatformTabs, getApiPlatformSectionFromPath } from '@/features/api-platform/components/ApiPlatformTabs';
import { useApiPlatformPermissions } from '@/features/api-platform/hooks/use-api-platform-permissions';
import type { ApiPlatformFilters } from '@/services/api-platform/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface ApiPlatformShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  partnerId?: string;
  userId?: string;
}

export function ApiPlatformShell({
  basePath,
  variant = 'professional',
  title = 'Developer Platform',
  partnerId,
  userId,
}: ApiPlatformShellProps) {
  const [location] = useLocation();
  const perms = useApiPlatformPermissions();
  const section = getApiPlatformSectionFromPath(location);
  const scopedFilters = useMemo((): ApiPlatformFilters => ({ partnerId, userId }), [partnerId, userId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view the API platform." />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise API management — keys, OAuth, webhooks, SDKs, rate limits, analytics, and partner marketplace."
    >
      <div className="space-y-6">
        <ApiPlatformTabs basePath={basePath} variant={variant} />
        <ApiPlatformSectionContent section={section} filters={scopedFilters} variant={variant} />
      </div>
    </PageShell>
  );
}
