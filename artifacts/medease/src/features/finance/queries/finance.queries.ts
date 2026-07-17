import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { financeService } from '@/services/finance/finance.service';
import type { FinanceFilters } from '@/services/finance/types';

export const financeQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.finance.dashboard(facilityId),
    queryFn: () => financeService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  accounts: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.accounts(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getChartOfAccounts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  journals: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.journals(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getJournalEntries(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  ledger: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.ledger(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getLedger(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  trialBalance: (facilityId?: string) => ({
    queryKey: queryKeys.finance.trialBalance(facilityId),
    queryFn: () => financeService.getTrialBalance(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  accountsPayable: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.accountsPayable(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getAccountsPayable(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  accountsReceivable: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.accountsReceivable(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getAccountsReceivable(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  cash: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.cash(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getCashAccounts(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  banks: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.banks(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getBankAccounts(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  budgets: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.budgets(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getBudgets(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  budgetVariance: (facilityId?: string) => ({
    queryKey: queryKeys.finance.budgetVariance(facilityId),
    queryFn: () => financeService.getBudgetVariance(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  assets: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.assets(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getFixedAssets(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  depreciation: (filters?: FinanceFilters) => ({
    queryKey: queryKeys.finance.depreciation(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => financeService.getDepreciation(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  financialStatements: (facilityId?: string, asOfDate?: string) => ({
    queryKey: queryKeys.finance.financialStatements(facilityId, asOfDate),
    queryFn: () => financeService.getFinancialStatements(facilityId, asOfDate),
    staleTime: CACHE_TIMES.dashboard,
  }),
  revenue: (facilityId?: string) => ({
    queryKey: queryKeys.finance.revenue(facilityId),
    queryFn: () => financeService.revenueAnalytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  expenses: (facilityId?: string) => ({
    queryKey: queryKeys.finance.expenses(facilityId),
    queryFn: () => financeService.expenseAnalytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.finance.analytics(facilityId),
    queryFn: () => financeService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.finance.favorites(userId),
    queryFn: () => financeService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.finance.search(query, facilityId),
    queryFn: () => financeService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
