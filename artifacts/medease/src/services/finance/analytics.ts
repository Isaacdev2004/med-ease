import type { FinanceAnalytics } from '@/services/finance/types';
import { collectionRate } from '@/services/finance/accounts-receivable';
import { totalCashPosition } from '@/services/finance/cash-management';
import {
  buildFinanceDashboard,
  MOCK_BANK_ACCOUNTS,
  MOCK_BUDGETS,
  MOCK_CASH_ACCOUNTS,
  MOCK_RECEIVABLES,
} from '@/services/finance/mock-data';

export function computeFinanceAnalytics(facilityId?: string): FinanceAnalytics {
  const dashboard = buildFinanceDashboard(facilityId);
  const ar = facilityId
    ? MOCK_RECEIVABLES.filter((r) => r.facilityId === facilityId)
    : MOCK_RECEIVABLES;
  const budgets = facilityId
    ? MOCK_BUDGETS.filter((b) => b.facilityId === facilityId)
    : MOCK_BUDGETS;
  const cash = facilityId
    ? MOCK_CASH_ACCOUNTS.filter((c) => c.facilityId === facilityId)
    : MOCK_CASH_ACCOUNTS;
  const banks = facilityId
    ? MOCK_BANK_ACCOUNTS.filter((b) => b.facilityId === facilityId)
    : MOCK_BANK_ACCOUNTS;

  const revenue = dashboard.revenue;
  const expenses = dashboard.expenses;
  const grossMargin = dashboard.grossMargin;
  const ebitda = Math.round(revenue - expenses + 380000);

  return {
    revenue,
    expenses,
    grossMargin,
    ebitda,
    netIncome: dashboard.netIncome,
    operatingCost: Math.round(expenses * 0.85),
    collectionRate: collectionRate(ar.slice(0, 500)),
    outstandingAR: dashboard.outstandingAR,
    outstandingAP: dashboard.outstandingAP,
    cashPosition: totalCashPosition(cash, banks),
    budgetVariance: dashboard.budgetVariance,
    revenueTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
      (label, i) => ({ label, value: Math.round(revenue / 6 + i * 12000) }),
    ),
    expenseTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
      (label, i) => ({ label, value: Math.round(expenses / 6 + i * 8000) }),
    ),
    departmentProfitability: budgets
      .slice(0, 8)
      .map((b) => ({ label: b.name.slice(0, 20), value: b.variance })),
    costCenterExpenses: budgets
      .slice(0, 6)
      .map((b) => ({ label: b.costCenterId ?? 'General', value: b.spent })),
  };
}
