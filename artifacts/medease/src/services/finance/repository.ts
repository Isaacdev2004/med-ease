import { computeFinanceAnalytics } from '@/services/finance/analytics';
import {
  calculateAPAging,
  threeWayMatch,
} from '@/services/finance/accounts-payable';
import { calculateARAging } from '@/services/finance/accounts-receivable';
import {
  cashForecast,
  reconcileVariance,
} from '@/services/finance/cash-management';
import { budgetVarianceSummary } from '@/services/finance/budgeting';
import { disposeAsset } from '@/services/finance/fixed-assets';
import {
  buildBalanceSheet,
  buildCashFlowStatement,
  buildProfitAndLoss,
} from '@/services/finance/financial-reports';
import {
  buildFinanceDashboard,
  buildTrialBalance,
  MOCK_BANK_ACCOUNTS,
  MOCK_BUDGETS,
  MOCK_CASH_ACCOUNTS,
  MOCK_CHART_OF_ACCOUNTS,
  MOCK_DEPRECIATION,
  MOCK_FISCAL_PERIODS,
  MOCK_FIXED_ASSETS,
  MOCK_JOURNALS,
  MOCK_RECEIVABLES,
  MOCK_VENDOR_BILLS,
} from '@/services/finance/mock-data';
import {
  buildReversalEntry,
  canPostJournal,
  canReverseJournal,
  validateDoubleEntry,
} from '@/services/finance/journal-engine';
import type {
  CreateBudgetInput,
  CreateJournalInput,
  FinanceFavorite,
  FinanceFilters,
  FixedAsset,
  JournalEntry,
  ReconcileBankInput,
  RecordPaymentInput,
  VendorBill,
} from '@/services/finance/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: page ?? 1,
    pageSize: pageSize ?? 25,
  };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class FinanceRepository {
  private journals = [...MOCK_JOURNALS];
  private vendorBills = [...MOCK_VENDOR_BILLS];
  private receivables = [...MOCK_RECEIVABLES];
  private budgets = [...MOCK_BUDGETS];
  private assets = [...MOCK_FIXED_ASSETS];
  private bankAccounts = [...MOCK_BANK_ACCOUNTS];
  private favorites: FinanceFavorite[] = [];
  private nextId = 300000;

  getChartOfAccounts(filters?: FinanceFilters) {
    let items = MOCK_CHART_OF_ACCOUNTS;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    if (filters?.accountType)
      items = items.filter((a) => a.type === filters.accountType);
    if (filters?.q)
      items = items.filter((a) => matchQ(filters.q, a.code, a.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getJournalEntries(filters?: FinanceFilters) {
    let items = this.journals;
    if (filters?.facilityId)
      items = items.filter((j) => j.facilityId === filters.facilityId);
    if (filters?.fiscalPeriodId)
      items = items.filter((j) => j.fiscalPeriodId === filters.fiscalPeriodId);
    if (filters?.status)
      items = items.filter((j) => j.status === filters.status);
    if (filters?.q)
      items = items.filter((j) =>
        matchQ(filters.q, j.entryNumber, j.description),
      );
    return paginate(
      [...items].sort((a, b) => b.entryDate.localeCompare(a.entryDate)),
      filters?.page,
      filters?.pageSize,
    );
  }

  getJournal(journalId: string) {
    return this.journals.find((j) => j.journalId === journalId) ?? null;
  }

  getLedger(filters?: FinanceFilters) {
    const posted = this.journals.filter((j) => j.status === 'posted');
    let items = posted;
    if (filters?.facilityId)
      items = items.filter((j) => j.facilityId === filters.facilityId);
    if (filters?.fiscalPeriodId)
      items = items.filter((j) => j.fiscalPeriodId === filters.fiscalPeriodId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTrialBalance(facilityId?: string) {
    return buildTrialBalance(facilityId);
  }

  getFiscalPeriods() {
    return MOCK_FISCAL_PERIODS;
  }

  getAccountsPayable(filters?: FinanceFilters) {
    let items = this.vendorBills;
    if (filters?.facilityId)
      items = items.filter((b) => b.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((b) => b.status === filters.status);
    if (filters?.q)
      items = items.filter((b) =>
        matchQ(filters.q, b.billNumber, b.vendorName),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAccountsReceivable(filters?: FinanceFilters) {
    let items = this.receivables;
    if (filters?.facilityId)
      items = items.filter((r) => r.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((r) => r.status === filters.status);
    if (filters?.q)
      items = items.filter((r) =>
        matchQ(filters.q, r.customerName, r.invoiceId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCashAccounts(filters?: FinanceFilters) {
    let items = MOCK_CASH_ACCOUNTS;
    if (filters?.facilityId)
      items = items.filter((c) => c.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBankAccounts(filters?: FinanceFilters) {
    let items = this.bankAccounts;
    if (filters?.facilityId)
      items = items.filter((b) => b.facilityId === filters.facilityId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBudgets(filters?: FinanceFilters) {
    let items = this.budgets;
    if (filters?.facilityId)
      items = items.filter((b) => b.facilityId === filters.facilityId);
    if (filters?.departmentId)
      items = items.filter((b) => b.departmentId === filters.departmentId);
    if (filters?.status)
      items = items.filter((b) => b.status === filters.status);
    if (filters?.q) items = items.filter((b) => matchQ(filters.q, b.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBudgetVariance(facilityId?: string) {
    const items = facilityId
      ? this.budgets.filter((b) => b.facilityId === facilityId)
      : this.budgets;
    return budgetVarianceSummary(items);
  }

  getFixedAssets(filters?: FinanceFilters) {
    let items = this.assets;
    if (filters?.facilityId)
      items = items.filter((a) => a.facilityId === filters.facilityId);
    if (filters?.status)
      items = items.filter((a) => a.status === filters.status);
    if (filters?.q)
      items = items.filter((a) => matchQ(filters.q, a.name, a.assetTag));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDepreciation(filters?: FinanceFilters) {
    let items = MOCK_DEPRECIATION;
    if (filters?.fiscalPeriodId)
      items = items.filter((d) => d.periodId === filters.fiscalPeriodId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getFinancialStatements(facilityId?: string, asOfDate?: string) {
    const date = asOfDate ?? new Date().toISOString().split('T')[0]!;
    const trialBalance = buildTrialBalance(facilityId);
    return {
      balanceSheet: buildBalanceSheet(trialBalance, date),
      profitLoss: buildProfitAndLoss(trialBalance, date),
      cashFlow: buildCashFlowStatement(date),
      trialBalance: {
        statementId: `tb-${date}`,
        type: 'trial_balance' as const,
        title: 'Trial Balance',
        asOfDate: date,
        facilityId,
        lines: trialBalance.map((l) => ({
          label: `${l.accountCode} ${l.accountName}`,
          amount: l.balance,
          category: l.accountType,
        })),
        totals: {
          debit: trialBalance.reduce((s, l) => s + l.debit, 0),
          credit: trialBalance.reduce((s, l) => s + l.credit, 0),
        },
      },
    };
  }

  createJournal(input: CreateJournalInput) {
    const validation = validateDoubleEntry(
      input.lines.map((l, i) => ({ ...l, lineId: `jl-new-${i}` })),
    );
    if (!validation.valid) throw new Error(validation.error);
    const journal: JournalEntry = {
      journalId: `je-${String(++this.nextId)}`,
      entryNumber: `JE-2025-${String(this.nextId)}`,
      description: input.description,
      entryDate: input.entryDate,
      fiscalPeriodId: input.fiscalPeriodId,
      status: 'draft',
      lines: input.lines.map((l, i) => ({
        ...l,
        lineId: `jl-${this.nextId}-${i}`,
      })),
      totalDebit: validation.totalDebit,
      totalCredit: validation.totalCredit,
      facilityId: input.facilityId,
      createdBy: input.createdBy,
      sourceModule: input.sourceModule,
      sourceRef: input.sourceRef,
    };
    this.journals.unshift(journal);
    return journal;
  }

  approveJournal(journalId: string) {
    const idx = this.journals.findIndex((j) => j.journalId === journalId);
    if (idx < 0) return null;
    const journal = this.journals[idx]!;
    if (journal.status !== 'draft') return null;
    journal.status = 'pending_approval';
    this.journals[idx] = journal;
    return journal;
  }

  postJournal(journalId: string) {
    const idx = this.journals.findIndex((j) => j.journalId === journalId);
    if (idx < 0) return null;
    const journal = this.journals[idx]!;
    if (!canPostJournal(journal)) return null;
    journal.status = 'posted';
    journal.postedAt = new Date().toISOString();
    this.journals[idx] = journal;
    return journal;
  }

  reverseJournal(journalId: string) {
    const idx = this.journals.findIndex((j) => j.journalId === journalId);
    if (idx < 0) return null;
    const journal = this.journals[idx]!;
    if (!canReverseJournal(journal)) return null;
    journal.status = 'reversed';
    this.journals[idx] = journal;
    const reversal = buildReversalEntry(journal);
    const newJournal = this.createJournal({
      ...reversal,
      createdBy: journal.createdBy,
    });
    return { original: journal, reversal: newJournal };
  }

  createBudget(input: CreateBudgetInput) {
    const budget = {
      budgetId: `bud-${String(++this.nextId)}`,
      name: input.name,
      type: input.type,
      facilityId: input.facilityId,
      departmentId: input.departmentId,
      costCenterId: input.costCenterId,
      fiscalYear: input.fiscalYear,
      allocated: input.allocated,
      spent: 0,
      remaining: input.allocated,
      variance: input.allocated,
      variancePercent: 100,
      status: 'draft' as const,
    };
    this.budgets.unshift(budget);
    return budget;
  }

  approveBudget(budgetId: string) {
    const idx = this.budgets.findIndex((b) => b.budgetId === budgetId);
    if (idx < 0) return null;
    this.budgets[idx]!.status = 'active';
    return this.budgets[idx];
  }

  createVendorBill(bill: Omit<VendorBill, 'billId' | 'matched' | 'agingDays'>) {
    const newBill: VendorBill = {
      ...bill,
      billId: `vb-${String(++this.nextId)}`,
      matched: Boolean(bill.purchaseOrderId && bill.receiptId),
      agingDays: 0,
    };
    this.vendorBills.unshift(newBill);
    return newBill;
  }

  recordPayment(input: RecordPaymentInput) {
    if (input.billId) {
      const idx = this.vendorBills.findIndex((b) => b.billId === input.billId);
      if (idx >= 0) {
        const bill = this.vendorBills[idx]!;
        bill.status = input.amount >= bill.totalAmount ? 'paid' : 'partial';
        this.vendorBills[idx] = bill;
        return {
          type: 'ap' as const,
          record: bill,
          paymentId: `pay-${++this.nextId}`,
        };
      }
    }
    if (input.receivableId) {
      const idx = this.receivables.findIndex(
        (r) => r.receivableId === input.receivableId,
      );
      if (idx >= 0) {
        const rec = this.receivables[idx]!;
        rec.outstanding = Math.max(0, rec.outstanding - input.amount);
        rec.status = rec.outstanding === 0 ? 'paid' : 'partial';
        this.receivables[idx] = rec;
        return {
          type: 'ar' as const,
          record: rec,
          paymentId: `pay-${++this.nextId}`,
        };
      }
    }
    return null;
  }

  reconcileBank(input: ReconcileBankInput) {
    const idx = this.bankAccounts.findIndex(
      (b) => b.bankAccountId === input.bankAccountId,
    );
    if (idx < 0) return null;
    const account = this.bankAccounts[idx]!;
    const variance = reconcileVariance(input.statementBalance, account.balance);
    account.lastReconciled = input.statementDate;
    account.reconciliationStatus =
      Math.abs(variance) < 1 ? 'reconciled' : 'discrepancy';
    account.balance = input.statementBalance;
    this.bankAccounts[idx] = account;
    return {
      account,
      variance,
      matchedCount: input.matchedTransactionIds.length,
    };
  }

  createAsset(
    input: Omit<
      FixedAsset,
      'assetId' | 'accumulatedDepreciation' | 'netBookValue' | 'status'
    >,
  ) {
    const asset: FixedAsset = {
      ...input,
      assetId: `fa-${String(++this.nextId)}`,
      accumulatedDepreciation: 0,
      netBookValue: input.acquisitionCost,
      status: 'active',
    };
    this.assets.unshift(asset);
    return asset;
  }

  disposeAsset(assetId: string, disposalProceeds: number) {
    const idx = this.assets.findIndex((a) => a.assetId === assetId);
    if (idx < 0) return null;
    const asset = this.assets[idx]!;
    const result = disposeAsset(asset, disposalProceeds);
    asset.status = 'disposed';
    asset.netBookValue = 0;
    this.assets[idx] = asset;
    return { asset, ...result };
  }

  dashboard(facilityId?: string) {
    return buildFinanceDashboard(facilityId);
  }

  analytics(facilityId?: string) {
    return computeFinanceAnalytics(facilityId);
  }

  revenueAnalytics(facilityId?: string) {
    const analytics = computeFinanceAnalytics(facilityId);
    return {
      revenue: analytics.revenue,
      trend: analytics.revenueTrend,
      byDepartment: analytics.departmentProfitability,
    };
  }

  expenseAnalytics(facilityId?: string) {
    const analytics = computeFinanceAnalytics(facilityId);
    return {
      expenses: analytics.expenses,
      trend: analytics.expenseTrend,
      byCostCenter: analytics.costCenterExpenses,
    };
  }

  apAging(facilityId?: string) {
    const bills = facilityId
      ? this.vendorBills.filter((b) => b.facilityId === facilityId)
      : this.vendorBills;
    return calculateAPAging(bills);
  }

  arAging(facilityId?: string) {
    const items = facilityId
      ? this.receivables.filter((r) => r.facilityId === facilityId)
      : this.receivables;
    return calculateARAging(items);
  }

  cashForecast(facilityId?: string) {
    const cash = facilityId
      ? MOCK_CASH_ACCOUNTS.filter((c) => c.facilityId === facilityId)
      : MOCK_CASH_ACCOUNTS;
    return cashForecast(cash);
  }

  threeWayMatch(billId: string) {
    const bill = this.vendorBills.find((b) => b.billId === billId);
    if (!bill) return null;
    return threeWayMatch(bill);
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const filter = <T extends { facilityId?: string }>(
      items: T[],
      ...fields: (string | undefined)[]
    ) =>
      items
        .filter(
          (item) =>
            (!facilityId || item.facilityId === facilityId) &&
            fields.some((f) => f?.toLowerCase().includes(q)),
        )
        .slice(0, 15);

    return {
      accounts: filter(
        MOCK_CHART_OF_ACCOUNTS,
        ...MOCK_CHART_OF_ACCOUNTS.slice(0, 50).flatMap((a) => [a.code, a.name]),
      ),
      journals: filter(
        this.journals,
        ...this.journals
          .slice(0, 100)
          .flatMap((j) => [j.entryNumber, j.description]),
      ),
      bills: filter(
        this.vendorBills,
        ...this.vendorBills
          .slice(0, 100)
          .flatMap((b) => [b.billNumber, b.vendorName]),
      ),
      receivables: filter(
        this.receivables,
        ...this.receivables.slice(0, 100).map((r) => r.customerName),
      ),
      assets: filter(
        this.assets,
        ...this.assets.slice(0, 100).flatMap((a) => [a.name, a.assetTag]),
      ),
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.journals.length + this.vendorBills.length,
    };
  }

  favorite(
    userId: string,
    entityType: FinanceFavorite['entityType'],
    entityId: string,
  ) {
    const fav: FinanceFavorite = {
      favoriteId: `fav-${String(++this.nextId)}`,
      userId,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    this.favorites.unshift(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }

  archiveJournal(journalId: string) {
    const idx = this.journals.findIndex((j) => j.journalId === journalId);
    if (idx < 0) return null;
    this.journals.splice(idx, 1);
    return { journalId, archived: true };
  }
}

export const financeRepository = new FinanceRepository();
