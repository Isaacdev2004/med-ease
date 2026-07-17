export type AccountType =
  'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type JournalStatus =
  'draft' | 'pending_approval' | 'posted' | 'reversed';
export type InvoiceStatus =
  'draft' | 'open' | 'partial' | 'paid' | 'overdue' | 'void';
export type PaymentStatus =
  'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type BudgetStatus = 'draft' | 'approved' | 'active' | 'closed';
export type AssetStatus =
  'active' | 'fully_depreciated' | 'disposed' | 'impaired';
export type ReconciliationStatus =
  'pending' | 'in_progress' | 'reconciled' | 'discrepancy';
export type FiscalPeriodStatus = 'open' | 'closed' | 'locked';

export interface FinanceFilters {
  q?: string;
  facilityId?: string;
  departmentId?: string;
  costCenterId?: string;
  fiscalPeriodId?: string;
  status?: string;
  accountType?: AccountType;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ChartOfAccount {
  accountId: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  costCenterId?: string;
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
  costCenterId?: string;
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

export interface VendorBill {
  billId: string;
  vendorId: string;
  vendorName: string;
  billNumber: string;
  facilityId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  purchaseOrderId?: string;
  receiptId?: string;
  matched: boolean;
  agingDays: number;
}

export interface CustomerReceivable {
  receivableId: string;
  customerId: string;
  customerName: string;
  customerType: 'patient' | 'insurance' | 'corporate' | 'government';
  facilityId: string;
  invoiceId?: string;
  amount: number;
  outstanding: number;
  dueDate: string;
  status: InvoiceStatus;
  agingDays: number;
}

export interface CashAccount {
  cashAccountId: string;
  name: string;
  facilityId: string;
  currency: string;
  balance: number;
  type: 'operating' | 'petty_cash' | 'restricted';
}

export interface BankAccount {
  bankAccountId: string;
  name: string;
  bankName: string;
  accountNumber: string;
  facilityId: string;
  balance: number;
  currency: string;
  lastReconciled?: string;
  reconciliationStatus: ReconciliationStatus;
}

export interface Budget {
  budgetId: string;
  name: string;
  type: 'annual' | 'department' | 'capital' | 'operating';
  facilityId: string;
  departmentId?: string;
  costCenterId?: string;
  fiscalYear: number;
  allocated: number;
  spent: number;
  remaining: number;
  variance: number;
  variancePercent: number;
  status: BudgetStatus;
}

export interface FixedAsset {
  assetId: string;
  assetTag: string;
  name: string;
  assetClass: string;
  facilityId: string;
  costCenterId?: string;
  acquisitionDate: string;
  acquisitionCost: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  depreciationMethod: 'straight_line' | 'declining_balance';
  usefulLifeYears: number;
  status: AssetStatus;
  inventoryAssetId?: string;
  equipmentId?: string;
}

export interface DepreciationEntry {
  depreciationId: string;
  assetId: string;
  assetName: string;
  periodId: string;
  amount: number;
  accumulatedTotal: number;
  netBookValue: number;
}

export interface FinancialStatement {
  statementId: string;
  type: 'balance_sheet' | 'profit_loss' | 'cash_flow' | 'trial_balance';
  title: string;
  asOfDate: string;
  facilityId?: string;
  lines: { label: string; amount: number; category?: string }[];
  totals: Record<string, number>;
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

export interface FinanceAnalytics {
  revenue: number;
  expenses: number;
  grossMargin: number;
  ebitda: number;
  netIncome: number;
  operatingCost: number;
  collectionRate: number;
  outstandingAR: number;
  outstandingAP: number;
  cashPosition: number;
  budgetVariance: number;
  revenueTrend: { label: string; value: number }[];
  expenseTrend: { label: string; value: number }[];
  departmentProfitability: { label: string; value: number }[];
  costCenterExpenses: { label: string; value: number }[];
}

export interface FinancePermissions {
  canView: boolean;
  canWrite: boolean;
  canManageGL: boolean;
  canManageAP: boolean;
  canManageAR: boolean;
  canManageCash: boolean;
  canManageAssets: boolean;
  canManageBudget: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface FinanceFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'account' | 'journal' | 'budget' | 'asset';
  entityId: string;
  createdAt: string;
}

export interface CreateJournalInput {
  description: string;
  entryDate: string;
  fiscalPeriodId: string;
  lines: Omit<JournalLine, 'lineId'>[];
  facilityId?: string;
  createdBy: string;
  sourceModule?: string;
  sourceRef?: string;
}

export interface RecordPaymentInput {
  billId?: string;
  receivableId?: string;
  amount: number;
  paymentDate: string;
  method: string;
  reference?: string;
}

export interface ReconcileBankInput {
  bankAccountId: string;
  statementDate: string;
  statementBalance: number;
  matchedTransactionIds: string[];
}

export interface CreateBudgetInput {
  name: string;
  type: Budget['type'];
  facilityId: string;
  departmentId?: string;
  costCenterId?: string;
  fiscalYear: number;
  allocated: number;
}
