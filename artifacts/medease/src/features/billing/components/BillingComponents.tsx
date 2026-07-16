import { format } from 'date-fns';
import { CreditCard, Download, FileText, RefreshCw, Share2, Wallet } from 'lucide-react';

import type {
  BillingDashboard,
  InsuranceClaim,
  InsurancePolicy,
  PatientInvoice,
  Payment,
  PaymentTimelineEntry,
  Receipt,
  Refund,
  RevenueAnalytics,
  OutstandingBalance,
} from '@/services/billing/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function ClaimStatusBadge({ status }: { status: InsuranceClaim['status'] }) {
  const variant = status === 'approved' || status === 'paid' ? 'default' : status === 'denied' ? 'destructive' : 'secondary';
  return <Badge variant={variant} className="capitalize">{status.replace('_', ' ')}</Badge>;
}

function invoiceStatusVariant(status: PatientInvoice['status']) {
  if (status === 'paid') return 'default';
  if (status === 'overdue' || status === 'cancelled') return 'destructive';
  return 'secondary';
}

export function InvoiceCard({ invoice, onPay }: { invoice: PatientInvoice; onPay?: () => void }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{invoice.invoiceNumber}</CardTitle>
          <Badge variant={invoiceStatusVariant(invoice.status)} className="capitalize">{invoice.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-medium">{invoice.patientName}</p>
        <p className="text-muted-foreground">{format(new Date(invoice.issueDate), 'MMM d, yyyy')} · Due {format(new Date(invoice.dueDate), 'MMM d')}</p>
        <p className="text-lg font-bold">{invoice.currency} {invoice.total.toLocaleString()}</p>
        {invoice.balance > 0 ? <p className="text-xs text-muted-foreground">Balance: {invoice.currency} {invoice.balance.toLocaleString()}</p> : null}
        {invoice.balance > 0 && onPay ? <Button size="sm" className="mt-2" onClick={onPay}><CreditCard className="mr-1 h-3 w-3" />Pay</Button> : null}
      </CardContent>
    </Card>
  );
}

export function InvoiceTable({ invoices }: { invoices: PatientInvoice[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">Invoice</th>
            <th className="p-3 text-left font-medium">Patient</th>
            <th className="p-3 text-left font-medium">Date</th>
            <th className="p-3 text-right font-medium">Total</th>
            <th className="p-3 text-right font-medium">Balance</th>
            <th className="p-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.invoiceId} className="border-t">
              <td className="p-3">{inv.invoiceNumber}</td>
              <td className="p-3">{inv.patientName}</td>
              <td className="p-3">{format(new Date(inv.issueDate), 'MMM d, yyyy')}</td>
              <td className="p-3 text-right">{inv.currency} {inv.total.toLocaleString()}</td>
              <td className="p-3 text-right">{inv.currency} {inv.balance.toLocaleString()}</td>
              <td className="p-3"><Badge variant={invoiceStatusVariant(inv.status)} className="capitalize">{inv.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ClaimCard({ claim }: { claim: InsuranceClaim }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{claim.claimId}</CardTitle>
          <ClaimStatusBadge status={claim.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p className="font-medium">{claim.payer}</p>
        <p className="text-muted-foreground">{claim.patientName}</p>
        <p>Claim: {claim.currency} {claim.totalClaim.toLocaleString()}</p>
        {claim.approvedAmount > 0 ? <p className="text-emerald-600">Approved: {claim.currency} {claim.approvedAmount.toLocaleString()}</p> : null}
      </CardContent>
    </Card>
  );
}

export function PaymentCard({ payment }: { payment: Payment }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Wallet className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium capitalize">{payment.method.replace('_', ' ')}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(payment.paidAt), 'MMM d, yyyy HH:mm')}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{payment.currency} {payment.amount.toLocaleString()}</p>
          <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'failed' ? 'destructive' : 'secondary'} className="capitalize">{payment.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{receipt.receiptNumber}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(receipt.issuedAt), 'PPp')}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{receipt.currency} {receipt.amount.toLocaleString()}</p>
          <Button size="sm" variant="outline" className="mt-1"><Download className="mr-1 h-3 w-3" />PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function InsuranceCard({ policy }: { policy: InsurancePolicy }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{policy.payer}</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground">{policy.planType} · {policy.policyNumber}</p>
        <Badge className="capitalize">{policy.status}</Badge>
        <p className="text-xs">Deductible: {policy.deductible} · Copay: {policy.copay}</p>
        {policy.eligibilityVerified ? <p className="text-xs text-emerald-600">Eligibility verified</p> : <p className="text-xs text-amber-600">Verification pending</p>}
      </CardContent>
    </Card>
  );
}

export function FinancialMetrics({ dashboard }: { dashboard: BillingDashboard }) {
  const kpis = [
    { label: 'Daily revenue', value: `€${dashboard.dailyRevenue.toLocaleString()}` },
    { label: 'Monthly revenue', value: `€${dashboard.monthlyRevenue.toLocaleString()}` },
    { label: 'Outstanding', value: `€${dashboard.outstandingBalances.toLocaleString()}` },
    { label: 'Collection rate', value: `${dashboard.collectionRate}%` },
    { label: 'Pending claims', value: dashboard.pendingClaims },
    { label: 'Denied claims', value: dashboard.deniedClaims },
    { label: 'Paid invoices', value: dashboard.paidInvoices },
    { label: 'Net revenue', value: `€${dashboard.netRevenue.toLocaleString()}` },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}><CardContent className="pt-4"><p className="text-2xl font-bold">{k.value}</p><p className="text-xs text-muted-foreground">{k.label}</p></CardContent></Card>
      ))}
    </div>
  );
}

export const RevenueDashboard = FinancialMetrics;

export function RevenueChart({ analytics }: { analytics: RevenueAnalytics }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChartPanel title="Daily revenue" data={analytics.dailyRevenue} />
      <BarChartPanel title="Monthly revenue" data={analytics.monthlyRevenue} />
    </div>
  );
}

export function OutstandingBalanceCard({ balance }: { balance: OutstandingBalance }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="font-medium">{balance.patientName}</p>
        <p className="text-2xl font-bold text-destructive">{balance.currency} {balance.totalOutstanding.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{balance.invoiceCount} invoices · oldest due {format(new Date(balance.oldestDueDate), 'MMM d')}</p>
      </CardContent>
    </Card>
  );
}

export function PaymentTimeline({ entries }: { entries: PaymentTimelineEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((e) => (
        <div key={e.id} className="border-l-2 border-primary/30 pl-4">
          <p className="text-sm font-medium">{e.title}</p>
          <p className={cn('text-sm', e.amount < 0 ? 'text-destructive' : 'text-emerald-600')}>
            {e.amount >= 0 ? '+' : ''}{e.amount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{format(new Date(e.date), 'MMM d, HH:mm')} · {e.status}</p>
        </div>
      ))}
    </div>
  );
}

export function RefundCard({ refund }: { refund: Refund }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-1">
        <div className="flex justify-between"><span className="font-medium">{refund.refundId}</span><Badge className="capitalize">{refund.status}</Badge></div>
        <p className="text-destructive font-bold">-{refund.currency} {refund.amount.toLocaleString()}</p>
        <p className="text-muted-foreground">{refund.reason}</p>
      </CardContent>
    </Card>
  );
}

export function InvoiceDetailPanel({ invoice }: { invoice: PatientInvoice }) {
  return (
    <Card>
      <CardHeader><CardTitle>{invoice.invoiceNumber}</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div><p className="text-muted-foreground">Patient</p><p>{invoice.patientName}</p></div>
          <div><p className="text-muted-foreground">Provider</p><p>{invoice.providerName}</p></div>
          <div><p className="text-muted-foreground">Facility</p><p>{invoice.facilityName}</p></div>
          <div><p className="text-muted-foreground">Status</p><Badge className="capitalize">{invoice.status}</Badge></div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted/50"><tr><th className="p-2 text-left">Item</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Total</th></tr></thead>
            <tbody>{invoice.lineItems.map((li) => <tr key={li.id} className="border-t"><td className="p-2">{li.description}</td><td className="p-2 text-right">{li.quantity}</td><td className="p-2 text-right">{li.total}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="flex justify-between font-bold text-base"><span>Total</span><span>{invoice.currency} {invoice.total.toLocaleString()}</span></div>
      </CardContent>
    </Card>
  );
}

export function ClaimDetailPanel({ claim }: { claim: InsuranceClaim }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{claim.claimId}</CardTitle><ClaimStatusBadge status={claim.status} /></CardHeader>
      <CardContent className="text-sm space-y-2">
        <p><span className="text-muted-foreground">Payer:</span> {claim.payer}</p>
        <p><span className="text-muted-foreground">Policy:</span> {claim.policyNumber}</p>
        <p><span className="text-muted-foreground">Diagnosis:</span> {claim.diagnosisCodes.join(', ')}</p>
        <p><span className="text-muted-foreground">Procedures:</span> {claim.procedureCodes.join(', ')}</p>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div><p className="text-muted-foreground">Claimed</p><p className="font-bold">{claim.totalClaim}</p></div>
          <div><p className="text-muted-foreground">Approved</p><p className="font-bold text-emerald-600">{claim.approvedAmount}</p></div>
          <div><p className="text-muted-foreground">Denied</p><p className="font-bold text-destructive">{claim.deniedAmount}</p></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentMethodCard({ method, active }: { method: string; active?: boolean }) {
  return (
    <Card className={cn(active && 'ring-2 ring-primary')}>
      <CardContent className="pt-4 flex items-center gap-2 text-sm capitalize">
        <CreditCard className="h-5 w-5" />{method.replace('_', ' ')}
      </CardContent>
    </Card>
  );
}

export function CollectionPanel({ rate, outstanding }: { rate: number; outstanding: number }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">Collections</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>Collection rate: <span className="font-bold">{rate}%</span></p>
        <p>Outstanding A/R: <span className="font-bold text-destructive">€{outstanding.toLocaleString()}</span></p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsPanel({ analytics }: { analytics: RevenueAnalytics }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChartPanel title="Department revenue" data={analytics.departmentRevenue.map((d) => ({ label: d.department, value: d.amount }))} />
      <BarChartPanel title="Claims trends" data={analytics.claimsTrends.map((c) => ({ label: c.month, value: c.approved }))} />
      <BarChartPanel title="Collections trends" data={analytics.collectionsTrends.map((c) => ({ label: c.month, value: c.collected }))} />
      <BarChartPanel title="A/R aging" data={analytics.arAging.map((a) => ({ label: a.bucket, value: a.amount }))} />
    </div>
  );
}

export function ExportToolbar({ onExport }: { onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => onExport?.('pdf')}><FileText className="mr-1 h-3 w-3" />PDF</Button>
      <Button size="sm" variant="outline" onClick={() => onExport?.('csv')}><Download className="mr-1 h-3 w-3" />CSV</Button>
      <Button size="sm" variant="outline" onClick={() => onExport?.('xlsx')}><RefreshCw className="mr-1 h-3 w-3" />Excel</Button>
      <Button size="sm" variant="outline"><Share2 className="mr-1 h-3 w-3" />Share</Button>
    </div>
  );
}
