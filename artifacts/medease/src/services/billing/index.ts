export { billingService } from '@/services/billing/billing.service';
export { billingRepository } from '@/services/billing/repository';
export { billingOfflineQueue } from '@/services/billing/offline-sync';
export { computeRevenueAnalytics } from '@/services/billing/analytics';
export { getPaymentAdapter, processPayment } from '@/services/billing/payments';
export { verifyEligibility, checkPreauthorization } from '@/services/billing/insurance';
export {
  toFhirClaim,
  toFhirCoverage,
  toFhirInvoice,
  toFhirPaymentNotice,
  toFhirPaymentReconciliation,
  toFhirExplanationOfBenefit,
} from '@/services/billing/mapper';
export {
  buildDashboard,
  buildPaymentTimeline,
  buildOutstandingBalances,
  getPatientIdForUser,
  MOCK_INVOICES,
  MOCK_CLAIMS,
  MOCK_PAYMENTS,
  MOCK_RECEIPTS,
  MOCK_REFUNDS,
  MOCK_POLICIES,
} from '@/services/billing/mock-data';
export type {
  PatientInvoice,
  InsuranceClaim,
  Payment,
  Receipt,
  Refund,
  InsurancePolicy,
  BillingDashboard,
  RevenueAnalytics,
  OutstandingBalance,
  BillingFilters,
  CreateInvoiceInput,
  RecordPaymentInput,
  BillingPermissions,
  PaymentTimelineEntry,
} from '@/services/billing/types';
export { AUTH_USER_PATIENT_MAP, BILLING_PATIENT_IDS } from '@/services/billing/types';
