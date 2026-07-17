import { Link, useLocation } from 'wouter';

import type { FinanceSection } from '@/features/finance/components/FinanceSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: FinanceSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Finance', path: 'finance' },
  { segment: 'revenue', label: 'Revenue', path: 'finance-revenue' },
  { segment: 'expenses', label: 'Expenses', path: 'finance-expenses' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Finance', path: 'finance' },
  { segment: 'accountsPayable', label: 'Accounts Payable', path: 'accounts-payable' },
  { segment: 'accountsReceivable', label: 'Accounts Receivable', path: 'accounts-receivable' },
  { segment: 'budgets', label: 'Budgets', path: 'budgets' },
  { segment: 'cash', label: 'Cash', path: 'cash' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Finance', path: 'finance' },
  { segment: 'generalLedger', label: 'General Ledger', path: 'general-ledger' },
  { segment: 'journals', label: 'Journals', path: 'journals' },
  { segment: 'trialBalance', label: 'Trial Balance', path: 'trial-balance' },
  { segment: 'accountsPayable', label: 'Accounts Payable', path: 'accounts-payable' },
  { segment: 'accountsReceivable', label: 'Accounts Receivable', path: 'accounts-receivable' },
  { segment: 'budgets', label: 'Budgets', path: 'budgets' },
  { segment: 'assets', label: 'Fixed Assets', path: 'finance-assets' },
  { segment: 'cash', label: 'Cash Management', path: 'cash-management' },
  { segment: 'statements', label: 'Financial Statements', path: 'financial-statements' },
  { segment: 'analytics', label: 'Analytics', path: 'finance-analytics' },
];

interface FinanceTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: FinanceTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function FinanceTabs({ basePath: _basePath, variant = 'professional' }: FinanceTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Finance sections">
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link key={tab.label} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getFinanceSectionFromPath(pathname: string): FinanceSection {
  if (pathname.includes('/finance-revenue')) return 'revenue';
  if (pathname.includes('/finance-expenses')) return 'expenses';
  if (pathname.includes('/general-ledger')) return 'generalLedger';
  if (pathname.includes('/journals')) return 'journals';
  if (pathname.includes('/trial-balance')) return 'trialBalance';
  if (pathname.includes('/accounts-payable')) return 'accountsPayable';
  if (pathname.includes('/accounts-receivable')) return 'accountsReceivable';
  if (pathname.includes('/budgets')) return 'budgets';
  if (pathname.includes('/finance-assets')) return 'assets';
  if (pathname.includes('/cash-management') || pathname.endsWith('/cash')) return 'cash';
  if (pathname.includes('/financial-statements')) return 'statements';
  if (pathname.includes('/finance-analytics')) return 'analytics';
  return 'dashboard';
}
