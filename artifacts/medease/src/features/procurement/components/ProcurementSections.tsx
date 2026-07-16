import {
  AnalyticsPanel,
  ApprovalCard,
  ApprovalTimeline,
  BudgetCard,
  ContractCard,
  DeliveryCard,
  ExportToolbar,
  ForecastChart,
  GoodsReceiptCard,
  InvoiceMatchingCard,
  ProcurementMetrics,
  PurchaseOrderCard,
  PurchaseRequestCard,
  RFQCard,
  RFQComparisonPanel,
  SpendDashboard,
  SupplierCard,
  SupplierPerformanceCard,
} from '@/features/procurement/components/ProcurementComponents';
import {
  useApprovalQueue,
  useBudgets,
  useContracts,
  useDeliveries,
  useForecast,
  useInvoices,
  useProcurementAnalytics,
  useProcurementDashboard,
  usePurchaseOrders,
  usePurchaseRequests,
  useReceiving,
  useRFQs,
  useSpendAnalysis,
  useSupplierPerformance,
  useSuppliers,
} from '@/features/procurement/hooks/use-procurement';
import { useProcurementMutations } from '@/features/procurement/mutations/procurement.mutations';
import type { ProcurementFilters } from '@/services/procurement/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { ShoppingCart } from 'lucide-react';

export type ProcurementSection =
  | 'dashboard'
  | 'requests'
  | 'purchase-orders'
  | 'suppliers'
  | 'rfqs'
  | 'contracts'
  | 'budgets'
  | 'receiving'
  | 'deliveries'
  | 'approvals'
  | 'analytics';

export function DashboardSection({ filters }: { filters?: ProcurementFilters }) {
  const dashboard = useProcurementDashboard(filters?.department);
  const spend = useSpendAnalysis(filters?.department);
  if (dashboard.isLoading) return <LoadingView label="Loading procurement…" />;
  if (!dashboard.data) return <EmptyState icon={ShoppingCart} title="No procurement data" />;
  return (
    <div className="space-y-6">
      <ProcurementMetrics dashboard={dashboard.data} />
      {spend.data ? <SpendDashboard analysis={spend.data} /> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboard.data.recentOrders.slice(0, 3).map((o) => <PurchaseOrderCard key={o.purchaseOrderId} order={o} />)}
      </div>
      <ApprovalTimeline workflows={dashboard.data.pendingApprovalItems} />
    </div>
  );
}

export function RequestsSection({ filters }: { filters?: ProcurementFilters }) {
  const query = usePurchaseRequests(filters);
  const { approveRequest, rejectRequest } = useProcurementMutations();
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={ShoppingCart} title="No purchase requests" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 15).map((r) => (
        <PurchaseRequestCard
          key={r.requestId}
          request={r}
          onApprove={r.status === 'pending_approval' ? () => approveRequest.mutate({ requestId: r.requestId, approverId: 'usr-001', approverName: 'Approver' }) : undefined}
          onReject={r.status === 'pending_approval' ? () => rejectRequest.mutate({ requestId: r.requestId, approverId: 'usr-001', approverName: 'Approver' }) : undefined}
        />
      ))}
    </div>
  );
}

export function PurchaseOrdersSection({ filters }: { filters?: ProcurementFilters }) {
  const query = usePurchaseOrders(filters);
  const { approvePO } = useProcurementMutations();
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 15).map((o) => (
        <PurchaseOrderCard
          key={o.purchaseOrderId}
          order={o}
          onApprove={o.status === 'pending_approval' ? () => approvePO.mutate({ purchaseOrderId: o.purchaseOrderId, approverId: 'usr-001', approverName: 'Approver' }) : undefined}
        />
      ))}
    </div>
  );
}

export function SuppliersSection({ filters }: { filters?: ProcurementFilters }) {
  const query = useSuppliers(filters);
  const perf = useSupplierPerformance();
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perf.data?.slice(0, 4).map((s) => <SupplierPerformanceCard key={s.supplierId} score={s} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 12).map((s) => <SupplierCard key={s.supplierId} supplier={s} />)}
      </div>
    </div>
  );
}

export function RFQsSection({ filters }: { filters?: ProcurementFilters }) {
  const query = useRFQs(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  const sample = items[0];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 9).map((r) => <RFQCard key={r.rfqId} rfq={r} />)}
      </div>
      {sample ? <RFQComparisonPanel rfq={sample} /> : null}
    </div>
  );
}

export function ContractsSection({ filters }: { filters?: ProcurementFilters }) {
  const query = useContracts(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((c) => <ContractCard key={c.contractId} contract={c} />)}</div>;
}

export function BudgetsSection({ filters }: { filters?: ProcurementFilters }) {
  const query = useBudgets(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((b) => <BudgetCard key={b.budgetId} budget={b} />)}</div>;
}

export function ReceivingSection({ filters }: { filters?: ProcurementFilters }) {
  const query = useReceiving(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((r) => <GoodsReceiptCard key={r.receiptId} receipt={r} />)}</div>;
}

export function DeliveriesSection({ filters }: { filters?: ProcurementFilters }) {
  const query = useDeliveries(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((d) => <DeliveryCard key={d.deliveryId} delivery={d} />)}</div>;
}

export function ApprovalsSection() {
  const query = useApprovalQueue();
  if (query.isLoading) return <LoadingView />;
  const items = query.data ?? [];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 9).map((a) => <ApprovalCard key={a.workflowId} workflow={a} />)}</div>
      <ApprovalTimeline workflows={items} />
    </div>
  );
}

export function AnalyticsSection() {
  const analytics = useProcurementAnalytics();
  const forecast = useForecast();
  const invoices = useInvoices();
  if (analytics.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {analytics.data ? <AnalyticsPanel analytics={analytics.data} /> : null}
      {forecast.data ? <ForecastChart forecasts={forecast.data} /> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(invoices.data?.items ?? []).slice(0, 6).map((i) => <InvoiceMatchingCard key={i.invoiceId} invoice={i} />)}
      </div>
      <ExportToolbar />
    </div>
  );
}

export function ProcurementSectionContent({ section, filters }: { section: ProcurementSection; filters?: ProcurementFilters }) {
  switch (section) {
    case 'requests': return <RequestsSection filters={filters} />;
    case 'purchase-orders': return <PurchaseOrdersSection filters={filters} />;
    case 'suppliers': return <SuppliersSection filters={filters} />;
    case 'rfqs': return <RFQsSection filters={filters} />;
    case 'contracts': return <ContractsSection filters={filters} />;
    case 'budgets': return <BudgetsSection filters={filters} />;
    case 'receiving': return <ReceivingSection filters={filters} />;
    case 'deliveries': return <DeliveriesSection filters={filters} />;
    case 'approvals': return <ApprovalsSection />;
    case 'analytics': return <AnalyticsSection />;
    default: return <DashboardSection filters={filters} />;
  }
}
