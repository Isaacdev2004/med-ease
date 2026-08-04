import type { QueryParams } from '@workspace/repository-transport';
import { httpTransport } from '@workspace/repository-transport';

import type {
  AccountType,
  CreateBudgetInput,
  CreateJournalInput,
  FinanceFavorite,
  FinanceFilters,
  FiscalPeriodStatus,
  FixedAsset,
  JournalEntry,
  JournalStatus,
  ReconcileBankInput,
  RecordPaymentInput,
  VendorBill,
} from '@/services/finance/types';

const BASE = '/api/finance';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function emptyPage(page = 1, pageSize = 25) {
  return { items: [] as never[], total: 0, page, pageSize };
}

function filtersToQuery(filters?: FinanceFilters): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    q: filters.q,
    facilityId: filters.facilityId,
    fiscalPeriodId: filters.fiscalPeriodId,
    status: filters.status,
    accountType: filters.accountType,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function mapJournalLine(raw: unknown) {
  const row = asRecord(raw);
  return {
    lineId: asString(row.lineId),
    accountId: asString(row.accountId),
    accountCode: asString(row.accountCode),
    accountName: asString(row.accountName),
    debit: asNumber(row.debit),
    credit: asNumber(row.credit),
    description: asOptionalString(row.description),
  };
}

function mapJournal(raw: unknown): JournalEntry {
  const row = asRecord(raw);
  return {
    journalId: asString(row.journalId),
    entryNumber: asString(row.entryNumber),
    description: asString(row.description),
    entryDate: asString(row.entryDate),
    fiscalPeriodId: asString(row.fiscalPeriodId),
    status: asString(row.status, 'draft') as JournalStatus,
    lines: Array.isArray(row.lines) ? row.lines.map(mapJournalLine) : [],
    totalDebit: asNumber(row.totalDebit),
    totalCredit: asNumber(row.totalCredit),
    facilityId: asOptionalString(row.facilityId),
    createdBy: asString(row.createdBy),
    postedAt: asOptionalString(row.postedAt),
    sourceModule: asOptionalString(row.sourceModule),
    sourceRef: asOptionalString(row.sourceRef),
  };
}

function mapAccount(raw: unknown) {
  const row = asRecord(raw);
  return {
    accountId: asString(row.accountId),
    code: asString(row.code),
    name: asString(row.name),
    type: asString(row.type, 'asset') as AccountType,
    parentId: asOptionalString(row.parentId),
    facilityId: asOptionalString(row.facilityId),
    balance: asNumber(row.balance),
    isActive: asBoolean(row.isActive, true),
  };
}

function mapPeriod(raw: unknown) {
  const row = asRecord(raw);
  return {
    periodId: asString(row.periodId),
    name: asString(row.name),
    startDate: asString(row.startDate),
    endDate: asString(row.endDate),
    status: asString(row.status, 'open') as FiscalPeriodStatus,
    fiscalYear: asNumber(row.fiscalYear),
  };
}

function mapTrialLine(raw: unknown) {
  const row = asRecord(raw);
  return {
    accountId: asString(row.accountId),
    accountCode: asString(row.accountCode),
    accountName: asString(row.accountName),
    accountType: asString(row.accountType, 'asset') as AccountType,
    debit: asNumber(row.debit),
    credit: asNumber(row.credit),
    balance: asNumber(row.balance),
  };
}

function mapDashboard(raw: unknown) {
  const row = asRecord(raw);
  return {
    facilityId: asOptionalString(row.facilityId),
    revenue: asNumber(row.revenue),
    expenses: asNumber(row.expenses),
    grossMargin: asNumber(row.grossMargin),
    netIncome: asNumber(row.netIncome),
    cashPosition: asNumber(row.cashPosition),
    outstandingAR: asNumber(row.outstandingAR),
    outstandingAP: asNumber(row.outstandingAP),
    collectionRate: asNumber(row.collectionRate),
    budgetVariance: asNumber(row.budgetVariance),
    recentJournals: Array.isArray(row.recentJournals)
      ? row.recentJournals.map(mapJournal)
      : [],
    agingAP: Array.isArray(row.agingAP)
      ? (row.agingAP as { bucket: string; amount: number }[])
      : [],
    agingAR: Array.isArray(row.agingAR)
      ? (row.agingAR as { bucket: string; amount: number }[])
      : [],
  };
}

class FinanceHttpRepository {
  private readonly transport = httpTransport;
  private favorites: FinanceFavorite[] = [];
  private nextId = 1;

  getChartOfAccounts(filters?: FinanceFilters) {
    return this.transport
      .get(`${BASE}/accounts`, { query: filtersToQuery(filters) })
      .then((raw: unknown) => (Array.isArray(raw) ? raw.map(mapAccount) : []));
  }

  getJournalEntries(filters?: FinanceFilters) {
    return this.transport
      .get(`${BASE}/journals`, { query: filtersToQuery(filters) })
      .then((raw: unknown) => {
        const row = asRecord(raw);
        return {
          items: Array.isArray(row.items) ? row.items.map(mapJournal) : [],
          total: asNumber(row.total),
          page: asNumber(row.page, filters?.page ?? 1),
          pageSize: asNumber(row.pageSize, filters?.pageSize ?? 25),
        };
      });
  }

  async getJournal(journalId: string) {
    try {
      return mapJournal(await this.transport.get(`${BASE}/journals/${journalId}`));
    } catch {
      return null;
    }
  }

  getLedger(filters?: FinanceFilters) {
    return this.transport
      .get(`${BASE}/ledger`, {
        query: {
          ...filtersToQuery(filters),
          accountId: (filters as { accountId?: string } | undefined)?.accountId,
        },
      })
      .then((raw: unknown) => (Array.isArray(raw) ? raw.map(mapJournalLine) : []));
  }

  getTrialBalance(facilityId?: string): Promise<
    {
      accountId: string;
      accountCode: string;
      accountName: string;
      accountType: AccountType;
      debit: number;
      credit: number;
      balance: number;
    }[]
  > {
    return this.transport
      .get(`${BASE}/trial-balance`, {
        query: facilityId ? { facilityId } : undefined,
      })
      .then((raw: unknown) => (Array.isArray(raw) ? raw.map(mapTrialLine) : []));
  }

  getFiscalPeriods() {
    return this.transport
      .get(`${BASE}/periods`)
      .then((raw: unknown) => (Array.isArray(raw) ? raw.map(mapPeriod) : []));
  }

  getAccountsPayable(filters?: FinanceFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getAccountsReceivable(filters?: FinanceFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getCashAccounts(filters?: FinanceFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getBankAccounts(filters?: FinanceFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getBudgets(filters?: FinanceFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getBudgetVariance() {
    return [];
  }

  getFixedAssets(filters?: FinanceFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getDepreciation(filters?: FinanceFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  async getFinancialStatements(facilityId?: string, asOfDate?: string) {
    const date = asOfDate ?? new Date().toISOString().split('T')[0]!;
    const trialBalance = await this.getTrialBalance(facilityId);
    return {
      balanceSheet: {
        statementId: `bs-${date}`,
        type: 'balance_sheet' as const,
        title: 'Balance Sheet',
        asOfDate: date,
        facilityId,
        lines: trialBalance
          .filter((l) =>
            ['asset', 'liability', 'equity'].includes(l.accountType),
          )
          .map((l) => ({
            label: `${l.accountCode} ${l.accountName}`,
            amount: l.balance,
            category: l.accountType,
          })),
        totals: {
          assets: trialBalance
            .filter((l) => l.accountType === 'asset')
            .reduce((s, l) => s + l.balance, 0),
          liabilities: trialBalance
            .filter((l) => l.accountType === 'liability')
            .reduce((s, l) => s + l.balance, 0),
          equity: trialBalance
            .filter((l) => l.accountType === 'equity')
            .reduce((s, l) => s + l.balance, 0),
        },
      },
      profitLoss: {
        statementId: `pl-${date}`,
        type: 'profit_loss' as const,
        title: 'Profit & Loss',
        asOfDate: date,
        facilityId,
        lines: trialBalance
          .filter((l) => ['revenue', 'expense'].includes(l.accountType))
          .map((l) => ({
            label: `${l.accountCode} ${l.accountName}`,
            amount: l.balance,
            category: l.accountType,
          })),
        totals: {
          revenue: trialBalance
            .filter((l) => l.accountType === 'revenue')
            .reduce((s, l) => s + l.balance, 0),
          expenses: trialBalance
            .filter((l) => l.accountType === 'expense')
            .reduce((s, l) => s + l.balance, 0),
        },
      },
      cashFlow: {
        statementId: `cf-${date}`,
        type: 'cash_flow' as const,
        title: 'Cash Flow',
        asOfDate: date,
        facilityId,
        lines: [],
        totals: {},
      },
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
    return this.transport
      .post(`${BASE}/journals`, {
        body: {
          description: input.description,
          entryDate: input.entryDate,
          fiscalPeriodId: input.fiscalPeriodId,
          lines: input.lines.map((l) => ({
            accountId: l.accountId,
            debit: l.debit,
            credit: l.credit,
            description: l.description,
          })),
          facilityId: input.facilityId,
          sourceModule: input.sourceModule,
          sourceRef: input.sourceRef,
        },
      })
      .then(mapJournal);
  }

  async approveJournal(journalId: string) {
    try {
      return mapJournal(
        await this.transport.post(`${BASE}/journals/${journalId}/approve`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async postJournal(journalId: string) {
    try {
      return mapJournal(
        await this.transport.post(`${BASE}/journals/${journalId}/post`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  reverseJournal() {
    return null;
  }

  createBudget(_input: CreateBudgetInput) {
    throw new Error('Budgets are not available on the live API yet');
  }

  approveBudget() {
    return null;
  }

  createVendorBill(_bill: Omit<VendorBill, 'billId' | 'matched' | 'agingDays'>) {
    throw new Error('AP bills are not available on the live API yet');
  }

  recordPayment(_input: RecordPaymentInput) {
    return null;
  }

  reconcileBank(_input: ReconcileBankInput) {
    return null;
  }

  createAsset(
    _input: Omit<
      FixedAsset,
      'assetId' | 'accumulatedDepreciation' | 'netBookValue' | 'status'
    >,
  ) {
    throw new Error('Fixed assets are not available on the live API yet');
  }

  disposeAsset() {
    return null;
  }

  dashboard(facilityId?: string) {
    return this.transport
      .get(`${BASE}/dashboard`, {
        query: facilityId ? { facilityId } : undefined,
      })
      .then(mapDashboard);
  }

  async analytics(facilityId?: string) {
    const dash = await this.dashboard(facilityId);
    return {
      revenue: dash.revenue,
      expenses: dash.expenses,
      grossMargin: dash.grossMargin,
      ebitda: dash.netIncome,
      netIncome: dash.netIncome,
      operatingCost: dash.expenses,
      collectionRate: dash.collectionRate,
      outstandingAR: dash.outstandingAR,
      outstandingAP: dash.outstandingAP,
      cashPosition: dash.cashPosition,
      budgetVariance: dash.budgetVariance,
      revenueTrend: [],
      expenseTrend: [],
      departmentProfitability: [],
      costCenterExpenses: [],
    };
  }

  async revenueAnalytics(facilityId?: string) {
    const dash = await this.dashboard(facilityId);
    return {
      revenue: dash.revenue,
      trend: [] as { label: string; value: number }[],
      byDepartment: [] as { label: string; value: number }[],
    };
  }

  async expenseAnalytics(facilityId?: string) {
    const dash = await this.dashboard(facilityId);
    return {
      expenses: dash.expenses,
      trend: [] as { label: string; value: number }[],
      byCostCenter: [] as { label: string; value: number }[],
    };
  }

  apAging() {
    return [];
  }

  arAging() {
    return [];
  }

  cashForecast() {
    return [];
  }

  threeWayMatch() {
    return null;
  }

  async search(query: string, facilityId?: string) {
    const [journals, accounts] = await Promise.all([
      this.getJournalEntries({ q: query, facilityId, page: 1, pageSize: 10 }),
      this.getChartOfAccounts({ q: query, facilityId }),
    ]);
    return {
      journals: journals.items,
      accounts: accounts.slice(0, 10),
      budgets: [],
      assets: [],
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: 0,
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

  archiveJournal() {
    return null;
  }
}

export const financeHttpRepository = new FinanceHttpRepository();
