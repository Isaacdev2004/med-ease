import { useApiAuth } from '@/services/auth/auth-service';
import { computeRevenueAnalytics } from '@/services/billing/analytics';
import { getPatientIdForUser } from '@/services/billing/mock-data';
import { billingRepository } from '@/services/billing/repository';
import { resolveClinicalPatientId } from '@/services/patients/resolve-patient-id';
import type {
  BillingFilters,
  CreateInvoiceInput,
  RecordPaymentInput,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from '@/services/billing/types';

const DELAY = useApiAuth ? 0 : 250;
async function delay(ms = DELAY) {
  if (DELAY <= 0) return;
  await new Promise((r) => setTimeout(r, ms));
}

export const billingService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay(50);
    return resolveClinicalPatientId(userId, {
      explicitId,
      demoFallback: getPatientIdForUser,
    });
  },

  async searchInvoices(filters?: BillingFilters) {
    await delay();
    return billingRepository.searchInvoices(filters);
  },

  async getInvoice(invoiceId: string) {
    await delay();
    return billingRepository.getInvoice(invoiceId);
  },

  async createInvoice(input: CreateInvoiceInput) {
    await delay();
    return billingRepository.createInvoice(
      input,
      `Patient ${input.patientId}`,
      `Facility ${input.facilityId}`,
      `Provider ${input.providerId}`,
    );
  },

  async updateInvoice(input: UpdateInvoiceInput) {
    await delay();
    return billingRepository.updateInvoice(input);
  },

  async deleteInvoice(invoiceId: string) {
    await delay();
    return billingRepository.deleteInvoice(invoiceId);
  },

  async searchClaims(filters?: BillingFilters) {
    await delay();
    return billingRepository.searchClaims(filters);
  },

  async getClaim(claimId: string) {
    await delay();
    return billingRepository.getClaim(claimId);
  },

  async submitClaim(input: SubmitClaimInput) {
    await delay();
    return billingRepository.submitClaim(input, `Patient ${input.patientId}`);
  },

  async approveClaim(claimId: string, approvedAmount?: number) {
    await delay();
    return billingRepository.approveClaim(claimId, approvedAmount);
  },

  async denyClaim(claimId: string, reason: string) {
    await delay();
    return billingRepository.denyClaim(claimId, reason);
  },

  async resubmitClaim(claimId: string) {
    await delay();
    return billingRepository.resubmitClaim(claimId);
  },

  async recordPayment(input: RecordPaymentInput) {
    await delay();
    return billingRepository.recordPayment(input);
  },

  async refundPayment(input: RefundPaymentInput) {
    await delay();
    return billingRepository.refundPayment(input);
  },

  async getPayments(filters?: BillingFilters) {
    await delay();
    return billingRepository.getPayments(filters);
  },

  async getReceipts(filters?: BillingFilters) {
    await delay();
    return billingRepository.getReceipts(filters);
  },

  async getInsurance(patientId?: string) {
    await delay();
    return billingRepository.getInsurance(patientId);
  },

  async getRefunds(filters?: BillingFilters) {
    await delay();
    return billingRepository.getRefunds(filters);
  },

  async generateReceipt(paymentId: string) {
    await delay();
    const payments = await billingRepository.getPayments();
    const payment = payments.items.find((p) => p.paymentId === paymentId);
    if (!payment) return null;
    const receipts = await billingRepository.getReceipts({
      patientId: payment.patientId,
    });
    return receipts.items.find((r) => r.paymentId === paymentId) ?? null;
  },

  async downloadInvoice(invoiceId: string) {
    await delay();
    return billingRepository.downloadInvoice(invoiceId);
  },

  async shareInvoice(invoiceId: string, sharedWith: string) {
    await delay();
    return billingRepository.shareInvoice(invoiceId, sharedWith);
  },

  async favoriteInvoice(invoiceId: string, patientId: string) {
    await delay();
    return billingRepository.favoriteInvoice(invoiceId, patientId);
  },

  async getDashboard(
    patientId?: string,
    providerId?: string,
    facilityId?: string,
  ) {
    await delay();
    return billingRepository.getDashboard(patientId, providerId, facilityId);
  },

  async getAnalytics() {
    await delay();
    if (!useApiAuth) return computeRevenueAnalytics();

    const [dashboard, invoices, claims, payments] = await Promise.all([
      billingRepository.getDashboard(),
      billingRepository.searchInvoices({ page: 1, pageSize: 100 }),
      billingRepository.searchClaims({ page: 1, pageSize: 100 }),
      billingRepository.getPayments({ page: 1, pageSize: 100 }),
    ]);

    const totalRevenue = invoices.items.reduce((s, i) => s + i.total, 0);
    const collections = payments.items
      .filter((p) => p.status === 'completed')
      .reduce((s, p) => s + p.amount, 0);
    const outstanding = dashboard.outstandingBalances;
    const approved = claims.items.filter((c) =>
      ['approved', 'paid', 'partially_approved'].includes(c.status),
    ).length;
    const denied = claims.items.filter((c) => c.status === 'denied').length;
    const totalClaims = claims.items.length || 1;
    const reimbursed = claims.items.reduce((s, c) => s + c.approvedAmount, 0);

    const byFacility = new Map<string, number>();
    const byProvider = new Map<string, number>();
    const byDept = new Map<string, number>();
    for (const inv of invoices.items) {
      byFacility.set(
        inv.facilityName || 'Unknown',
        (byFacility.get(inv.facilityName || 'Unknown') ?? 0) + inv.total,
      );
      byProvider.set(
        inv.providerName || 'Unknown',
        (byProvider.get(inv.providerName || 'Unknown') ?? 0) + inv.total,
      );
      for (const line of inv.lineItems ?? []) {
        const dept = line.category || 'other';
        byDept.set(dept, (byDept.get(dept) ?? 0) + line.total);
      }
    }

    const dayBuckets = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return {
        label: d.toISOString().slice(5, 10),
        key: d.toISOString().slice(0, 10),
        value: 0,
      };
    });
    for (const inv of invoices.items) {
      const key = inv.issueDate?.slice(0, 10);
      const bucket = dayBuckets.find((b) => b.key === key);
      if (bucket) bucket.value += inv.total;
    }

    return {
      totalRevenue: totalRevenue || dashboard.grossRevenue,
      collections: collections || dashboard.netRevenue,
      outstanding,
      claimApprovalRate: Math.round((approved / totalClaims) * 100),
      denialRate: Math.round((denied / totalClaims) * 100),
      averageReimbursement: approved > 0 ? Math.round(reimbursed / approved) : 0,
      arAging: [
        { bucket: '0-30 days', amount: outstanding * 0.45 },
        { bucket: '31-60 days', amount: outstanding * 0.3 },
        { bucket: '61-90 days', amount: outstanding * 0.15 },
        { bucket: '90+ days', amount: outstanding * 0.1 },
      ],
      cashFlow: dayBuckets.map(({ label, value }) => ({ label, value })),
      departmentRevenue: [...byDept.entries()].map(([department, amount]) => ({
        department,
        amount,
      })),
      providerRevenue: [...byProvider.entries()]
        .slice(0, 8)
        .map(([provider, amount]) => ({ provider, amount })),
      facilityRevenue: [...byFacility.entries()].map(([facility, amount]) => ({
        facility,
        amount,
      })),
      dailyRevenue: dayBuckets.map(({ label, value }) => ({ label, value })),
      monthlyRevenue: [
        {
          label: 'Current',
          value: dashboard.monthlyRevenue || totalRevenue,
        },
      ],
      claimsTrends: [
        {
          month: 'Current',
          submitted: claims.items.length,
          approved,
          denied,
        },
      ],
      collectionsTrends: [
        {
          month: 'Current',
          collected: collections,
          outstanding,
        },
      ],
      payerMix: [],
      agingReport: [
        {
          bucket: 'Open balance',
          count: invoices.items.filter((i) => i.balance > 0).length,
          amount: outstanding,
        },
      ],
    };
  },

  async getOutstandingBalances(patientId?: string) {
    await delay();
    return billingRepository.getOutstandingBalances(patientId);
  },

  async getPaymentTimeline(invoiceId: string) {
    await delay();
    return billingRepository.getPaymentTimeline(invoiceId);
  },

  async search(query: string, patientId?: string) {
    await delay();
    return billingRepository.search(query, patientId);
  },

  async exportFinancialReport(format: 'csv' | 'pdf' | 'xlsx' = 'pdf') {
    await delay();
    return billingRepository.exportFinancialReport(format);
  },
};
