import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { WorkflowSectionContent } from '@/features/workflows/components/WorkflowSections';
import { WorkflowTabs, getWorkflowSectionFromPath } from '@/features/workflows/components/WorkflowTabs';
import { useWorkflowPermissions } from '@/features/workflows/hooks/use-workflow-permissions';
import type { WorkflowFilters } from '@/services/workflows/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface WorkflowShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
  userId?: string;
}

export function WorkflowShell({
  basePath,
  variant = 'professional',
  title = 'Workflow Automation',
  facilityId = 'fac-001',
  userId,
}: WorkflowShellProps) {
  const [location] = useLocation();
  const perms = useWorkflowPermissions();
  const section = getWorkflowSectionFromPath(location);
  const scopedFilters = useMemo((): WorkflowFilters => ({ facilityId, userId }), [facilityId, userId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view workflows." />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise workflow automation — BPMN-inspired orchestration, approvals, SLAs, escalations, and cross-module process coordination."
    >
      <div className="space-y-6">
        <WorkflowTabs basePath={basePath} variant={variant} />
        <WorkflowSectionContent section={section} filters={scopedFilters} variant={variant} />
      </div>
    </PageShell>
  );
}
