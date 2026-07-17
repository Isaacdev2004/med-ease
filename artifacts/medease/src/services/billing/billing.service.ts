import { computeRevenueAnalytics } from '@/services/billing/analytics';
import { getPatientIdForUser } from '@/services/billing/mock-data';
import { billingRepository } from '@/services/billing/repository';
import type {
  BillingFilters,
  CreateInvoiceInput,
  RecordPaymentInput,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from '@/services/billing/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const billingService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay(50);
    return explicitId ?? getPatientIdForUser(userId);
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
    const payments = billingRepository.getPayments();
    const payment = payments.items.find((p) => p.paymentId === paymentId);
    if (!payment) return null;
    return (
      billingRepository
        .getReceipts({ patientId: payment.patientId })
        .items.find((r) => r.paymentId === paymentId) ?? null
    );
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
    return computeRevenueAnalytics();
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
