import { format } from 'date-fns';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building,
  CreditCard,
  Landmark,
  PieChart,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import type {
  BankAccount,
  Budget,
  CashAccount,
  ChartOfAccount,
  CustomerReceivable,
  DepreciationEntry,
  FinanceAnalytics,
  FinanceDashboard,
  FinancialStatement,
  FixedAsset,
  JournalEntry,
  TrialBalanceLine,
  VendorBill,
} from '@/services/finance/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

function formatCurrency(value: number) {
  return `€${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function AccountCard({ account }: { account: ChartOfAccount }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">
            {account.code} — {account.name}
          </CardTitle>
          <Badge variant="outline" className="capitalize">
            {account.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
        {account.costCenterId ? (
          <p className="text-xs text-muted-foreground mt-1">
            Cost center: {account.costCenterId}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function JournalCard({
  journal,
  onApprove,
  onPost,
}: {
  journal: JournalEntry;
  onApprove?: () => void;
  onPost?: () => void;
}) {
  const statusColor = {
    draft: 'outline',
    pending_approval: 'secondary',
    posted: 'default',
    reversed: 'destructive',
  } as const;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{journal.entryNumber}</span>
          <Badge variant={statusColor[journal.status]} className="capitalize">
            {journal.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">{journal.description}</p>
        <p className="text-xs">
          {format(new Date(journal.entryDate), 'MMM d, yyyy')} · Dr{' '}
          {formatCurrency(journal.totalDebit)} / Cr{' '}
          {formatCurrency(journal.totalCredit)}
        </p>
        {journal.sourceModule ? (
          <Badge variant="outline">{journal.sourceModule}</Badge>
        ) : null}
        <div className="flex gap-2">
          {onApprove && journal.status === 'draft' ? (
            <Button size="sm" variant="outline" onClick={onApprove}>
              Approve
            </Button>
          ) : null}
          {onPost &&
          (journal.status === 'draft' ||
            journal.status === 'pending_approval') ? (
            <Button size="sm" onClick={onPost}>
              Post
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function LedgerViewer({ journals }: { journals: JournalEntry[] }) {
  return (
    <div className="space-y-3">
      {journals.map((j) => (
        <Card key={j.journalId}>
          <CardContent className="pt-4 text-sm">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{j.entryNumber}</span>
              <span className="text-muted-foreground">{j.entryDate}</span>
            </div>
            {j.lines.map((l) => (
              <div
                key={l.lineId}
                className="flex justify-between border-t py-1 text-xs"
              >
                <span>
                  {l.accountCode} {l.accountName}
                </span>
                <span>
                  {l.debit
                    ? `Dr ${formatCurrency(l.debit)}`
                    : `Cr ${formatCurrency(l.credit)}`}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TrialBalanceTable({ lines }: { lines: TrialBalanceLine[] }) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Account</th>
            <th className="px-3 py-2 text-right">Debit</th>
            <th className="px-3 py-2 text-right">Credit</th>
            <th className="px-3 py-2 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {lines.slice(0, 20).map((l) => (
            <tr key={l.accountId} className="border-t">
              <td className="px-3 py-2">
                {l.accountCode} {l.accountName}
              </td>
              <td className="px-3 py-2 text-right">
                {l.debit ? formatCurrency(l.debit) : '—'}
              </td>
              <td className="px-3 py-2 text-right">
                {l.credit ? formatCurrency(l.credit) : '—'}
              </td>
              <td className="px-3 py-2 text-right font-medium">
                {formatCurrency(l.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BudgetCard({ budget }: { budget: Budget }) {
  const pct = budget.allocated
    ? Math.round((budget.spent / budget.allocated) * 100)
    : 0;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">{budget.name}</span>
          <Badge className="capitalize">{budget.status}</Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {budget.type.replace('_', ' ')} · FY {budget.fiscalYear}
        </p>
        <div className="flex justify-between text-xs">
          <span>Spent {formatCurrency(budget.spent)}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-xs">
          Variance: {formatCurrency(budget.variance)} ({budget.variancePercent}
          %)
        </p>
      </CardContent>
    </Card>
  );
}

export function BudgetVarianceChart({ budgets }: { budgets: Budget[] }) {
  const data = budgets
    .slice(0, 8)
    .map((b) => ({ label: b.name.slice(0, 16), value: b.variance }));
  return <BarChartPanel title="Budget Variance" data={data} />;
}

export function APInvoiceCard({ bill }: { bill: VendorBill }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{bill.billNumber}</span>
          <Badge className="capitalize">{bill.status}</Badge>
        </div>
        <p className="text-muted-foreground">{bill.vendorName}</p>
        <p className="font-semibold">{formatCurrency(bill.totalAmount)}</p>
        <p className="text-xs">
          Due {format(new Date(bill.dueDate), 'MMM d, yyyy')} · {bill.agingDays}
          d · {bill.matched ? 'Matched' : 'Unmatched'}
        </p>
      </CardContent>
    </Card>
  );
}

export function ARInvoiceCard({
  receivable,
}: {
  receivable: CustomerReceivable;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{receivable.customerName}</span>
          <Badge className="capitalize">{receivable.status}</Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {receivable.customerType}
        </p>
        <p className="font-semibold">
          {formatCurrency(receivable.outstanding)} outstanding
        </p>
        <p className="text-xs">
          Due {format(new Date(receivable.dueDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function FinanceVendorCard({ bill }: { bill: VendorBill }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Building className="h-8 w-8 text-primary shrink-0" />
        <div className="text-sm">
          <p className="font-medium">{bill.vendorName}</p>
          <p className="text-muted-foreground">{bill.vendorId}</p>
          <p className="text-xs">
            {formatCurrency(bill.totalAmount)} · {bill.status}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CustomerCard({
  receivable,
}: {
  receivable: CustomerReceivable;
}) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-primary shrink-0" />
        <div className="text-sm">
          <p className="font-medium">{receivable.customerName}</p>
          <p className="text-muted-foreground capitalize">
            {receivable.customerType}
          </p>
          <p className="text-xs">
            {formatCurrency(receivable.outstanding)} outstanding
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CashAccountCard({ account }: { account: CashAccount }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Wallet className="h-8 w-8 text-primary shrink-0" />
        <div className="text-sm">
          <p className="font-medium">{account.name}</p>
          <p className="text-muted-foreground capitalize">
            {account.type.replace('_', ' ')}
          </p>
          <p className="font-semibold">{formatCurrency(account.balance)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function BankAccountCard({ account }: { account: BankAccount }) {
  const statusColor = {
    pending: 'outline',
    in_progress: 'secondary',
    reconciled: 'default',
    discrepancy: 'destructive',
  } as const;
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Landmark className="h-8 w-8 text-primary shrink-0" />
        <div className="text-sm flex-1">
          <div className="flex justify-between gap-2">
            <span className="font-medium">{account.name}</span>
            <Badge
              variant={statusColor[account.reconciliationStatus]}
              className="capitalize"
            >
              {account.reconciliationStatus.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {account.bankName} · {account.accountNumber}
          </p>
          <p className="font-semibold">{formatCurrency(account.balance)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReconciliationPanel({
  account,
  onReconcile,
}: {
  account: BankAccount;
  onReconcile?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Bank Reconciliation — {account.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <p>
          Book balance: <strong>{formatCurrency(account.balance)}</strong>
        </p>
        <p className="text-muted-foreground">
          Last reconciled:{' '}
          {account.lastReconciled
            ? format(new Date(account.lastReconciled), 'MMM d, yyyy')
            : 'Never'}
        </p>
        {onReconcile ? (
          <Button size="sm" onClick={onReconcile}>
            Reconcile
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AssetCard({
  asset,
  onDispose,
}: {
  asset: FixedAsset;
  onDispose?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">{asset.name}</span>
          <Badge className="capitalize">{asset.status.replace('_', ' ')}</Badge>
        </div>
        <p className="text-muted-foreground">
          {asset.assetTag} · {asset.assetClass}
        </p>
        <p>
          NBV: {formatCurrency(asset.netBookValue)} · Cost:{' '}
          {formatCurrency(asset.acquisitionCost)}
        </p>
        {onDispose && asset.status === 'active' ? (
          <Button size="sm" variant="outline" onClick={onDispose}>
            Dispose
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function DepreciationSchedule({
  entries,
}: {
  entries: DepreciationEntry[];
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Asset</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2 text-right">Accumulated</th>
            <th className="px-3 py-2 text-right">NBV</th>
          </tr>
        </thead>
        <tbody>
          {entries.slice(0, 12).map((e) => (
            <tr key={e.depreciationId} className="border-t">
              <td className="px-3 py-2">{e.assetName}</td>
              <td className="px-3 py-2 text-right">
                {formatCurrency(e.amount)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatCurrency(e.accumulatedTotal)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatCurrency(e.netBookValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FinancialStatementViewer({
  statement,
}: {
  statement: FinancialStatement;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{statement.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">
          As of {format(new Date(statement.asOfDate), 'MMM d, yyyy')}
        </p>
        {statement.lines.slice(0, 12).map((l, i) => (
          <div key={i} className="flex justify-between border-b py-1">
            <span>{l.label}</span>
            <span className={cn(l.amount < 0 && 'text-destructive')}>
              {formatCurrency(l.amount)}
            </span>
          </div>
        ))}
        <div className="pt-2 font-semibold flex justify-between">
          {Object.entries(statement.totals)
            .slice(0, 2)
            .map(([k, v]) => (
              <span key={k}>
                {k}: {formatCurrency(v)}
              </span>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialDashboard({
  dashboard,
}: {
  dashboard: FinanceDashboard;
}) {
  const kpis = [
    {
      label: 'Revenue',
      value: formatCurrency(dashboard.revenue),
      icon: TrendingUp,
      tone: 'text-emerald-600',
    },
    {
      label: 'Expenses',
      value: formatCurrency(dashboard.expenses),
      icon: TrendingDown,
      tone: 'text-rose-600',
    },
    {
      label: 'Net Income',
      value: formatCurrency(dashboard.netIncome),
      icon: PieChart,
      tone: 'text-primary',
    },
    {
      label: 'Cash Position',
      value: formatCurrency(dashboard.cashPosition),
      icon: Banknote,
      tone: 'text-primary',
    },
    {
      label: 'Outstanding AR',
      value: formatCurrency(dashboard.outstandingAR),
      icon: ArrowUpRight,
      tone: 'text-amber-600',
    },
    {
      label: 'Outstanding AP',
      value: formatCurrency(dashboard.outstandingAP),
      icon: ArrowDownRight,
      tone: 'text-orange-600',
    },
    {
      label: 'Collection Rate',
      value: `${dashboard.collectionRate}%`,
      icon: Receipt,
      tone: 'text-primary',
    },
    {
      label: 'Budget Variance',
      value: formatCurrency(dashboard.budgetVariance),
      icon: Wallet,
      tone: 'text-primary',
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-4 flex items-center gap-3">
            <k.icon className={cn('h-8 w-8 shrink-0', k.tone)} />
            <div>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const ExecutiveDashboard = FinancialDashboard;

export function KPICards({ analytics }: { analytics: FinanceAnalytics }) {
  const kpis = [
    { label: 'EBITDA', value: formatCurrency(analytics.ebitda) },
    { label: 'Gross Margin', value: formatCurrency(analytics.grossMargin) },
    { label: 'Operating Cost', value: formatCurrency(analytics.operatingCost) },
    { label: 'Cash Position', value: formatCurrency(analytics.cashPosition) },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RevenueChart({ analytics }: { analytics: FinanceAnalytics }) {
  return <BarChartPanel title="Revenue Trend" data={analytics.revenueTrend} />;
}

export function ExpenseChart({ analytics }: { analytics: FinanceAnalytics }) {
  return <BarChartPanel title="Expense Trend" data={analytics.expenseTrend} />;
}

export function FinanceAnalyticsPanel({
  analytics,
}: {
  analytics: FinanceAnalytics;
}) {
  return (
    <div className="space-y-6">
      <KPICards analytics={analytics} />
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart analytics={analytics} />
        <ExpenseChart analytics={analytics} />
      </div>
      <BarChartPanel
        title="Department Profitability"
        data={analytics.departmentProfitability}
      />
    </div>
  );
}

export function ExportToolbar({
  onExport,
}: {
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {(['csv', 'pdf', 'xlsx'] as const).map((f) => (
        <Button
          key={f}
          size="sm"
          variant="outline"
          onClick={() => onExport?.(f)}
        >
          Export {f.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function AgingChart({
  title,
  buckets,
}: {
  title: string;
  buckets: { bucket: string; amount: number }[];
}) {
  return (
    <BarChartPanel
      title={title}
      data={buckets.map((b) => ({ label: b.bucket, value: b.amount }))}
    />
  );
}
