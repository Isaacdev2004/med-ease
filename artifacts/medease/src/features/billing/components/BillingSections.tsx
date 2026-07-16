import {
  AnalyticsPanel,
  ClaimCard,
  CollectionPanel,
  ExportToolbar,
  FinancialMetrics,
  InsuranceCard,
  InvoiceCard,
  InvoiceDetailPanel,
  InvoiceTable,
  OutstandingBalanceCard,
  PaymentCard,
  PaymentTimeline,
  ReceiptCard,
  RefundCard,
  RevenueChart,
} from '@/features/billing/components/BillingComponents';
import {
  useBillingDashboard,
  useClaims,
  useInsurance,
  useInvoice,
  useInvoices,
  useOutstandingBalances,
  usePaymentTimeline,
  usePayments,
  useReceipts,
  useRefunds,
  useRevenueAnalytics,
} from '@/features/billing/hooks/use-billing';
import { useBillingMutations } from '@/features/billing/mutations/billing.mutations';
import type { BillingFilters } from '@/services/billing/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { CreditCard } from 'lucide-react';

export function DashboardSection({ filters }: { filters?: BillingFilters }) {
  const dashboard = useBillingDashboard(filters?.patientId, filters?.providerId, filters?.facilityId);
  if (dashboard.isLoading) return <LoadingView label="Loading billing…" />;
  if (!dashboard.data) return <EmptyState icon={CreditCard} title="No billing data" />;
  return (
    <div className="space-y-6">
      <FinancialMetrics dashboard={dashboard.data} />
      <CollectionPanel rate={dashboard.data.collectionRate} outstanding={dashboard.data.outstandingBalances} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboard.data.recentInvoices.map((i) => <InvoiceCard key={i.invoiceId} invoice={i} />)}
      </div>
    </div>
  );
}

export function InvoicesSection({ filters }: { filters?: BillingFilters }) {
  const query = useInvoices(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={CreditCard} title="No invoices" />;
  return (
    <div className="space-y-4">
      <InvoiceTable invoices={items.slice(0, 20)} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 9).map((i) => <InvoiceCard key={i.invoiceId} invoice={i} />)}
      </div>
    </div>
  );
}

export function ClaimsSection({ filters }: { filters?: BillingFilters }) {
  const query = useClaims(filters);
  const { approveClaim, denyClaim } = useBillingMutations();
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={CreditCard} title="No claims" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 12).map((c) => (
        <div key={c.claimId} className="space-y-2">
          <ClaimCard claim={c} />
          {c.status === 'pending' || c.status === 'submitted' ? (
            <div className="flex gap-2">
              <button type="button" className="text-xs underline" onClick={() => void approveClaim.mutateAsync({ claimId: c.claimId })}>Approve</button>
              <button type="button" className="text-xs underline text-destructive" onClick={() => void denyClaim.mutateAsync({ claimId: c.claimId, reason: 'Not covered' })}>Deny</button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function PaymentsSection({ filters }: { filters?: BillingFilters }) {
  const query = usePayments(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={CreditCard} title="No payments" />;
  return <div className="grid gap-4 sm:grid-cols-2">{items.slice(0, 12).map((p) => <PaymentCard key={p.paymentId} payment={p} />)}</div>;
}

export function ReceiptsSection({ filters }: { filters?: BillingFilters }) {
  const query = useReceipts(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={CreditCard} title="No receipts" />;
  return <div className="grid gap-4 sm:grid-cols-2">{items.slice(0, 12).map((r) => <ReceiptCard key={r.receiptId} receipt={r} />)}</div>;
}

export function InsuranceSection({ filters }: { filters?: BillingFilters }) {
  const query = useInsurance(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState icon={CreditCard} title="No insurance policies" />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 9).map((p) => <InsuranceCard key={p.policyId} policy={p} />)}</div>;
}

export function RevenueSection() {
  const analytics = useRevenueAnalytics();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState icon={CreditCard} title="No revenue data" />;
  return (
    <div className="space-y-6">
      <RevenueChart analytics={analytics.data} />
      <AnalyticsPanel analytics={analytics.data} />
    </div>
  );
}

export function OutstandingSection({ filters }: { filters?: BillingFilters }) {
  const query = useOutstandingBalances(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState icon={CreditCard} title="No outstanding balances" />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((b) => <OutstandingBalanceCard key={b.patientId} balance={b} />)}</div>;
}

export function RefundsSection({ filters }: { filters?: BillingFilters }) {
  const query = useRefunds(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={CreditCard} title="No refunds" />;
  return <div className="grid gap-4 sm:grid-cols-2">{items.slice(0, 12).map((r) => <RefundCard key={r.refundId} refund={r} />)}</div>;
}

export function FinancialReportsSection() {
  const { exportReport } = useBillingMutations();
  const analytics = useRevenueAnalytics();
  return (
    <div className="space-y-6">
      <ExportToolbar onExport={(format) => void exportReport.mutateAsync(format)} />
      {analytics.data ? <AnalyticsPanel analytics={analytics.data} /> : <LoadingView />}
    </div>
  );
}

export function InvoiceDetailSection({ invoiceId }: { invoiceId: string }) {
  const invoice = useInvoice(invoiceId);
  if (invoice.isLoading) return <LoadingView />;
  const inv = invoice.data;
  if (!inv) return <EmptyState icon={CreditCard} title="Invoice not found" />;
  return (
    <div className="space-y-6">
      <InvoiceDetailPanel invoice={inv} />
      <PaymentTimelineSection invoiceId={invoiceId} />
    </div>
  );
}

function PaymentTimelineSection({ invoiceId }: { invoiceId: string }) {
  const timeline = usePaymentTimeline(invoiceId);
  if (timeline.isLoading) return null;
  return timeline.data?.length ? <PaymentTimeline entries={timeline.data} /> : null;
}

export type BillingSection =
  | 'dashboard' | 'invoices' | 'claims' | 'payments' | 'receipts'
  | 'insurance' | 'revenue' | 'outstanding' | 'refunds' | 'analytics' | 'financial-reports';

export function BillingSectionContent({
  section,
  filters,
  invoiceId,
}: {
  section: BillingSection;
  filters?: BillingFilters;
  invoiceId?: string;
}) {
  switch (section) {
    case 'invoices': return <InvoicesSection filters={filters} />;
    case 'claims': return <ClaimsSection filters={filters} />;
    case 'payments': return <PaymentsSection filters={filters} />;
    case 'receipts': return <ReceiptsSection filters={filters} />;
    case 'insurance': return <InsuranceSection filters={filters} />;
    case 'revenue': return <RevenueSection />;
    case 'outstanding': return <OutstandingSection filters={filters} />;
    case 'refunds': return <RefundsSection filters={filters} />;
    case 'analytics': return <RevenueSection />;
    case 'financial-reports': return <FinancialReportsSection />;
    default: return invoiceId ? <InvoiceDetailSection invoiceId={invoiceId} /> : <DashboardSection filters={filters} />;
  }
}
