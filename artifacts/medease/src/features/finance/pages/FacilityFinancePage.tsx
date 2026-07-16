import { useLocation } from 'wouter';

import { FinanceShell } from '@/features/finance/components/FinanceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'finance' | 'accounts-payable' | 'accounts-receivable' | 'budgets' | 'cash';

function resolveSegment(location: string): Segment {
  if (location.includes('/accounts-payable')) return 'accounts-payable';
  if (location.includes('/accounts-receivable')) return 'accounts-receivable';
  if (location.includes('/budgets')) return 'budgets';
  if (location.includes('/cash')) return 'cash';
  return 'finance';
}

const TITLES: Record<Segment, string> = {
  finance: 'Finance',
  'accounts-payable': 'Accounts Payable',
  'accounts-receivable': 'Accounts Receivable',
  budgets: 'Budgets',
  cash: 'Cash Management',
};

export default function FacilityFinancePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <FinanceShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} />;
}
