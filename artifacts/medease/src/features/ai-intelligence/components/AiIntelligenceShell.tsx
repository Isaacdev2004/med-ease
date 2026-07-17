import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { AiIntelligenceSectionContent } from '@/features/ai-intelligence/components/AiIntelligenceSections';
import {
  AiIntelligenceTabs,
  getAiSectionFromPath,
} from '@/features/ai-intelligence/components/AiIntelligenceTabs';
import { useAiPermissions } from '@/features/ai-intelligence/hooks/use-ai-permissions';
import type { AiIntelligenceFilters } from '@/services/ai-intelligence/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface AiIntelligenceShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function AiIntelligenceShell({
  basePath,
  variant = 'professional',
  title = 'AI Clinical Intelligence',
  facilityId = 'fac-001',
}: AiIntelligenceShellProps) {
  const [location] = useLocation();
  const perms = useAiPermissions();
  const section = getAiSectionFromPath(location, variant);
  const scopedFilters = useMemo(
    (): AiIntelligenceFilters => ({ facilityId }),
    [facilityId],
  );

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view AI clinical intelligence."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise AI platform — predictive analytics, clinical copilot, operational forecasting, model governance, and explainable AI across the Med-ease ecosystem."
    >
      <div className="space-y-6">
        <AiIntelligenceTabs basePath={basePath} variant={variant} />
        <AiIntelligenceSectionContent
          section={section}
          filters={scopedFilters}
        />
      </div>
    </PageShell>
  );
}
