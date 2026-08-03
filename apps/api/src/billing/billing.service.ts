import { Injectable } from '@nestjs/common';

import type {
  BillingFilters,
  CreateInvoiceInput,
  RecordPaymentInput,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from '@medease/billing-contract';

import { BillingRepository } from './billing.repository';

@Injectable()
export class BillingService {
  constructor(private readonly repository: BillingRepository) {}

  searchInvoices(filters?: BillingFilters) {
    return this.repository.searchInvoices(filters);
  }

  getInvoice(invoiceId: string) {
    return this.repository.getInvoice(invoiceId);
  }

  createInvoice(input: CreateInvoiceInput) {
    return this.repository.createInvoice(input);
  }

  updateInvoice(input: UpdateInvoiceInput) {
    return this.repository.updateInvoice(input);
  }

  deleteInvoice(invoiceId: string) {
    return this.repository.deleteInvoice(invoiceId);
  }

  searchClaims(filters?: BillingFilters) {
    return this.repository.searchClaims(filters);
  }

  getClaim(claimId: string) {
    return this.repository.getClaim(claimId);
  }

  submitClaim(input: SubmitClaimInput) {
    return this.repository.submitClaim(input);
  }

  approveClaim(claimId: string, approvedAmount?: number) {
    return this.repository.approveClaim(claimId, approvedAmount);
  }

  denyClaim(claimId: string, reason: string) {
    return this.repository.denyClaim(claimId, reason);
  }

  resubmitClaim(claimId: string) {
    return this.repository.resubmitClaim(claimId);
  }

  recordPayment(input: RecordPaymentInput) {
    return this.repository.recordPayment(input);
  }

  refundPayment(input: RefundPaymentInput) {
    return this.repository.refundPayment(input);
  }

  getPayments(filters?: BillingFilters) {
    return this.repository.getPayments(filters);
  }

  getReceipts(filters?: BillingFilters) {
    return this.repository.getReceipts(filters);
  }

  getRefunds(filters?: BillingFilters) {
    return this.repository.getRefunds(filters);
  }

  getInsurance(patientId?: string) {
    return this.repository.getInsurance(patientId);
  }

  getDashboard(
    patientId?: string,
    providerId?: string,
    facilityId?: string,
  ) {
    return this.repository.getDashboard(patientId, providerId, facilityId);
  }

  getOutstandingBalances(patientId?: string) {
    return this.repository.getOutstandingBalances(patientId);
  }

  getPaymentTimeline(invoiceId: string) {
    return this.repository.getPaymentTimeline(invoiceId);
  }
}
