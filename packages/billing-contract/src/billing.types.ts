export type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'written_off';

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'pending'
  | 'approved'
  | 'partially_approved'
  | 'denied'
  | 'appealed'
  | 'resubmitted'
  | 'accepted'
  | 'rejected'
  | 'paid';

export type PaymentMethod =
  | 'cash'
  | 'card'
  | 'bank_transfer'
  | 'insurance'
  | 'wallet'
  | 'stripe'
  | 'paystack'
  | 'flutterwave'
  | 'mobile_money';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type InsurancePolicyStatus =
  'active' | 'inactive' | 'pending' | 'expired';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'NGN' | 'XOF';

export type InvoiceLineCategory =
  | 'consultation'
  | 'laboratory'
  | 'radiology'
  | 'medication'
  | 'monitoring'
  | 'telemedicine'
  | 'procedure'
  | 'other';

export interface InvoiceLineItem {
  id: string;
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: InvoiceLineCategory;
}

export interface PatientInvoice {
  invoiceId: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  encounterId?: string;
  facilityId: string;
  facilityName: string;
  providerId: string;
  providerName: string;
  insuranceId?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  discounts: number;
  tax: number;
  total: number;
  balance: number;
  paidAmount: number;
  currency: Currency;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  lineItems: InvoiceLineItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceClaim {
  claimId: string;
  patientId: string;
  patientName: string;
  invoiceId?: string;
  payer: string;
  policyNumber: string;
  authorizationNumber?: string;
  diagnosisCodes: string[];
  procedureCodes: string[];
  medications: string[];
  laboratoryOrders: string[];
  radiologyOrders: string[];
  totalClaim: number;
  approvedAmount: number;
  deniedAmount: number;
  deductible: number;
  copay: number;
  coinsurance: number;
  currency: Currency;
  status: ClaimStatus;
  submissionDate?: string;
  adjudicationDate?: string;
  denialReason?: string;
  facilityId: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  paymentId: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  paidAt: string;
  facilityId?: string;
  providerId?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  retryCount: number;
  notes?: string;
  createdAt: string;
}

export interface Receipt {
  receiptId: string;
  paymentId: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  currency: Currency;
  issuedAt: string;
  receiptNumber: string;
  paymentMethod: PaymentMethod;
  downloadUrl: string;
}

export interface Refund {
  refundId: string;
  paymentId: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  currency: Currency;
  reason: string;
  status: RefundStatus;
  processedAt?: string;
  createdAt: string;
}

export interface InsurancePolicy {
  policyId: string;
  patientId: string;
  payer: string;
  policyNumber: string;
  groupNumber?: string;
  planType: string;
  coverageStart: string;
  coverageEnd: string;
  deductible: number;
  copay: number;
  coinsurance: number;
  status: InsurancePolicyStatus;
  eligibilityVerified: boolean;
  lastVerifiedAt?: string;
}

export interface BillingDashboard {
  dailyRevenue: number;
  monthlyRevenue: number;
  outstandingBalances: number;
  paidInvoices: number;
  pendingClaims: number;
  deniedClaims: number;
  refunds: number;
  collectionRate: number;
  netRevenue: number;
  grossRevenue: number;
  recentInvoices: PatientInvoice[];
  recentClaims: InsuranceClaim[];
  recentPayments: Payment[];
}

export interface OutstandingBalance {
  patientId: string;
  patientName: string;
  totalOutstanding: number;
  oldestDueDate: string;
  invoiceCount: number;
  currency: Currency;
}

export interface PaymentTimelineEntry {
  id: string;
  type: 'invoice' | 'payment' | 'claim' | 'refund' | 'adjustment';
  date: string;
  title: string;
  description: string;
  amount?: number;
  status?: string;
  invoiceId?: string;
}

export interface BillingFilters {
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
}

export interface CreateInvoiceInput {
  patientId: string;
  patientName: string;
  facilityId: string;
  facilityName: string;
  providerId: string;
  providerName: string;
  lineItems: Omit<InvoiceLineItem, 'id' | 'total'>[];
  insuranceId?: string;
  notes?: string;
  currency?: Currency;
}

export interface UpdateInvoiceInput {
  invoiceId: string;
  lineItems?: Omit<InvoiceLineItem, 'id' | 'total'>[];
  notes?: string;
  status?: InvoiceStatus;
}

export interface SubmitClaimInput {
  patientId: string;
  patientName: string;
  invoiceId?: string;
  payer: string;
  policyNumber: string;
  diagnosisCodes: string[];
  procedureCodes: string[];
  totalClaim: number;
  facilityId: string;
  providerId: string;
  medications?: string[];
  laboratoryOrders?: string[];
  radiologyOrders?: string[];
  deductible?: number;
  copay?: number;
  coinsurance?: number;
  currency?: Currency;
}

export interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  currency?: Currency;
  notes?: string;
  installmentNumber?: number;
  totalInstallments?: number;
}

export interface RefundPaymentInput {
  paymentId: string;
  amount: number;
  reason: string;
}

export interface InvoiceListResult {
  items: PatientInvoice[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClaimListResult {
  items: InsuranceClaim[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaymentListResult {
  items: Payment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReceiptListResult {
  items: Receipt[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RefundListResult {
  items: Refund[];
  total: number;
  page: number;
  pageSize: number;
}
