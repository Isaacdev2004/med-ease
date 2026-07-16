import { useQuery } from '@tanstack/react-query';

import { financeQueries } from '@/features/finance/queries/finance.queries';
import type { FinanceFilters } from '@/services/finance/types';

export function useFinanceDashboard(facilityId?: string) {
  return useQuery(financeQueries.dashboard(facilityId));
}

export function useChartOfAccounts(filters?: FinanceFilters) {
  return useQuery(financeQueries.accounts(filters));
}

export function useJournalEntries(filters?: FinanceFilters) {
  return useQuery(financeQueries.journals(filters));
}

export function useLedger(filters?: FinanceFilters) {
  return useQuery(financeQueries.ledger(filters));
}

export function useTrialBalance(facilityId?: string) {
  return useQuery(financeQueries.trialBalance(facilityId));
}

export function useAccountsPayable(filters?: FinanceFilters) {
  return useQuery(financeQueries.accountsPayable(filters));
}

export function useAccountsReceivable(filters?: FinanceFilters) {
  return useQuery(financeQueries.accountsReceivable(filters));
}

export function useBudgets(filters?: FinanceFilters) {
  return useQuery(financeQueries.budgets(filters));
}

export function useBudgetVariance(facilityId?: string) {
  return useQuery(financeQueries.budgetVariance(facilityId));
}

export function useCashManagement(filters?: FinanceFilters) {
  return useQuery(financeQueries.cash(filters));
}

export function useCashAccounts(filters?: FinanceFilters) {
  return useQuery(financeQueries.cash(filters));
}

export function useBankAccounts(filters?: FinanceFilters) {
  return useQuery(financeQueries.banks(filters));
}

export function useFinancialStatements(facilityId?: string, asOfDate?: string) {
  return useQuery(financeQueries.financialStatements(facilityId, asOfDate));
}

export function useFixedAssets(filters?: FinanceFilters) {
  return useQuery(financeQueries.assets(filters));
}

export function useAssets(filters?: FinanceFilters) {
  return useQuery(financeQueries.assets(filters));
}

export function useDepreciation(filters?: FinanceFilters) {
  return useQuery(financeQueries.depreciation(filters));
}

export function useRevenueAnalytics(facilityId?: string) {
  return useQuery(financeQueries.revenue(facilityId));
}

export function useExpenseAnalytics(facilityId?: string) {
  return useQuery(financeQueries.expenses(facilityId));
}

export function useFinanceAnalytics(facilityId?: string) {
  return useQuery(financeQueries.analytics(facilityId));
}

export function useFinanceSearch(query: string, facilityId?: string) {
  return useQuery(financeQueries.search(query, facilityId));
}

export function useFinanceFavorites(userId?: string) {
  return useQuery(financeQueries.favorites(userId));
}
