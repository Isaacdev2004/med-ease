import { approveClaim, denyClaim, resubmitClaim, submitClaim, validateClaim } from '@/services/billing/claims';
import {
  buildDashboard,
  buildOutstandingBalances,
  buildPaymentTimeline,
  MOCK_CLAIMS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_POLICIES,
  MOCK_RECEIPTS,
  MOCK_REFUNDS,
} from '@/services/billing/mock-data';
import { buildInvoice } from '@/services/billing/invoices';
import { processPayment } from '@/services/billing/payments';
import { generateReceipt } from '@/services/billing/receipts';
import { processRefund } from '@/services/billing/refunds';
import type {
  BillingFilters,
  CreateInvoiceInput,
  FinancialExport,
  InvoiceFavorite,
  InvoiceShare,
  RecordPaymentInput,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from '@/services/billing/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}

function matchInvoice(inv: typeof MOCK_INVOICES[0], filters: BillingFilters) {
  if (filters.patientId && inv.patientId !== filters.patientId) return false;
  if (filters.providerId && inv.providerId !== filters.providerId) return false;
  if (filters.facilityId && inv.facilityId !== filters.facilityId) return false;
  if (filters.status && inv.status !== filters.status) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (!inv.invoiceNumber.toLowerCase().includes(q) && !inv.patientName.toLowerCase().includes(q)) return false;
  }
  return true;
}

function matchClaim(c: typeof MOCK_CLAIMS[0], filters: BillingFilters) {
  if (filters.patientId && c.patientId !== filters.patientId) return false;
  if (filters.providerId && c.providerId !== filters.providerId) return false;
  if (filters.facilityId && c.facilityId !== filters.facilityId) return false;
  if (filters.status && c.status !== filters.status) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (!c.claimId.toLowerCase().includes(q) && !c.payer.toLowerCase().includes(q)) return false;
  }
  return true;
}

class BillingRepository {
  private invoices = [...MOCK_INVOICES];
  private claims = [...MOCK_CLAIMS];
  private payments = [...MOCK_PAYMENTS];
  private receipts = [...MOCK_RECEIPTS];
  private refunds = [...MOCK_REFUNDS];
  private policies = [...MOCK_POLICIES];
  private favorites: InvoiceFavorite[] = [];
  private shares: InvoiceShare[] = [];
  private nextId = 6000;

  searchInvoices(filters?: BillingFilters) {
    const filtered = this.invoices.filter((i) => matchInvoice(i, filters ?? {}));
    return paginate(filtered.sort((a, b) => b.issueDate.localeCompare(a.issueDate)), filters?.page, filters?.pageSize);
  }

  getInvoice(invoiceId: string) {
    return this.invoices.find((i) => i.invoiceId === invoiceId) ?? null;
  }

  createInvoice(input: CreateInvoiceInput, patientName: string, facilityName: string, providerName: string) {
    const id = `inv-${String(++this.nextId).padStart(5, '0')}`;
    const invoice = buildInvoice(input, id, `INV-${2025000 + this.nextId}`, patientName, facilityName, providerName);
    this.invoices.unshift(invoice);
    return invoice;
  }

  updateInvoice(input: UpdateInvoiceInput) {
    const idx = this.invoices.findIndex((i) => i.invoiceId === input.invoiceId);
    if (idx < 0) return null;
    const inv = this.invoices[idx]!;
    if (input.notes !== undefined) inv.notes = input.notes;
    if (input.status) inv.status = input.status;
    if (input.lineItems) {
      inv.lineItems = input.lineItems.map((li, i) => ({ ...li, id: `li-${inv.invoiceId}-${i}`, total: li.quantity * li.unitPrice }));
      inv.subtotal = inv.lineItems.reduce((s, li) => s + li.total, 0);
      inv.total = inv.subtotal - inv.discounts + inv.tax;
      inv.balance = inv.total - inv.paidAmount;
    }
    inv.updatedAt = new Date().toISOString();
    this.invoices[idx] = inv;
    return inv;
  }

  deleteInvoice(invoiceId: string) {
    const idx = this.invoices.findIndex((i) => i.invoiceId === invoiceId);
    if (idx < 0) return false;
    this.invoices.splice(idx, 1);
    return true;
  }

  searchClaims(filters?: BillingFilters) {
    const filtered = this.claims.filter((c) => matchClaim(c, filters ?? {}));
    return paginate(filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), filters?.page, filters?.pageSize);
  }

  getClaim(claimId: string) {
    return this.claims.find((c) => c.claimId === claimId) ?? null;
  }

  submitClaim(input: SubmitClaimInput, patientName: string) {
    const errors = validateClaim(input);
    if (errors.length) throw new Error(errors.join('; '));
    const id = `clm-${String(++this.nextId).padStart(5, '0')}`;
    const claim = submitClaim(input, id, patientName);
    this.claims.unshift(claim);
    return claim;
  }

  approveClaim(claimId: string, approvedAmount?: number) {
    const idx = this.claims.findIndex((c) => c.claimId === claimId);
    if (idx < 0) return null;
    const claim = this.claims[idx]!;
    const updated = approveClaim(claim, approvedAmount ?? claim.totalClaim);
    this.claims[idx] = updated;
    return updated;
  }

  denyClaim(claimId: string, reason: string) {
    const idx = this.claims.findIndex((c) => c.claimId === claimId);
    if (idx < 0) return null;
    const updated = denyClaim(this.claims[idx]!, reason);
    this.claims[idx] = updated;
    return updated;
  }

  resubmitClaim(claimId: string) {
    const idx = this.claims.findIndex((c) => c.claimId === claimId);
    if (idx < 0) return null;
    const updated = resubmitClaim(this.claims[idx]!);
    this.claims[idx] = updated;
    return updated;
  }

  async recordPayment(input: RecordPaymentInput) {
    const invoice = this.getInvoice(input.invoiceId);
    if (!invoice) return null;
    const id = `pay-${String(++this.nextId).padStart(5, '0')}`;
    const payment = await processPayment(input, id, invoice.patientId);
    this.payments.unshift(payment);
    if (payment.status === 'completed') {
      invoice.paidAmount += payment.amount;
      invoice.balance = Math.max(0, invoice.total - invoice.paidAmount);
      invoice.status = invoice.balance === 0 ? 'paid' : 'partial';
      invoice.paymentMethod = payment.method;
      invoice.updatedAt = new Date().toISOString();
      const receipt = generateReceipt(payment, `rcp-${this.nextId}`);
      this.receipts.unshift(receipt);
    }
    return payment;
  }

  refundPayment(input: RefundPaymentInput) {
    const payment = this.payments.find((p) => p.paymentId === input.paymentId);
    if (!payment) return null;
    const id = `rfd-${String(++this.nextId).padStart(4, '0')}`;
    const refund = processRefund(input, payment, id);
    this.refunds.unshift(refund);
    payment.status = 'refunded';
    const invoice = this.getInvoice(payment.invoiceId);
    if (invoice) {
      invoice.paidAmount = Math.max(0, invoice.paidAmount - input.amount);
      invoice.balance = invoice.total - invoice.paidAmount;
      invoice.updatedAt = new Date().toISOString();
    }
    return refund;
  }

  getPayments(filters?: BillingFilters) {
    let items = [...this.payments];
    if (filters?.patientId) items = items.filter((p) => p.patientId === filters.patientId);
    if (filters?.facilityId) items = items.filter((p) => p.facilityId === filters.facilityId);
    return paginate(items.sort((a, b) => b.paidAt.localeCompare(a.paidAt)), filters?.page, filters?.pageSize);
  }

  getReceipts(filters?: BillingFilters) {
    let items = [...this.receipts];
    if (filters?.patientId) items = items.filter((r) => r.patientId === filters.patientId);
    return paginate(items.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)), filters?.page, filters?.pageSize);
  }

  getInsurance(patientId?: string) {
    return patientId ? this.policies.filter((p) => p.patientId === patientId) : this.policies;
  }

  getRefunds(filters?: BillingFilters) {
    let items = [...this.refunds];
    if (filters?.patientId) {
      items = items.filter((r) => {
        const inv = this.getInvoice(r.invoiceId);
        return inv?.patientId === filters.patientId;
      });
    }
    return paginate(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), filters?.page, filters?.pageSize);
  }

  getDashboard(patientId?: string, providerId?: string, facilityId?: string) {
    return buildDashboard(patientId, providerId, facilityId);
  }

  getOutstandingBalances(patientId?: string) {
    const all = buildOutstandingBalances();
    return patientId ? all.filter((b) => b.patientId === patientId) : all;
  }

  getPaymentTimeline(invoiceId: string) {
    return buildPaymentTimeline(invoiceId);
  }

  favoriteInvoice(invoiceId: string, patientId: string) {
    if (!this.favorites.some((f) => f.invoiceId === invoiceId && f.patientId === patientId)) {
      this.favorites.push({ invoiceId, patientId, createdAt: new Date().toISOString() });
    }
    return this.favorites.filter((f) => f.patientId === patientId);
  }

  shareInvoice(invoiceId: string, sharedWith: string) {
    const share = { invoiceId, sharedWith, sharedAt: new Date().toISOString() };
    this.shares.push(share);
    return share;
  }

  downloadInvoice(invoiceId: string) {
    const inv = this.getInvoice(invoiceId);
    if (!inv) return null;
    return { url: `/mock/invoices/${invoiceId}.pdf`, invoiceNumber: inv.invoiceNumber };
  }

  exportFinancialReport(format: 'csv' | 'pdf' | 'xlsx'): FinancialExport {
    return {
      format,
      generatedAt: new Date().toISOString(),
      url: `/mock/exports/financial-report.${format}`,
      recordCount: this.invoices.length,
    };
  }

  search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const invoices = this.invoices.filter((i) => (!patientId || i.patientId === patientId) && (i.invoiceNumber.toLowerCase().includes(q) || i.patientName.toLowerCase().includes(q))).slice(0, 10);
    const claims = this.claims.filter((c) => (!patientId || c.patientId === patientId) && (c.claimId.toLowerCase().includes(q) || c.payer.toLowerCase().includes(q))).slice(0, 10);
    return { invoices, claims };
  }
}

export const billingRepository = new BillingRepository();
