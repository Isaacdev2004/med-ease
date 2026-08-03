import type {
  BillingDashboard,
  BillingFilters,
  ClaimListResult,
  CreateInvoiceInput,
  InsuranceClaim,
  InsurancePolicy,
  InvoiceListResult,
  OutstandingBalance,
  PatientInvoice,
  Payment,
  PaymentListResult,
  PaymentTimelineEntry,
  ReceiptListResult,
  RecordPaymentInput,
  Refund,
  RefundListResult,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from './billing.types';

export interface BillingRepositoryContract {
  searchInvoices(filters?: BillingFilters): Promise<InvoiceListResult>;
  getInvoice(invoiceId: string): Promise<PatientInvoice>;
  createInvoice(input: CreateInvoiceInput): Promise<PatientInvoice>;
  updateInvoice(input: UpdateInvoiceInput): Promise<PatientInvoice>;
  deleteInvoice(invoiceId: string): Promise<boolean>;

  searchClaims(filters?: BillingFilters): Promise<ClaimListResult>;
  getClaim(claimId: string): Promise<InsuranceClaim>;
  submitClaim(input: SubmitClaimInput): Promise<InsuranceClaim>;
  approveClaim(claimId: string, approvedAmount?: number): Promise<InsuranceClaim>;
  denyClaim(claimId: string, reason: string): Promise<InsuranceClaim>;
  resubmitClaim(claimId: string): Promise<InsuranceClaim>;

  recordPayment(input: RecordPaymentInput): Promise<Payment>;
  refundPayment(input: RefundPaymentInput): Promise<Refund>;
  getPayments(filters?: BillingFilters): Promise<PaymentListResult>;
  getReceipts(filters?: BillingFilters): Promise<ReceiptListResult>;
  getRefunds(filters?: BillingFilters): Promise<RefundListResult>;
  getInsurance(patientId?: string): Promise<InsurancePolicy[]>;

  getDashboard(
    patientId?: string,
    providerId?: string,
    facilityId?: string,
  ): Promise<BillingDashboard>;
  getOutstandingBalances(patientId?: string): Promise<OutstandingBalance[]>;
  getPaymentTimeline(invoiceId: string): Promise<PaymentTimelineEntry[]>;
}
