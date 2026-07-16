import type { BankAccount, CashAccount } from '@/services/finance/types';

export function totalCashPosition(cash: CashAccount[], banks: BankAccount[]): number {
  return cash.reduce((s, c) => s + c.balance, 0) + banks.reduce((s, b) => s + b.balance, 0);
}

export function cashForecast(accounts: CashAccount[], months = 6, monthlyInflow = 500000, monthlyOutflow = 420000): { month: string; balance: number }[] {
  let balance = accounts.reduce((s, a) => s + a.balance, 0);
  return Array.from({ length: months }, (_, i) => {
    balance += monthlyInflow - monthlyOutflow;
    return { month: `M${i + 1}`, balance: Math.round(balance) };
  });
}

export function reconcileVariance(statementBalance: number, bookBalance: number): number {
  return statementBalance - bookBalance;
}
