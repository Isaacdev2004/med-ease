import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { QualitySectionContent } from '@/features/quality/components/QualitySections';
import {
  QualityTabs,
  getQualitySectionFromPath,
} from '@/features/quality/components/QualityTabs';
import { useQualityPermissions } from '@/features/quality/hooks/use-quality-permissions';
import type { QualityFilters } from '@/services/quality/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface QualityShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function QualityShell({
  basePath,
  variant = 'professional',
  title = 'Quality',
  facilityId = 'fac-001',
}: QualityShellProps) {
  const [location] = useLocation();
  const perms = useQualityPermissions();
  const section = getQualitySectionFromPath(location);

  const scopedFilters = useMemo(
    (): QualityFilters => ({ facilityId }),
    [facilityId],
  );

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view quality data."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise quality management, patient safety, risk, compliance, accreditation, and clinical governance."
    >
      <div className="space-y-6">
        <QualityTabs basePath={basePath} variant={variant} />
        <QualitySectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
