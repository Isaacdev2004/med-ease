export { validateDoubleEntry, canPostJournal, canReverseJournal, buildReversalEntry, calculateAccountBalance } from '@/services/finance/journal-engine';

import type { ChartOfAccount, TrialBalanceLine } from '@/services/finance/types';

export function rollupAccounts(accounts: ChartOfAccount[]): Record<string, number> {
  const totals: Record<string, number> = { asset: 0, liability: 0, equity: 0, revenue: 0, expense: 0 };
  for (const a of accounts) totals[a.type] = (totals[a.type] ?? 0) + a.balance;
  return totals;
}

export function isBalancedTrialBalance(lines: TrialBalanceLine[]): boolean {
  const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
  return Math.abs(totalDebit - totalCredit) < 0.01;
}
