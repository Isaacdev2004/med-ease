import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { MessagingSectionContent } from '@/features/messaging/components/MessagingSections';
import {
  MessagingTabs,
  getMessagingSectionFromPath,
} from '@/features/messaging/components/MessagingTabs';
import { useMessagingPermissions } from '@/features/messaging/hooks/use-messaging-permissions';
import type { MessagingFilters } from '@/services/messaging/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface MessagingShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
  userId?: string;
}

export function MessagingShell({
  basePath,
  variant = 'professional',
  title = 'Messaging & Notifications',
  facilityId = 'fac-001',
  userId,
}: MessagingShellProps) {
  const [location] = useLocation();
  const perms = useMessagingPermissions();
  const section = getMessagingSectionFromPath(location);
  const scopedFilters = useMemo(
    (): MessagingFilters => ({ facilityId, userId }),
    [facilityId, userId],
  );

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view messaging."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise messaging and notification center — multi-channel delivery, campaigns, broadcasts, templates, and delivery tracking."
    >
      <div className="space-y-6">
        <MessagingTabs basePath={basePath} variant={variant} />
        <MessagingSectionContent
          section={section}
          filters={scopedFilters}
          variant={variant}
        />
      </div>
    </PageShell>
  );
}
