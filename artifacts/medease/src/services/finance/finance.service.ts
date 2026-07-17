import { financeRepository } from '@/services/finance/repository';
import type {
  CreateBudgetInput,
  CreateJournalInput,
  FinanceFilters,
  FixedAsset,
  ReconcileBankInput,
  RecordPaymentInput,
  VendorBill,
} from '@/services/finance/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const financeService = {
  async dashboard(facilityId?: string) {
    await delay();
    return financeRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return financeRepository.analytics(facilityId);
  },
  async getChartOfAccounts(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getChartOfAccounts(filters);
  },
  async getJournalEntries(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getJournalEntries(filters);
  },
  async getJournal(journalId: string) {
    await delay();
    return financeRepository.getJournal(journalId);
  },
  async getLedger(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getLedger(filters);
  },
  async getTrialBalance(facilityId?: string) {
    await delay();
    return financeRepository.getTrialBalance(facilityId);
  },
  async getFiscalPeriods() {
    await delay();
    return financeRepository.getFiscalPeriods();
  },
  async getAccountsPayable(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getAccountsPayable(filters);
  },
  async getAccountsReceivable(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getAccountsReceivable(filters);
  },
  async getCashAccounts(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getCashAccounts(filters);
  },
  async getBankAccounts(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getBankAccounts(filters);
  },
  async getBudgets(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getBudgets(filters);
  },
  async getBudgetVariance(facilityId?: string) {
    await delay();
    return financeRepository.getBudgetVariance(facilityId);
  },
  async getFixedAssets(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getFixedAssets(filters);
  },
  async getDepreciation(filters?: FinanceFilters) {
    await delay();
    return financeRepository.getDepreciation(filters);
  },
  async getFinancialStatements(facilityId?: string, asOfDate?: string) {
    await delay();
    return financeRepository.getFinancialStatements(facilityId, asOfDate);
  },
  async revenueAnalytics(facilityId?: string) {
    await delay();
    return financeRepository.revenueAnalytics(facilityId);
  },
  async expenseAnalytics(facilityId?: string) {
    await delay();
    return financeRepository.expenseAnalytics(facilityId);
  },
  async apAging(facilityId?: string) {
    await delay();
    return financeRepository.apAging(facilityId);
  },
  async arAging(facilityId?: string) {
    await delay();
    return financeRepository.arAging(facilityId);
  },
  async cashForecast(facilityId?: string) {
    await delay();
    return financeRepository.cashForecast(facilityId);
  },
  async threeWayMatch(billId: string) {
    await delay();
    return financeRepository.threeWayMatch(billId);
  },

  async createJournal(input: CreateJournalInput) {
    await delay();
    return financeRepository.createJournal(input);
  },
  async approveJournal(journalId: string) {
    await delay();
    return financeRepository.approveJournal(journalId);
  },
  async postJournal(journalId: string) {
    await delay();
    return financeRepository.postJournal(journalId);
  },
  async reverseJournal(journalId: string) {
    await delay();
    return financeRepository.reverseJournal(journalId);
  },
  async createBudget(input: CreateBudgetInput) {
    await delay();
    return financeRepository.createBudget(input);
  },
  async approveBudget(budgetId: string) {
    await delay();
    return financeRepository.approveBudget(budgetId);
  },
  async createVendorBill(
    bill: Omit<VendorBill, 'billId' | 'matched' | 'agingDays'>,
  ) {
    await delay();
    return financeRepository.createVendorBill(bill);
  },
  async recordPayment(input: RecordPaymentInput) {
    await delay();
    return financeRepository.recordPayment(input);
  },
  async reconcileBank(input: ReconcileBankInput) {
    await delay();
    return financeRepository.reconcileBank(input);
  },
  async createAsset(
    input: Omit<
      FixedAsset,
      'assetId' | 'accumulatedDepreciation' | 'netBookValue' | 'status'
    >,
  ) {
    await delay();
    return financeRepository.createAsset(input);
  },
  async disposeAsset(assetId: string, disposalProceeds: number) {
    await delay();
    return financeRepository.disposeAsset(assetId, disposalProceeds);
  },

  async search(query: string, facilityId?: string) {
    await delay();
    return financeRepository.search(query, facilityId);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return financeRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'account' | 'journal' | 'budget' | 'asset',
    entityId: string,
  ) {
    await delay();
    return financeRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return financeRepository.getFavorites(userId);
  },
  async archiveJournal(journalId: string) {
    await delay();
    return financeRepository.archiveJournal(journalId);
  },
};
