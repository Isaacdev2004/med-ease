import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Wallet,
} from 'lucide-react';

import type {
  ApprovalWorkflow,
  Budget,
  Contract,
  Delivery,
  GoodsReceipt,
  ProcurementAnalytics,
  ProcurementDashboard,
  ProcurementInvoice,
  PurchaseOrder,
  PurchaseRequest,
  RFQ,
  Shipment,
  SpendAnalysis,
  Supplier,
  SupplierScorecard,
  DemandForecast,
} from '@/services/procurement/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm truncate">{supplier.name}</CardTitle>
          {supplier.isPreferred ? (
            <Badge variant="default">Preferred</Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground capitalize">
          {supplier.category} · {supplier.country}
        </p>
        <p>
          Rating: {supplier.rating.toFixed(1)} · OTD:{' '}
          {supplier.onTimeDeliveryRate}%
        </p>
        <p className="text-xs">
          Spend: €{supplier.totalSpend.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}

export const VendorCard = SupplierCard;

export function PurchaseRequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: PurchaseRequest;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{request.requisitionNumber}</CardTitle>
          <Badge className="capitalize">
            {request.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="font-medium">{request.title}</p>
        <p className="text-muted-foreground">
          {request.requesterName} · {request.department}
        </p>
        <p className="font-bold">€{request.totalEstimate.toLocaleString()}</p>
        {(onApprove || onReject) && request.status === 'pending_approval' ? (
          <div className="flex gap-2 pt-1">
            {onApprove ? (
              <Button size="sm" onClick={onApprove}>
                Approve
              </Button>
            ) : null}
            {onReject ? (
              <Button size="sm" variant="outline" onClick={onReject}>
                Reject
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function PurchaseOrderCard({
  order,
  onApprove,
}: {
  order: PurchaseOrder;
  onApprove?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{order.poNumber}</CardTitle>
          <Badge className="capitalize">{order.status.replace('_', ' ')}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{order.supplierName}</p>
        <p className="font-bold">€{order.total.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">
          {order.items.length} line items · {order.department}
        </p>
        {onApprove && order.status === 'pending_approval' ? (
          <Button size="sm" className="mt-2" onClick={onApprove}>
            Approve PO
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function RFQCard({ rfq }: { rfq: RFQ }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{rfq.rfqNumber}</span>
          <Badge className="capitalize">{rfq.status}</Badge>
        </div>
        <p className="mt-1">{rfq.title}</p>
        <p className="text-muted-foreground">
          {rfq.responses.length} responses · deadline{' '}
          {format(new Date(rfq.deadline), 'MMM d')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ContractCard({ contract }: { contract: Contract }) {
  const expiring = contract.status === 'expiring';
  return (
    <Card className={cn(expiring && 'border-amber-500')}>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{contract.contractNumber}</span>
          <Badge
            variant={expiring ? 'secondary' : 'outline'}
            className="capitalize"
          >
            {contract.status}
          </Badge>
        </div>
        <p className="mt-1">{contract.title}</p>
        <p>{contract.supplierName}</p>
        <p className="font-bold">€{contract.value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">
          Ends {format(new Date(contract.endDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ApprovalCard({ workflow }: { workflow: ApprovalWorkflow }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium capitalize">
            {workflow.entityType.replace('_', ' ')}
          </span>
          <Badge className="capitalize">{workflow.status}</Badge>
        </div>
        <p className="text-muted-foreground">{workflow.entityId}</p>
        <p className="text-xs">
          Step {workflow.currentStep + 1} of {workflow.steps.length}
        </p>
      </CardContent>
    </Card>
  );
}

export function BudgetCard({ budget }: { budget: Budget }) {
  const pct = Math.round((budget.spent / budget.allocated) * 100);
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{budget.name}</p>
        <p className="text-muted-foreground capitalize">{budget.department}</p>
        <p className="font-bold">{pct}% utilized</p>
        <p className="text-xs">
          €{budget.remaining.toLocaleString()} remaining
        </p>
      </CardContent>
    </Card>
  );
}

export function SpendCard({ analysis }: { analysis: SpendAnalysis }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-2xl font-bold">
          €{analysis.totalSpend.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">
          Total spend · €{analysis.savings.toLocaleString()} savings
        </p>
      </CardContent>
    </Card>
  );
}

export function DeliveryCard({ delivery }: { delivery: Delivery }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm flex items-center gap-3">
        <Truck className="h-8 w-8 text-primary shrink-0" />
        <div>
          <p className="font-medium">{delivery.deliveryId}</p>
          <Badge className="capitalize">
            {delivery.status.replace('_', ' ')}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(delivery.scheduledDate), 'MMM d, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{shipment.trackingNumber}</p>
        <p>
          {shipment.carrier} · {shipment.origin} → {shipment.destination}
        </p>
        <Badge className="capitalize mt-1">
          {shipment.status.replace('_', ' ')}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function GoodsReceiptCard({ receipt }: { receipt: GoodsReceipt }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{receipt.receiptNumber}</p>
        <p className="text-muted-foreground">PO {receipt.poNumber}</p>
        <Badge className="capitalize">{receipt.status}</Badge>
      </CardContent>
    </Card>
  );
}

export function ReceivingCard({ receipt }: { receipt: GoodsReceipt }) {
  return <GoodsReceiptCard receipt={receipt} />;
}

export function InvoiceMatchingCard({
  invoice,
}: {
  invoice: ProcurementInvoice;
}) {
  const mismatch = invoice.variance > 0;
  return (
    <Card className={cn(mismatch && 'border-destructive')}>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{invoice.invoiceNumber}</span>
          <Badge
            variant={mismatch ? 'destructive' : 'default'}
            className="capitalize"
          >
            {invoice.status.replace('_', ' ')}
          </Badge>
        </div>
        <p>
          PO {invoice.poNumber} · €{invoice.total.toLocaleString()}
        </p>
        {mismatch ? (
          <p className="text-destructive text-xs flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Variance €{invoice.variance.toLocaleString()}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SupplierPerformanceCard({
  score,
}: {
  score: SupplierScorecard;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">
          #{score.rank} {score.supplierName.slice(0, 24)}
        </p>
        <p className="text-2xl font-bold">{score.overallScore}</p>
        <p className="text-xs text-muted-foreground">
          Q:{score.quality} D:{score.delivery} P:{score.price}
        </p>
      </CardContent>
    </Card>
  );
}

export function SupplierRiskCard({
  supplierId,
  risk,
  factors,
}: {
  supplierId: string;
  risk: string;
  factors: string[];
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{supplierId}</p>
        <Badge
          variant={
            risk === 'high'
              ? 'destructive'
              : risk === 'medium'
                ? 'secondary'
                : 'outline'
          }
          className="capitalize"
        >
          {risk} risk
        </Badge>
        <ul className="text-xs mt-2 list-disc pl-4">
          {factors.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ProcurementMetrics({
  dashboard,
}: {
  dashboard: ProcurementDashboard;
}) {
  const kpis = [
    {
      label: 'Total spend',
      value: `€${dashboard.totalSpend.toLocaleString()}`,
      icon: Wallet,
    },
    {
      label: 'Pending approvals',
      value: dashboard.pendingApprovals,
      icon: Clock,
    },
    { label: 'Open POs', value: dashboard.openPOs, icon: Package },
    { label: 'Open RFQs', value: dashboard.openRFQs, icon: CheckCircle2 },
    {
      label: 'Active contracts',
      value: dashboard.activeContracts,
      icon: CheckCircle2,
    },
    {
      label: 'Delayed deliveries',
      value: dashboard.overdueDeliveries,
      icon: Truck,
    },
    {
      label: 'Invoice mismatches',
      value: dashboard.invoiceMismatches,
      icon: AlertTriangle,
    },
    {
      label: 'Budget utilization',
      value: `${dashboard.budgetUtilization}%`,
      icon: Wallet,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-4 flex items-center gap-3">
            <k.icon className="h-8 w-8 text-primary shrink-0" />
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

export function SpendDashboard({ analysis }: { analysis: SpendAnalysis }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SpendCard analysis={analysis} />
      <Card>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold">
            €{analysis.committedSpend.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Committed spend</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold">
            €{analysis.savings.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Savings achieved</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ForecastChart({ forecasts }: { forecasts: DemandForecast[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {forecasts.slice(0, 6).map((f) => (
        <Card key={f.itemId}>
          <CardContent className="pt-4 text-sm">
            <p className="font-medium truncate">{f.itemName}</p>
            <p>
              Current: {f.currentDemand} → Projected: {f.projectedDemand}
            </p>
            <p className="text-xs text-muted-foreground">
              Lead time: {f.leadTimeDays}d
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ApprovalTimeline({
  workflows,
}: {
  workflows: ApprovalWorkflow[];
}) {
  return (
    <div className="space-y-3">
      {workflows.map((w) => (
        <div key={w.workflowId} className="border-l-2 border-primary/30 pl-4">
          <p className="text-sm font-medium capitalize">
            {w.entityType.replace('_', ' ')} · {w.entityId}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {w.steps.map((s) => (
              <Badge
                key={s.stepId}
                variant={
                  s.status === 'approved'
                    ? 'default'
                    : s.status === 'pending'
                      ? 'secondary'
                      : 'outline'
                }
                className="text-xs capitalize"
              >
                {s.role}: {s.status}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPanel({
  analytics,
}: {
  analytics: ProcurementAnalytics;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChartPanel title="Spend trends" data={analytics.spendTrends} />
      <BarChartPanel
        title="Spend by department"
        data={analytics.spendByDepartment}
      />
      <BarChartPanel
        title="Supplier rankings"
        data={analytics.supplierRankings}
      />
      <BarChartPanel title="Budget vs actual" data={analytics.budgetVsActual} />
      <div className="grid grid-cols-3 gap-4 lg:col-span-2">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{analytics.invoiceMatchRate}%</p>
            <p className="text-xs text-muted-foreground">Invoice match rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">
              {analytics.onTimeDeliveryRate}%
            </p>
            <p className="text-xs text-muted-foreground">On-time delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">
              €{analytics.savingsAchieved.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Savings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ExportToolbar({
  onExport,
}: {
  onExport?: (f: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex gap-2">
      {(['xlsx', 'csv', 'pdf'] as const).map((f) => (
        <Button
          key={f}
          size="sm"
          variant="outline"
          onClick={() => onExport?.(f)}
        >
          {f.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function RFQComparisonPanel({ rfq }: { rfq: RFQ }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {rfq.title} — {rfq.responses.length} quotes
      </p>
      {rfq.responses.slice(0, 4).map((r) => (
        <div
          key={r.responseId}
          className="flex justify-between text-sm border-b py-2"
        >
          <span>{r.supplierName}</span>
          <span className="font-bold">
            €{r.totalQuote.toLocaleString()} {r.rank ? `(#${r.rank})` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
