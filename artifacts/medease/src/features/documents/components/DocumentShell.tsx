import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { DocumentSectionContent } from '@/features/documents/components/DocumentSections';
import {
  DocumentTabs,
  getDocumentSectionFromPath,
} from '@/features/documents/components/DocumentTabs';
import { useDocumentPermissions } from '@/features/documents/hooks/use-document-permissions';
import type { DocumentFilters } from '@/services/documents/types';
import { PageShell } from '@/shared/components';
import { useScopedTenantId } from '@/shared/hooks/use-scoped-tenant-id';
import { EmptyState } from '@/shared/ui/empty-state';

interface DocumentShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  tenantId?: string;
  facilityId?: string;
  userId?: string;
}

export function DocumentShell({
  basePath,
  variant = 'professional',
  title = 'Enterprise Documents',
  tenantId: tenantIdProp,
  facilityId = 'fac-001',
  userId,
}: DocumentShellProps) {
  const [location] = useLocation();
  const perms = useDocumentPermissions();
  const section = getDocumentSectionFromPath(location);
  const authTenantId = useScopedTenantId();
  const tenantId = tenantIdProp ?? authTenantId;
  const scopedFilters = useMemo((): DocumentFilters => {
    const filters: DocumentFilters = { facilityId };
    if (tenantId) filters.tenantId = tenantId;
    if (userId) filters.userId = userId;
    return filters;
  }, [tenantId, facilityId, userId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view documents."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise document platform — centralized storage, versioning, OCR, e-signatures, records retention, legal hold, and secure sharing across all Med-ease modules."
    >
      <div className="space-y-6">
        <DocumentTabs basePath={basePath} variant={variant} />
        <DocumentSectionContent
          section={section}
          filters={scopedFilters}
          variant={variant}
        />
      </div>
    </PageShell>
  );
}
