import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { SecuritySectionContent } from '@/features/iam/components/SecuritySections';
import {
  SecurityTabs,
  getIamSectionFromPath,
} from '@/features/iam/components/SecurityTabs';
import { useIamPermissions } from '@/features/iam/hooks/use-iam-permissions';
import type { IamFilters } from '@/services/iam/types';
import { PageShell } from '@/shared/components';
import { useScopedTenantId } from '@/shared/hooks/use-scoped-tenant-id';
import { EmptyState } from '@/shared/ui/empty-state';

interface SecurityShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  tenantId?: string;
  userId?: string;
}

export function SecurityShell({
  basePath,
  variant = 'professional',
  title = 'Enterprise Identity & Security',
  tenantId: tenantIdProp,
  userId,
}: SecurityShellProps) {
  const [location] = useLocation();
  const perms = useIamPermissions();
  const section = getIamSectionFromPath(location);
  const authTenantId = useScopedTenantId();
  const tenantId = tenantIdProp ?? authTenantId;
  const scopedFilters = useMemo((): IamFilters => {
    const filters: IamFilters = {};
    if (tenantId) filters.tenantId = tenantId;
    if (userId) filters.userId = userId;
    return filters;
  }, [tenantId, userId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view identity and security."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise IAM platform — multi-tenant identity, RBAC/ABAC, MFA, SSO, OAuth, session management, consent, break-glass, and zero-trust governance."
    >
      <div className="space-y-6">
        <SecurityTabs basePath={basePath} variant={variant} />
        <SecuritySectionContent
          section={section}
          filters={scopedFilters}
          variant={variant}
        />
      </div>
    </PageShell>
  );
}
