import type { QueryParams } from '@workspace/repository-transport';
import type {
  BillingDashboard,
  BillingFilters,
  ClaimStatus,
  Currency,
  InsuranceClaim,
  InsurancePolicy,
  InsurancePolicyStatus,
  InvoiceLineItem,
  InvoiceStatus,
  OutstandingBalance,
  PatientInvoice,
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentTimelineEntry,
  Receipt,
  Refund,
  RefundStatus,
} from '@/services/billing/types';

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asCurrency(value: unknown): Currency {
  const code = asString(value, 'EUR');
  if (
    code === 'EUR' ||
    code === 'USD' ||
    code === 'GBP' ||
    code === 'NGN' ||
    code === 'XOF'
  ) {
    return code;
  }
  return 'EUR';
}

export function billingFiltersToQuery(
  filters?: BillingFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    providerId: filters.providerId,
    facilityId: filters.facilityId,
    status: filters.status,
    q: filters.q,
    from: filters.from,
    to: filters.to,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function mapLineItem(dto: unknown): InvoiceLineItem {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    description: asString(row.description),
    code: asOptionalString(row.code),
    quantity: asNumber(row.quantity, 1),
    unitPrice: asNumber(row.unitPrice),
    total: asNumber(row.total),
    category: asString(row.category, 'other') as InvoiceLineItem['category'],
  };
}

export function mapPatientInvoice(dto: unknown): PatientInvoice {
  const row = asRecord(dto);
  return {
    invoiceId: asString(row.invoiceId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    appointmentId: asOptionalString(row.appointmentId),
    encounterId: asOptionalString(row.encounterId),
    facilityId: asString(row.facilityId),
    facilityName: asString(row.facilityName),
    providerId: asString(row.providerId),
    providerName: asString(row.providerName),
    insuranceId: asOptionalString(row.insuranceId),
    invoiceNumber: asString(row.invoiceNumber),
    issueDate: asString(row.issueDate),
    dueDate: asString(row.dueDate),
    subtotal: asNumber(row.subtotal),
    discounts: asNumber(row.discounts),
    tax: asNumber(row.tax),
    total: asNumber(row.total),
    balance: asNumber(row.balance),
    paidAmount: asNumber(row.paidAmount),
    currency: asCurrency(row.currency),
    status: asString(row.status, 'draft') as InvoiceStatus,
    paymentMethod: asOptionalString(row.paymentMethod) as
      | PaymentMethod
      | undefined,
    lineItems: Array.isArray(row.lineItems)
      ? row.lineItems.map(mapLineItem)
      : [],
    notes: asOptionalString(row.notes),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapInsuranceClaim(dto: unknown): InsuranceClaim {
  const row = asRecord(dto);
  return {
    claimId: asString(row.claimId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    invoiceId: asOptionalString(row.invoiceId),
    payer: asString(row.payer),
    policyNumber: asString(row.policyNumber),
    authorizationNumber: asOptionalString(row.authorizationNumber),
    diagnosisCodes: asStringArray(row.diagnosisCodes),
    procedureCodes: asStringArray(row.procedureCodes),
    medications: asStringArray(row.medications),
    laboratoryOrders: asStringArray(row.laboratoryOrders),
    radiologyOrders: asStringArray(row.radiologyOrders),
    totalClaim: asNumber(row.totalClaim),
    approvedAmount: asNumber(row.approvedAmount),
    deniedAmount: asNumber(row.deniedAmount),
    deductible: asNumber(row.deductible),
    copay: asNumber(row.copay),
    coinsurance: asNumber(row.coinsurance),
    currency: asCurrency(row.currency),
    status: asString(row.status, 'draft') as ClaimStatus,
    submissionDate: asOptionalString(row.submissionDate),
    adjudicationDate: asOptionalString(row.adjudicationDate),
    denialReason: asOptionalString(row.denialReason),
    facilityId: asString(row.facilityId),
    providerId: asString(row.providerId),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapPayment(dto: unknown): Payment {
  const row = asRecord(dto);
  return {
    paymentId: asString(row.paymentId),
    invoiceId: asString(row.invoiceId),
    patientId: asString(row.patientId),
    amount: asNumber(row.amount),
    currency: asCurrency(row.currency),
    method: asString(row.method, 'card') as PaymentMethod,
    status: asString(row.status, 'pending') as PaymentStatus,
    reference: asString(row.reference),
    paidAt: asString(row.paidAt),
    facilityId: asOptionalString(row.facilityId),
    providerId: asOptionalString(row.providerId),
    installmentNumber:
      typeof row.installmentNumber === 'number'
        ? row.installmentNumber
        : undefined,
    totalInstallments:
      typeof row.totalInstallments === 'number'
        ? row.totalInstallments
        : undefined,
    retryCount: asNumber(row.retryCount),
    notes: asOptionalString(row.notes),
    createdAt: asString(row.createdAt),
  };
}

export function mapReceipt(dto: unknown): Receipt {
  const row = asRecord(dto);
  return {
    receiptId: asString(row.receiptId),
    paymentId: asString(row.paymentId),
    invoiceId: asString(row.invoiceId),
    patientId: asString(row.patientId),
    amount: asNumber(row.amount),
    currency: asCurrency(row.currency),
    issuedAt: asString(row.issuedAt),
    receiptNumber: asString(row.receiptNumber),
    paymentMethod: asString(row.paymentMethod, 'card') as PaymentMethod,
    downloadUrl: asString(row.downloadUrl),
  };
}

export function mapRefund(dto: unknown): Refund {
  const row = asRecord(dto);
  return {
    refundId: asString(row.refundId),
    paymentId: asString(row.paymentId),
    invoiceId: asString(row.invoiceId),
    patientId: asString(row.patientId),
    amount: asNumber(row.amount),
    currency: asCurrency(row.currency),
    reason: asString(row.reason),
    status: asString(row.status, 'pending') as RefundStatus,
    processedAt: asOptionalString(row.processedAt),
    createdAt: asString(row.createdAt),
  };
}

export function mapInsurancePolicy(dto: unknown): InsurancePolicy {
  const row = asRecord(dto);
  return {
    policyId: asString(row.policyId),
    patientId: asString(row.patientId),
    payer: asString(row.payer),
    policyNumber: asString(row.policyNumber),
    groupNumber: asOptionalString(row.groupNumber),
    planType: asString(row.planType),
    coverageStart: asString(row.coverageStart),
    coverageEnd: asString(row.coverageEnd),
    deductible: asNumber(row.deductible),
    copay: asNumber(row.copay),
    coinsurance: asNumber(row.coinsurance),
    status: asString(row.status, 'active') as InsurancePolicyStatus,
    eligibilityVerified: asBoolean(row.eligibilityVerified),
    lastVerifiedAt: asOptionalString(row.lastVerifiedAt),
  };
}

export function mapBillingDashboard(dto: unknown): BillingDashboard {
  const row = asRecord(dto);
  return {
    dailyRevenue: asNumber(row.dailyRevenue),
    monthlyRevenue: asNumber(row.monthlyRevenue),
    outstandingBalances: asNumber(row.outstandingBalances),
    paidInvoices: asNumber(row.paidInvoices),
    pendingClaims: asNumber(row.pendingClaims),
    deniedClaims: asNumber(row.deniedClaims),
    refunds: asNumber(row.refunds),
    collectionRate: asNumber(row.collectionRate),
    netRevenue: asNumber(row.netRevenue),
    grossRevenue: asNumber(row.grossRevenue),
    recentInvoices: Array.isArray(row.recentInvoices)
      ? row.recentInvoices.map(mapPatientInvoice)
      : [],
    recentClaims: Array.isArray(row.recentClaims)
      ? row.recentClaims.map(mapInsuranceClaim)
      : [],
    recentPayments: Array.isArray(row.recentPayments)
      ? row.recentPayments.map(mapPayment)
      : [],
  };
}

export function mapOutstandingBalance(dto: unknown): OutstandingBalance {
  const row = asRecord(dto);
  return {
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    totalOutstanding: asNumber(row.totalOutstanding),
    oldestDueDate: asString(row.oldestDueDate),
    invoiceCount: asNumber(row.invoiceCount),
    currency: asCurrency(row.currency),
  };
}

export function mapPaymentTimelineEntry(dto: unknown): PaymentTimelineEntry {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    invoiceId: asString(row.invoiceId),
    date: asString(row.date),
    type: asString(row.type, 'invoice') as PaymentTimelineEntry['type'],
    title: asString(row.title, asString(row.label)),
    amount: asNumber(row.amount),
    status: asString(row.status),
  };
}

export function mapPaginatedInvoices(
  dto: unknown,
): PaginatedResult<PatientInvoice> {
  const row = asRecord(dto);
  return {
    items: Array.isArray(row.items) ? row.items.map(mapPatientInvoice) : [],
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapPaginatedClaims(
  dto: unknown,
): PaginatedResult<InsuranceClaim> {
  const row = asRecord(dto);
  return {
    items: Array.isArray(row.items) ? row.items.map(mapInsuranceClaim) : [],
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapPaginatedPayments(dto: unknown): PaginatedResult<Payment> {
  const row = asRecord(dto);
  return {
    items: Array.isArray(row.items) ? row.items.map(mapPayment) : [],
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapPaginatedReceipts(dto: unknown): PaginatedResult<Receipt> {
  const row = asRecord(dto);
  return {
    items: Array.isArray(row.items) ? row.items.map(mapReceipt) : [],
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapPaginatedRefunds(dto: unknown): PaginatedResult<Refund> {
  const row = asRecord(dto);
  return {
    items: Array.isArray(row.items) ? row.items.map(mapRefund) : [],
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapInsurancePolicyArray(dto: unknown): InsurancePolicy[] {
  return Array.isArray(dto) ? dto.map(mapInsurancePolicy) : [];
}

export function mapOutstandingBalanceArray(
  dto: unknown,
): OutstandingBalance[] {
  return Array.isArray(dto) ? dto.map(mapOutstandingBalance) : [];
}

export function mapPaymentTimelineArray(dto: unknown): PaymentTimelineEntry[] {
  return Array.isArray(dto) ? dto.map(mapPaymentTimelineEntry) : [];
}
