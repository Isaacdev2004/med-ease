import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { FinanceSectionContent } from '@/features/finance/components/FinanceSections';
import { FinanceTabs, getFinanceSectionFromPath } from '@/features/finance/components/FinanceTabs';
import { useFinancePermissions } from '@/features/finance/hooks/use-finance-permissions';
import type { FinanceFilters } from '@/services/finance/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface FinanceShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function FinanceShell({
  basePath,
  variant = 'professional',
  title = 'Finance',
  facilityId = 'fac-001',
}: FinanceShellProps) {
  const [location] = useLocation();
  const perms = useFinancePermissions();
  const section = getFinanceSectionFromPath(location);

  const scopedFilters = useMemo((): FinanceFilters => ({ facilityId }), [facilityId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view finance data." />
      </PageShell>
    );
  }

  return (
    <PageShell title={title} subtitle="Enterprise finance, general ledger, accounts payable/receivable, cash management, budgeting, and financial reporting.">
      <div className="space-y-6">
        <FinanceTabs basePath={basePath} variant={variant} />
        <FinanceSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
