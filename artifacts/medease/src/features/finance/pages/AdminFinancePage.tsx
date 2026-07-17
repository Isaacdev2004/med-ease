import { useLocation } from 'wouter';

import { FinanceShell } from '@/features/finance/components/FinanceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'finance'
  | 'general-ledger'
  | 'journals'
  | 'trial-balance'
  | 'accounts-payable'
  | 'accounts-receivable'
  | 'budgets'
  | 'finance-assets'
  | 'cash-management'
  | 'financial-statements'
  | 'finance-analytics';

function resolveSegment(location: string): Segment {
  if (location.includes('/general-ledger')) return 'general-ledger';
  if (location.includes('/journals')) return 'journals';
  if (location.includes('/trial-balance')) return 'trial-balance';
  if (location.includes('/accounts-payable')) return 'accounts-payable';
  if (location.includes('/accounts-receivable')) return 'accounts-receivable';
  if (location.includes('/budgets')) return 'budgets';
  if (location.includes('/finance-assets')) return 'finance-assets';
  if (location.includes('/cash-management')) return 'cash-management';
  if (location.includes('/financial-statements')) return 'financial-statements';
  if (location.includes('/finance-analytics')) return 'finance-analytics';
  return 'finance';
}

const TITLES: Record<Segment, string> = {
  finance: 'Finance Management',
  'general-ledger': 'General Ledger',
  journals: 'Journal Entries',
  'trial-balance': 'Trial Balance',
  'accounts-payable': 'Accounts Payable',
  'accounts-receivable': 'Accounts Receivable',
  budgets: 'Budgets',
  'finance-assets': 'Fixed Assets',
  'cash-management': 'Cash Management',
  'financial-statements': 'Financial Statements',
  'finance-analytics': 'Finance Analytics',
};

export default function AdminFinancePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <FinanceShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
