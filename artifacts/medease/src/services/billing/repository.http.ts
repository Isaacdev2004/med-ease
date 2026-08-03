import { httpTransport } from '@workspace/repository-transport';
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
import {
  billingFiltersToQuery,
  mapBillingDashboard,
  mapInsuranceClaim,
  mapInsurancePolicyArray,
  mapOutstandingBalanceArray,
  mapPaginatedClaims,
  mapPaginatedInvoices,
  mapPaginatedPayments,
  mapPaginatedReceipts,
  mapPaginatedRefunds,
  mapPatientInvoice,
  mapPayment,
  mapPaymentTimelineArray,
  mapRefund,
} from '@/services/billing/dto-mappers';

const BASE = '/api/billing';

class BillingHttpRepository {
  private readonly transport = httpTransport;
  private readonly favorites: InvoiceFavorite[] = [];
  private readonly shares: InvoiceShare[] = [];

  searchInvoices(filters?: BillingFilters) {
    return this.transport
      .get(`${BASE}/invoices`, { query: billingFiltersToQuery(filters) })
      .then(mapPaginatedInvoices);
  }

  async getInvoice(invoiceId: string) {
    try {
      return mapPatientInvoice(
        await this.transport.get(`${BASE}/invoices/${invoiceId}`),
      );
    } catch {
      return null;
    }
  }

  createInvoice(
    input: CreateInvoiceInput,
    patientName: string,
    facilityName: string,
    providerName: string,
  ) {
    return this.transport
      .post(`${BASE}/invoices`, {
        body: {
          ...input,
          patientName,
          facilityName,
          providerName,
        },
      })
      .then(mapPatientInvoice);
  }

  async updateInvoice(input: UpdateInvoiceInput) {
    try {
      return mapPatientInvoice(
        await this.transport.patch(`${BASE}/invoices/${input.invoiceId}`, {
          body: {
            lineItems: input.lineItems,
            notes: input.notes,
            status: input.status,
          },
        }),
      );
    } catch {
      return null;
    }
  }

  async deleteInvoice(invoiceId: string) {
    try {
      await this.transport.delete(`${BASE}/invoices/${invoiceId}`);
      return true;
    } catch {
      return false;
    }
  }

  searchClaims(filters?: BillingFilters) {
    return this.transport
      .get(`${BASE}/claims`, { query: billingFiltersToQuery(filters) })
      .then(mapPaginatedClaims);
  }

  async getClaim(claimId: string) {
    try {
      return mapInsuranceClaim(
        await this.transport.get(`${BASE}/claims/${claimId}`),
      );
    } catch {
      return null;
    }
  }

  submitClaim(input: SubmitClaimInput, patientName: string) {
    return this.transport
      .post(`${BASE}/claims`, {
        body: { ...input, patientName },
      })
      .then(mapInsuranceClaim);
  }

  async approveClaim(claimId: string, approvedAmount?: number) {
    try {
      return mapInsuranceClaim(
        await this.transport.post(`${BASE}/claims/${claimId}/approve`, {
          body: { approvedAmount },
        }),
      );
    } catch {
      return null;
    }
  }

  async denyClaim(claimId: string, reason: string) {
    try {
      return mapInsuranceClaim(
        await this.transport.post(`${BASE}/claims/${claimId}/deny`, {
          body: { reason },
        }),
      );
    } catch {
      return null;
    }
  }

  async resubmitClaim(claimId: string) {
    try {
      return mapInsuranceClaim(
        await this.transport.post(`${BASE}/claims/${claimId}/resubmit`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async recordPayment(input: RecordPaymentInput) {
    try {
      return mapPayment(
        await this.transport.post(`${BASE}/payments`, { body: input }),
      );
    } catch {
      return null;
    }
  }

  async refundPayment(input: RefundPaymentInput) {
    try {
      return mapRefund(
        await this.transport.post(`${BASE}/refunds`, { body: input }),
      );
    } catch {
      return null;
    }
  }

  getPayments(filters?: BillingFilters) {
    return this.transport
      .get(`${BASE}/payments`, { query: billingFiltersToQuery(filters) })
      .then(mapPaginatedPayments);
  }

  getReceipts(filters?: BillingFilters) {
    return this.transport
      .get(`${BASE}/receipts`, { query: billingFiltersToQuery(filters) })
      .then(mapPaginatedReceipts);
  }

  getInsurance(patientId?: string) {
    return this.transport
      .get(`${BASE}/insurance`, {
        query: patientId ? { patientId } : undefined,
      })
      .then(mapInsurancePolicyArray);
  }

  getRefunds(filters?: BillingFilters) {
    return this.transport
      .get(`${BASE}/refunds`, { query: billingFiltersToQuery(filters) })
      .then(mapPaginatedRefunds);
  }

  getDashboard(
    patientId?: string,
    providerId?: string,
    facilityId?: string,
  ) {
    return this.transport
      .get(`${BASE}/dashboard`, {
        query: {
          ...(patientId ? { patientId } : {}),
          ...(providerId ? { providerId } : {}),
          ...(facilityId ? { facilityId } : {}),
        },
      })
      .then(mapBillingDashboard);
  }

  getOutstandingBalances(patientId?: string) {
    return this.transport
      .get(`${BASE}/outstanding`, {
        query: patientId ? { patientId } : undefined,
      })
      .then(mapOutstandingBalanceArray);
  }

  getPaymentTimeline(invoiceId: string) {
    return this.transport
      .get(`${BASE}/invoices/${invoiceId}/timeline`)
      .then(mapPaymentTimelineArray);
  }

  async favoriteInvoice(invoiceId: string, patientId: string) {
    if (
      !this.favorites.some(
        (f) => f.invoiceId === invoiceId && f.patientId === patientId,
      )
    ) {
      this.favorites.push({
        invoiceId,
        patientId,
        createdAt: new Date().toISOString(),
      });
    }
    return this.favorites.filter((f) => f.patientId === patientId);
  }

  async shareInvoice(invoiceId: string, sharedWith: string) {
    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) return null;
    const share = {
      invoiceId,
      sharedWith,
      sharedAt: new Date().toISOString(),
    };
    this.shares.push(share);
    return share;
  }

  async downloadInvoice(invoiceId: string) {
    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) return null;
    return {
      url: `${BASE}/invoices/${invoiceId}`,
      invoiceNumber: invoice.invoiceNumber,
    };
  }

  async exportFinancialReport(
    format: 'csv' | 'pdf' | 'xlsx' = 'pdf',
  ): Promise<FinancialExport> {
    const invoices = await this.searchInvoices({ page: 1, pageSize: 1 });
    return {
      format,
      generatedAt: new Date().toISOString(),
      url: `${BASE}/exports/financial-report.${format}`,
      recordCount: invoices.total,
    };
  }

  async search(query: string, patientId?: string) {
    const [invoices, claims] = await Promise.all([
      this.searchInvoices({
        q: query,
        patientId,
        page: 1,
        pageSize: 10,
      }),
      this.searchClaims({
        q: query,
        patientId,
        page: 1,
        pageSize: 10,
      }),
    ]);
    return {
      invoices: invoices.items,
      claims: claims.items,
    };
  }
}

export const billingHttpRepository = new BillingHttpRepository();
