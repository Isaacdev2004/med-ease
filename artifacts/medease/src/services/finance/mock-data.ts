import type {
  BankAccount,
  Budget,
  CashAccount,
  ChartOfAccount,
  CustomerReceivable,
  DepreciationEntry,
  FinanceDashboard,
  FiscalPeriod,
  FixedAsset,
  JournalEntry,
  TrialBalanceLine,
  VendorBill,
} from '@/services/finance/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => ({
  id: `fac-${String(i + 1).padStart(3, '0')}`,
  name:
    [
      'Pitié-Salpêtrière',
      'Hôpital Européen',
      'CHU Lyon',
      'CHU Bordeaux',
      'Hôpital Saint-Louis',
    ][i % 5] ?? `Hospital ${i + 1}`,
}));

const COST_CENTERS = Array.from({ length: 50 }, (_, i) => ({
  id: `cc-${String(i + 1).padStart(4, '0')}`,
  name: `Cost Center ${i + 1}`,
  facilityId: FACILITIES[i % 25]!.id,
}));

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0]!;
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0]!;
}

export const MOCK_FISCAL_PERIODS: FiscalPeriod[] = Array.from(
  { length: 12 },
  (_, i) => ({
    periodId: `fp-2025-${String(i + 1).padStart(2, '0')}`,
    name: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]!} 2025`,
    startDate: `2025-${String(i + 1).padStart(2, '0')}-01`,
    endDate: `2025-${String(i + 1).padStart(2, '0')}-28`,
    status: i < 6 ? ('closed' as const) : ('open' as const),
    fiscalYear: 2025,
  }),
);

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  {
    accountId: 'acc-1000',
    code: '1000',
    name: 'Cash & Equivalents',
    type: 'asset',
    balance: 2450000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-1100',
    code: '1100',
    name: 'Accounts Receivable',
    type: 'asset',
    balance: 1850000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-1200',
    code: '1200',
    name: 'Inventory',
    type: 'asset',
    balance: 920000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-1500',
    code: '1500',
    name: 'Fixed Assets',
    type: 'asset',
    balance: 12500000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-2000',
    code: '2000',
    name: 'Accounts Payable',
    type: 'liability',
    balance: 680000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-2100',
    code: '2100',
    name: 'Accrued Expenses',
    type: 'liability',
    balance: 340000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-3000',
    code: '3000',
    name: 'Retained Earnings',
    type: 'equity',
    balance: 8900000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-4000',
    code: '4000',
    name: 'Patient Revenue',
    type: 'revenue',
    balance: 4200000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-4100',
    code: '4100',
    name: 'Insurance Revenue',
    type: 'revenue',
    balance: 2800000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-4200',
    code: '4200',
    name: 'Pharmacy Revenue',
    type: 'revenue',
    balance: 650000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-5000',
    code: '5000',
    name: 'Salaries & Wages',
    type: 'expense',
    balance: 2100000,
    isActive: true,
    facilityId: 'fac-001',
    costCenterId: 'cc-0001',
  },
  {
    accountId: 'acc-5100',
    code: '5100',
    name: 'Medical Supplies',
    type: 'expense',
    balance: 890000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-5200',
    code: '5200',
    name: 'Utilities',
    type: 'expense',
    balance: 420000,
    isActive: true,
    facilityId: 'fac-001',
  },
  {
    accountId: 'acc-5300',
    code: '5300',
    name: 'Depreciation',
    type: 'expense',
    balance: 380000,
    isActive: true,
    facilityId: 'fac-001',
  },
  ...Array.from({ length: 86 }, (_, i) => ({
    accountId: `acc-${2000 + i}`,
    code: String(6000 + i),
    name: `Expense Account ${i + 1}`,
    type: 'expense' as const,
    balance: 10000 + (i % 50) * 5000,
    isActive: true,
    facilityId: FACILITIES[i % 25]!.id,
    costCenterId: COST_CENTERS[i % 50]!.id,
  })),
];

export const MOCK_JOURNALS: JournalEntry[] = Array.from(
  { length: 5000 },
  (_, i) => {
    const amount = 1000 + (i % 100) * 500;
    const statuses = [
      'draft',
      'pending_approval',
      'posted',
      'reversed',
    ] as const;
    const status = statuses[i % statuses.length]!;
    const fac = FACILITIES[i % 25]!;
    return {
      journalId: `je-${String(i + 1).padStart(5, '0')}`,
      entryNumber: `JE-2025-${String(i + 1).padStart(5, '0')}`,
      description: `Journal entry ${i + 1} — ${['Payroll', 'Revenue', 'Procurement', 'Inventory', 'Depreciation'][i % 5]!}`,
      entryDate: daysAgo(i % 90),
      fiscalPeriodId: MOCK_FISCAL_PERIODS[i % 12]!.periodId,
      status,
      lines: [
        {
          lineId: `jl-${i}-1`,
          accountId: 'acc-5000',
          accountCode: '5000',
          accountName: 'Salaries & Wages',
          debit: amount,
          credit: 0,
          costCenterId: 'cc-0001',
        },
        {
          lineId: `jl-${i}-2`,
          accountId: 'acc-1000',
          accountCode: '1000',
          accountName: 'Cash & Equivalents',
          debit: 0,
          credit: amount,
        },
      ],
      totalDebit: amount,
      totalCredit: amount,
      facilityId: fac.id,
      createdBy: `emp-${String((i % 500) + 1).padStart(5, '0')}`,
      postedAt: status === 'posted' ? daysAgo(i % 30) : undefined,
      sourceModule: [
        'workforce',
        'billing',
        'procurement',
        'inventory',
        'facilities',
      ][i % 5],
      sourceRef: `ref-${i + 1}`,
    };
  },
);

export const MOCK_VENDOR_BILLS: VendorBill[] = Array.from(
  { length: 3000 },
  (_, i) => {
    const fac = FACILITIES[i % 25]!;
    const amount = 500 + (i % 200) * 250;
    const aging = i % 120;
    const statuses = ['draft', 'open', 'partial', 'paid', 'overdue'] as const;
    return {
      billId: `vb-${String(i + 1).padStart(5, '0')}`,
      vendorId: `sup-${String((i % 800) + 1).padStart(4, '0')}`,
      vendorName: `Vendor ${(i % 800) + 1}`,
      billNumber: `BILL-${String(10000 + i)}`,
      facilityId: fac.id,
      amount,
      taxAmount: Math.round(amount * 0.2),
      totalAmount: Math.round(amount * 1.2),
      dueDate: daysFromNow(30 - aging),
      status:
        aging > 60 ? ('overdue' as const) : statuses[i % statuses.length]!,
      purchaseOrderId:
        i % 3 === 0
          ? `po-${String((i % 5000) + 1).padStart(5, '0')}`
          : undefined,
      receiptId:
        i % 4 === 0
          ? `gr-${String((i % 2000) + 1).padStart(5, '0')}`
          : undefined,
      matched: i % 2 === 0,
      agingDays: aging,
    };
  },
);

export const MOCK_RECEIVABLES: CustomerReceivable[] = Array.from(
  { length: 4000 },
  (_, i) => {
    const fac = FACILITIES[i % 25]!;
    const amount = 200 + (i % 100) * 150;
    const paid = i % 3 === 0 ? amount : i % 3 === 1 ? amount * 0.5 : 0;
    const types = ['patient', 'insurance', 'corporate', 'government'] as const;
    const aging = i % 90;
    return {
      receivableId: `ar-${String(i + 1).padStart(5, '0')}`,
      customerId:
        types[i % 4] === 'patient'
          ? `phr-${String((i % 500) + 1).padStart(3, '0')}`
          : `cust-${String(i + 1).padStart(4, '0')}`,
      customerName:
        types[i % 4] === 'patient'
          ? `Patient ${(i % 500) + 1}`
          : `Customer ${i + 1}`,
      customerType: types[i % 4]!,
      facilityId: fac.id,
      invoiceId: `inv-${String((i % 8000) + 1).padStart(5, '0')}`,
      amount,
      outstanding: amount - paid,
      dueDate: daysFromNow(30 - aging),
      status:
        paid >= amount
          ? ('paid' as const)
          : aging > 60
            ? ('overdue' as const)
            : ('open' as const),
      agingDays: aging,
    };
  },
);

export const MOCK_CASH_ACCOUNTS: CashAccount[] = FACILITIES.flatMap((f, fi) =>
  ['Operating Cash', 'Petty Cash'].map((name, ci) => ({
    cashAccountId: `cash-${String(fi * 2 + ci + 1).padStart(4, '0')}`,
    name: `${name} — ${f.name}`,
    facilityId: f.id,
    currency: 'EUR',
    balance: 50000 + fi * 10000 + ci * 5000,
    type: ci === 0 ? ('operating' as const) : ('petty_cash' as const),
  })),
).slice(0, 50);

export const MOCK_BANK_ACCOUNTS: BankAccount[] = Array.from(
  { length: 30 },
  (_, i) => {
    const fac = FACILITIES[i % 25]!;
    const statuses = [
      'pending',
      'in_progress',
      'reconciled',
      'discrepancy',
    ] as const;
    return {
      bankAccountId: `bnk-${String(i + 1).padStart(3, '0')}`,
      name: `Main Account ${i + 1}`,
      bankName: ['BNP Paribas', 'Crédit Agricole', 'Société Générale'][i % 3]!,
      accountNumber: `FR76 **** **** ${String(1000 + i)}`,
      facilityId: fac.id,
      balance: 500000 + i * 75000,
      currency: 'EUR',
      lastReconciled: i % 3 === 0 ? daysAgo(i % 14) : undefined,
      reconciliationStatus: statuses[i % statuses.length]!,
    };
  },
);

export const MOCK_BUDGETS: Budget[] = Array.from({ length: 200 }, (_, i) => {
  const fac = FACILITIES[i % 25]!;
  const allocated = 100000 + (i % 50) * 25000;
  const spent = allocated * (0.3 + (i % 70) / 100);
  const types = ['annual', 'department', 'capital', 'operating'] as const;
  return {
    budgetId: `bud-${String(i + 1).padStart(4, '0')}`,
    name: `${types[i % types.length]!.replace('_', ' ')} Budget ${(i % 20) + 1}`,
    type: types[i % types.length]!,
    facilityId: fac.id,
    departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
    costCenterId: COST_CENTERS[i % 50]!.id,
    fiscalYear: 2025,
    allocated,
    spent: Math.round(spent),
    remaining: Math.round(allocated - spent),
    variance: Math.round(allocated - spent),
    variancePercent: Math.round(((allocated - spent) / allocated) * 100),
    status: i % 10 === 0 ? ('draft' as const) : ('active' as const),
  };
});

export const MOCK_FIXED_ASSETS: FixedAsset[] = Array.from(
  { length: 800 },
  (_, i) => {
    const fac = FACILITIES[i % 25]!;
    const cost = 10000 + (i % 100) * 5000;
    const accumulated = cost * (0.1 + (i % 80) / 100);
    const classes = [
      'Medical Equipment',
      'Building',
      'Furniture',
      'IT Hardware',
      'Vehicle',
    ];
    return {
      assetId: `fa-${String(i + 1).padStart(4, '0')}`,
      assetTag: `FA-${String(i + 1).padStart(4, '0')}`,
      name: `${classes[i % classes.length]!} ${i + 1}`,
      assetClass: classes[i % classes.length]!,
      facilityId: fac.id,
      costCenterId: COST_CENTERS[i % 50]!.id,
      acquisitionDate: daysAgo(365 * (1 + (i % 10))),
      acquisitionCost: cost,
      accumulatedDepreciation: Math.round(accumulated),
      netBookValue: Math.round(cost - accumulated),
      depreciationMethod:
        i % 2 === 0
          ? ('straight_line' as const)
          : ('declining_balance' as const),
      usefulLifeYears: 5 + (i % 15),
      status:
        accumulated >= cost * 0.95
          ? ('fully_depreciated' as const)
          : ('active' as const),
      inventoryAssetId: `ast-${String((i % 1200) + 1).padStart(4, '0')}`,
      equipmentId:
        i % 3 === 0
          ? `eqp-${String((i % 10000) + 1).padStart(5, '0')}`
          : undefined,
    };
  },
);

export const MOCK_DEPRECIATION: DepreciationEntry[] = Array.from(
  { length: 2000 },
  (_, i) => {
    const asset = MOCK_FIXED_ASSETS[i % MOCK_FIXED_ASSETS.length]!;
    const amount = Math.round(
      asset.acquisitionCost / asset.usefulLifeYears / 12,
    );
    return {
      depreciationId: `dep-${String(i + 1).padStart(5, '0')}`,
      assetId: asset.assetId,
      assetName: asset.name,
      periodId: MOCK_FISCAL_PERIODS[i % 12]!.periodId,
      amount,
      accumulatedTotal: asset.accumulatedDepreciation + amount,
      netBookValue: asset.netBookValue - amount,
    };
  },
);

export function buildFinanceDashboard(facilityId?: string): FinanceDashboard {
  const journals = facilityId
    ? MOCK_JOURNALS.filter((j) => j.facilityId === facilityId)
    : MOCK_JOURNALS;
  const ap = facilityId
    ? MOCK_VENDOR_BILLS.filter((b) => b.facilityId === facilityId)
    : MOCK_VENDOR_BILLS;
  const ar = facilityId
    ? MOCK_RECEIVABLES.filter((r) => r.facilityId === facilityId)
    : MOCK_RECEIVABLES;
  const revenue = ar.reduce((s, r) => s + r.amount, 0) / (facilityId ? 1 : 25);
  const expenses =
    ap.reduce((s, b) => s + b.totalAmount, 0) / (facilityId ? 1 : 25);

  return {
    facilityId,
    revenue: Math.round(revenue),
    expenses: Math.round(expenses),
    grossMargin: Math.round(revenue * 0.42),
    netIncome: Math.round(revenue - expenses),
    cashPosition: MOCK_CASH_ACCOUNTS.filter(
      (c) => !facilityId || c.facilityId === facilityId,
    ).reduce((s, c) => s + c.balance, 0),
    outstandingAR: ar
      .filter((r) => r.outstanding > 0)
      .reduce((s, r) => s + r.outstanding, 0),
    outstandingAP: ap
      .filter((b) => b.status !== 'paid')
      .reduce((s, b) => s + b.totalAmount, 0),
    collectionRate: ar.length
      ? Math.round(
          (ar.filter((r) => r.status === 'paid').length / ar.length) * 100,
        )
      : 95,
    budgetVariance: MOCK_BUDGETS.filter(
      (b) => !facilityId || b.facilityId === facilityId,
    ).reduce((s, b) => s + b.variance, 0),
    recentJournals: journals.filter((j) => j.status === 'posted').slice(0, 8),
    agingAP: [
      {
        bucket: '0-30',
        amount: ap
          .filter((b) => b.agingDays <= 30)
          .reduce((s, b) => s + b.totalAmount, 0),
      },
      {
        bucket: '31-60',
        amount: ap
          .filter((b) => b.agingDays > 30 && b.agingDays <= 60)
          .reduce((s, b) => s + b.totalAmount, 0),
      },
      {
        bucket: '61-90',
        amount: ap
          .filter((b) => b.agingDays > 60 && b.agingDays <= 90)
          .reduce((s, b) => s + b.totalAmount, 0),
      },
      {
        bucket: '90+',
        amount: ap
          .filter((b) => b.agingDays > 90)
          .reduce((s, b) => s + b.totalAmount, 0),
      },
    ],
    agingAR: [
      {
        bucket: '0-30',
        amount: ar
          .filter((r) => r.agingDays <= 30)
          .reduce((s, r) => s + r.outstanding, 0),
      },
      {
        bucket: '31-60',
        amount: ar
          .filter((r) => r.agingDays > 30 && r.agingDays <= 60)
          .reduce((s, r) => s + r.outstanding, 0),
      },
      {
        bucket: '61-90',
        amount: ar
          .filter((r) => r.agingDays > 60 && r.agingDays <= 90)
          .reduce((s, r) => s + r.outstanding, 0),
      },
      {
        bucket: '90+',
        amount: ar
          .filter((r) => r.agingDays > 90)
          .reduce((s, r) => s + r.outstanding, 0),
      },
    ],
  };
}

export function buildTrialBalance(facilityId?: string): TrialBalanceLine[] {
  let accounts = MOCK_CHART_OF_ACCOUNTS;
  if (facilityId)
    accounts = accounts.filter((a) => a.facilityId === facilityId);
  return accounts.map((a) => ({
    accountId: a.accountId,
    accountCode: a.code,
    accountName: a.name,
    accountType: a.type,
    debit: ['asset', 'expense'].includes(a.type) ? a.balance : 0,
    credit: ['liability', 'equity', 'revenue'].includes(a.type) ? a.balance : 0,
    balance: a.balance,
  }));
}
