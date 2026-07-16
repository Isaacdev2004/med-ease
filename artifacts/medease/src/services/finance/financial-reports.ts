import type { FinancialStatement, TrialBalanceLine } from '@/services/finance/types';

export function buildBalanceSheet(trialBalance: TrialBalanceLine[], asOfDate: string): FinancialStatement {
  const assets = trialBalance.filter((l) => l.accountType === 'asset');
  const liabilities = trialBalance.filter((l) => l.accountType === 'liability');
  const equity = trialBalance.filter((l) => l.accountType === 'equity');
  const totalAssets = assets.reduce((s, l) => s + l.balance, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.balance, 0);
  const totalEquity = equity.reduce((s, l) => s + l.balance, 0);
  return {
    statementId: `bs-${asOfDate}`,
    type: 'balance_sheet',
    title: 'Balance Sheet',
    asOfDate,
    lines: [...assets, ...liabilities, ...equity].map((l) => ({ label: `${l.accountCode} ${l.accountName}`, amount: l.balance, category: l.accountType })),
    totals: { assets: totalAssets, liabilities: totalLiabilities, equity: totalEquity, liabilitiesAndEquity: totalLiabilities + totalEquity },
  };
}

export function buildProfitAndLoss(trialBalance: TrialBalanceLine[], asOfDate: string): FinancialStatement {
  const revenue = trialBalance.filter((l) => l.accountType === 'revenue');
  const expenses = trialBalance.filter((l) => l.accountType === 'expense');
  const totalRevenue = revenue.reduce((s, l) => s + l.balance, 0);
  const totalExpenses = expenses.reduce((s, l) => s + l.balance, 0);
  return {
    statementId: `pl-${asOfDate}`,
    type: 'profit_loss',
    title: 'Profit & Loss',
    asOfDate,
    lines: [...revenue, ...expenses].map((l) => ({ label: `${l.accountCode} ${l.accountName}`, amount: l.balance, category: l.accountType })),
    totals: { revenue: totalRevenue, expenses: totalExpenses, netIncome: totalRevenue - totalExpenses, grossMargin: totalRevenue * 0.42 },
  };
}

export function buildCashFlowStatement(asOfDate: string, operating = 850000, investing = -320000, financing = -150000): FinancialStatement {
  return {
    statementId: `cf-${asOfDate}`,
    type: 'cash_flow',
    title: 'Cash Flow Statement',
    asOfDate,
    lines: [
      { label: 'Operating Activities', amount: operating, category: 'operating' },
      { label: 'Investing Activities', amount: investing, category: 'investing' },
      { label: 'Financing Activities', amount: financing, category: 'financing' },
    ],
    totals: { netCashFlow: operating + investing + financing },
  };
}
