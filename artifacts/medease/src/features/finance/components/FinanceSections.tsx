import {
  AccountCard,
  AgingChart,
  APInvoiceCard,
  ARInvoiceCard,
  AssetCard,
  BankAccountCard,
  BudgetCard,
  BudgetVarianceChart,
  CashAccountCard,
  DepreciationSchedule,
  ExportToolbar,
  FinanceAnalyticsPanel,
  FinancialDashboard,
  FinancialStatementViewer,
  JournalCard,
  LedgerViewer,
  ReconciliationPanel,
  RevenueChart,
  ExpenseChart,
  TrialBalanceTable,
} from '@/features/finance/components/FinanceComponents';
import {
  useAccountsPayable,
  useAccountsReceivable,
  useBankAccounts,
  useBudgets,
  useBudgetVariance,
  useCashAccounts,
  useChartOfAccounts,
  useDepreciation,
  useExpenseAnalytics,
  useFinanceAnalytics,
  useFinanceDashboard,
  useFinancialStatements,
  useFixedAssets,
  useJournalEntries,
  useLedger,
  useRevenueAnalytics,
  useTrialBalance,
} from '@/features/finance/hooks/use-finance';
import { useFinanceMutations } from '@/features/finance/mutations/finance.mutations';
import type { FinanceFilters } from '@/services/finance/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Landmark } from 'lucide-react';

export type FinanceSection =
  | 'dashboard'
  | 'revenue'
  | 'expenses'
  | 'generalLedger'
  | 'journals'
  | 'trialBalance'
  | 'accountsPayable'
  | 'accountsReceivable'
  | 'budgets'
  | 'assets'
  | 'cash'
  | 'statements'
  | 'analytics';

export function DashboardSection({ filters }: { filters?: FinanceFilters }) {
  const dashboard = useFinanceDashboard(filters?.facilityId);
  const journals = useJournalEntries(filters);
  const { postJournal } = useFinanceMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading finance dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={Landmark} title="No finance data" />;
  return (
    <div className="space-y-6">
      <FinancialDashboard dashboard={dashboard.data} />
      <AgingChart title="AP Aging" buckets={dashboard.data.agingAP} />
      <AgingChart title="AR Aging" buckets={dashboard.data.agingAR} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(journals.data?.items ?? dashboard.data.recentJournals)
          .slice(0, 6)
          .map((j) => (
            <JournalCard
              key={j.journalId}
              journal={j}
              onPost={
                j.status !== 'posted'
                  ? () => postJournal.mutate(j.journalId)
                  : undefined
              }
            />
          ))}
      </div>
    </div>
  );
}

export function RevenueSection({ filters }: { filters?: FinanceFilters }) {
  const revenue = useRevenueAnalytics(filters?.facilityId);
  const analytics = useFinanceAnalytics(filters?.facilityId);
  if (revenue.isLoading || analytics.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {analytics.data ? <RevenueChart analytics={analytics.data} /> : null}
      {revenue.data ? (
        <AgingChart
          title="Revenue by Department"
          buckets={revenue.data.byDepartment.map((d) => ({
            bucket: d.label,
            amount: d.value,
          }))}
        />
      ) : null}
    </div>
  );
}

export function ExpensesSection({ filters }: { filters?: FinanceFilters }) {
  const expenses = useExpenseAnalytics(filters?.facilityId);
  const analytics = useFinanceAnalytics(filters?.facilityId);
  if (expenses.isLoading || analytics.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {analytics.data ? <ExpenseChart analytics={analytics.data} /> : null}
      {expenses.data ? (
        <AgingChart
          title="Expenses by Cost Center"
          buckets={expenses.data.byCostCenter.map((d) => ({
            bucket: d.label,
            amount: d.value,
          }))}
        />
      ) : null}
    </div>
  );
}

export function GeneralLedgerSection({
  filters,
}: {
  filters?: FinanceFilters;
}) {
  const accounts = useChartOfAccounts(filters);
  if (accounts.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(accounts.data?.items ?? []).slice(0, 12).map((a) => (
        <AccountCard key={a.accountId} account={a} />
      ))}
    </div>
  );
}

export function JournalsSection({ filters }: { filters?: FinanceFilters }) {
  const journals = useJournalEntries(filters);
  const ledger = useLedger(filters);
  const { approveJournal, postJournal } = useFinanceMutations();
  if (journals.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(journals.data?.items ?? []).slice(0, 9).map((j) => (
          <JournalCard
            key={j.journalId}
            journal={j}
            onApprove={
              j.status === 'draft'
                ? () => approveJournal.mutate(j.journalId)
                : undefined
            }
            onPost={
              j.status !== 'posted' && j.status !== 'reversed'
                ? () => postJournal.mutate(j.journalId)
                : undefined
            }
          />
        ))}
      </div>
      <LedgerViewer
        journals={
          ledger.data?.items ??
          journals.data?.items
            ?.filter((j) => j.status === 'posted')
            .slice(0, 5) ??
          []
        }
      />
    </div>
  );
}

export function TrialBalanceSection({ filters }: { filters?: FinanceFilters }) {
  const trialBalance = useTrialBalance(filters?.facilityId);
  if (trialBalance.isLoading) return <LoadingView />;
  return <TrialBalanceTable lines={trialBalance.data ?? []} />;
}

export function AccountsPayableSection({
  filters,
}: {
  filters?: FinanceFilters;
}) {
  const ap = useAccountsPayable(filters);
  const { recordPayment } = useFinanceMutations();
  if (ap.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(ap.data?.items ?? []).slice(0, 12).map((b) => (
        <APInvoiceCard key={b.billId} bill={b} />
      ))}
      {(ap.data?.items ?? [])
        .slice(0, 3)
        .filter((b) => b.status === 'open')
        .map((b) => (
          <button
            key={`pay-${b.billId}`}
            type="button"
            className="hidden"
            onClick={() =>
              recordPayment.mutate({
                billId: b.billId,
                amount: b.totalAmount,
                paymentDate: new Date().toISOString().split('T')[0]!,
                method: 'wire',
              })
            }
          />
        ))}
    </div>
  );
}

export function AccountsReceivableSection({
  filters,
}: {
  filters?: FinanceFilters;
}) {
  const ar = useAccountsReceivable(filters);
  if (ar.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(ar.data?.items ?? []).slice(0, 12).map((r) => (
        <ARInvoiceCard key={r.receivableId} receivable={r} />
      ))}
    </div>
  );
}

export function BudgetsSection({ filters }: { filters?: FinanceFilters }) {
  const budgets = useBudgets(filters);
  const variance = useBudgetVariance(filters?.facilityId);
  if (budgets.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(budgets.data?.items ?? []).slice(0, 9).map((b) => (
          <BudgetCard key={b.budgetId} budget={b} />
        ))}
      </div>
      <BudgetVarianceChart budgets={budgets.data?.items ?? []} />
      {variance.data ? (
        <p className="text-sm text-muted-foreground">
          Total variance: €{variance.data.variance.toLocaleString()} (
          {variance.data.variancePercent}%)
        </p>
      ) : null}
    </div>
  );
}

export function AssetsSection({ filters }: { filters?: FinanceFilters }) {
  const assets = useFixedAssets(filters);
  const depreciation = useDepreciation(filters);
  const { disposeAsset } = useFinanceMutations();
  if (assets.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(assets.data?.items ?? []).slice(0, 9).map((a) => (
          <AssetCard
            key={a.assetId}
            asset={a}
            onDispose={() =>
              disposeAsset.mutate({
                assetId: a.assetId,
                disposalProceeds: a.netBookValue * 0.8,
              })
            }
          />
        ))}
      </div>
      <DepreciationSchedule entries={depreciation.data?.items ?? []} />
    </div>
  );
}

export function CashSection({ filters }: { filters?: FinanceFilters }) {
  const cash = useCashAccounts(filters);
  const banks = useBankAccounts(filters);
  const { reconcileBank } = useFinanceMutations();
  if (cash.isLoading || banks.isLoading) return <LoadingView />;
  const bank = banks.data?.items?.[0];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(cash.data?.items ?? []).slice(0, 6).map((c) => (
          <CashAccountCard key={c.cashAccountId} account={c} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(banks.data?.items ?? []).slice(0, 6).map((b) => (
          <BankAccountCard key={b.bankAccountId} account={b} />
        ))}
      </div>
      {bank ? (
        <ReconciliationPanel
          account={bank}
          onReconcile={() =>
            reconcileBank.mutate({
              bankAccountId: bank.bankAccountId,
              statementDate: new Date().toISOString().split('T')[0]!,
              statementBalance: bank.balance,
              matchedTransactionIds: [],
            })
          }
        />
      ) : null}
    </div>
  );
}

export function StatementsSection({ filters }: { filters?: FinanceFilters }) {
  const statements = useFinancialStatements(filters?.facilityId);
  if (statements.isLoading) return <LoadingView />;
  if (!statements.data) return <EmptyState title="No statements" />;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <FinancialStatementViewer statement={statements.data.balanceSheet} />
      <FinancialStatementViewer statement={statements.data.profitLoss} />
      <FinancialStatementViewer statement={statements.data.cashFlow} />
      <FinancialStatementViewer statement={statements.data.trialBalance} />
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: FinanceFilters }) {
  const analytics = useFinanceAnalytics(filters?.facilityId);
  const { exportData } = useFinanceMutations();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState title="No analytics" />;
  return (
    <div className="space-y-6">
      <FinanceAnalyticsPanel analytics={analytics.data} />
      <ExportToolbar onExport={(f) => exportData.mutate(f)} />
    </div>
  );
}

export function FinanceSectionContent({
  section,
  filters,
}: {
  section: FinanceSection;
  filters?: FinanceFilters;
}) {
  switch (section) {
    case 'revenue':
      return <RevenueSection filters={filters} />;
    case 'expenses':
      return <ExpensesSection filters={filters} />;
    case 'generalLedger':
      return <GeneralLedgerSection filters={filters} />;
    case 'journals':
      return <JournalsSection filters={filters} />;
    case 'trialBalance':
      return <TrialBalanceSection filters={filters} />;
    case 'accountsPayable':
      return <AccountsPayableSection filters={filters} />;
    case 'accountsReceivable':
      return <AccountsReceivableSection filters={filters} />;
    case 'budgets':
      return <BudgetsSection filters={filters} />;
    case 'assets':
      return <AssetsSection filters={filters} />;
    case 'cash':
      return <CashSection filters={filters} />;
    case 'statements':
      return <StatementsSection filters={filters} />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
