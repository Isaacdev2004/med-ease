export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type JournalStatus = 'draft' | 'pending_approval' | 'posted' | 'reversed';
export type FiscalPeriodStatus = 'open' | 'closed' | 'locked';

export interface FinanceFilters {
  q?: string;
  facilityId?: string;
  fiscalPeriodId?: string;
  status?: string;
  accountType?: AccountType;
  accountId?: string;
  page?: number;
  pageSize?: number;
}

export interface ChartOfAccount {
  accountId: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  facilityId?: string;
  balance: number;
  isActive: boolean;
}

export interface JournalLine {
  lineId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  journalId: string;
  entryNumber: string;
  description: string;
  entryDate: string;
  fiscalPeriodId: string;
  status: JournalStatus;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  facilityId?: string;
  createdBy: string;
  postedAt?: string;
  sourceModule?: string;
  sourceRef?: string;
}

export interface FiscalPeriod {
  periodId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: FiscalPeriodStatus;
  fiscalYear: number;
}

export interface TrialBalanceLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debit: number;
  credit: number;
  balance: number;
}

export interface FinanceDashboard {
  facilityId?: string;
  revenue: number;
  expenses: number;
  grossMargin: number;
  netIncome: number;
  cashPosition: number;
  outstandingAR: number;
  outstandingAP: number;
  collectionRate: number;
  budgetVariance: number;
  recentJournals: JournalEntry[];
  agingAP: { bucket: string; amount: number }[];
  agingAR: { bucket: string; amount: number }[];
}

export interface CreateJournalInput {
  description: string;
  entryDate: string;
  fiscalPeriodId: string;
  lines: Omit<JournalLine, 'lineId' | 'accountCode' | 'accountName'>[];
  facilityId?: string;
  createdBy?: string;
  sourceModule?: string;
  sourceRef?: string;
}

export interface JournalListResult {
  items: JournalEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FinanceRepositoryContract {
  getChartOfAccounts(filters?: FinanceFilters): Promise<ChartOfAccount[]>;
  getJournalEntries(filters?: FinanceFilters): Promise<JournalListResult>;
  getJournal(journalId: string): Promise<JournalEntry>;
  getLedger(filters?: FinanceFilters): Promise<JournalLine[]>;
  getTrialBalance(facilityId?: string): Promise<TrialBalanceLine[]>;
  getFiscalPeriods(): Promise<FiscalPeriod[]>;
  createJournal(input: CreateJournalInput): Promise<JournalEntry>;
  approveJournal(journalId: string): Promise<JournalEntry>;
  postJournal(journalId: string): Promise<JournalEntry>;
  getDashboard(facilityId?: string): Promise<FinanceDashboard>;
}
