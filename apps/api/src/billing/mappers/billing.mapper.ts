import type {
  ClaimStatus,
  Currency,
  InsuranceClaim,
  InsurancePolicy,
  InsurancePolicyStatus,
  InvoiceLineCategory,
  InvoiceLineItem,
  InvoiceStatus,
  PatientInvoice,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Receipt,
  Refund,
  RefundStatus,
} from '@medease/billing-contract';
import type { Prisma } from '@medease/prisma';

export function toCents(amount: number): bigint {
  return BigInt(Math.round(amount * 100));
}

export function fromCents(cents: bigint | number): number {
  return Number(cents) / 100;
}

export function asCurrency(code: string): Currency {
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

export function mapInvoiceStatus(status: string): InvoiceStatus {
  switch (status) {
    case 'draft':
    case 'issued':
    case 'partial':
    case 'paid':
    case 'overdue':
    case 'cancelled':
    case 'written_off':
      return status;
    default:
      return 'draft';
  }
}

export function mapClaimStatus(status: string): ClaimStatus {
  switch (status) {
    case 'draft':
    case 'submitted':
    case 'pending':
    case 'approved':
    case 'partially_approved':
    case 'denied':
    case 'appealed':
    case 'resubmitted':
    case 'accepted':
    case 'rejected':
    case 'paid':
      return status;
    default:
      return 'draft';
  }
}

export function mapPaymentMethod(method: string): PaymentMethod {
  switch (method) {
    case 'cash':
    case 'card':
    case 'bank_transfer':
    case 'insurance':
    case 'wallet':
    case 'stripe':
    case 'paystack':
    case 'flutterwave':
    case 'mobile_money':
      return method;
    default:
      return 'card';
  }
}

export function mapPaymentStatus(status: string): PaymentStatus {
  switch (status) {
    case 'pending':
    case 'processing':
    case 'completed':
    case 'failed':
    case 'refunded':
    case 'partially_refunded':
      return status;
    default:
      return 'pending';
  }
}

export function mapRefundStatus(status: string): RefundStatus {
  switch (status) {
    case 'pending':
    case 'processing':
    case 'completed':
    case 'failed':
      return status;
    default:
      return 'pending';
  }
}

export function mapLineCategory(category: string): InvoiceLineCategory {
  switch (category) {
    case 'consultation':
    case 'laboratory':
    case 'radiology':
    case 'medication':
    case 'monitoring':
    case 'telemedicine':
    case 'procedure':
    case 'other':
      return category;
    default:
      return 'other';
  }
}

type LineItemRow = Prisma.InvoiceLineItemGetPayload<object>;
type InvoiceRow = Prisma.PatientInvoiceGetPayload<{
  include: { lineItems: true };
}>;
type InvoiceBase = Prisma.PatientInvoiceGetPayload<object>;
type ClaimRow = Prisma.InsuranceClaimGetPayload<object>;
type PaymentRow = Prisma.PaymentGetPayload<object>;
type ReceiptRow = Prisma.ReceiptGetPayload<object>;
type RefundRow = Prisma.RefundGetPayload<object>;
type PolicyRow = Prisma.InsurancePolicyGetPayload<object>;

export function mapLineItem(row: LineItemRow): InvoiceLineItem {
  return {
    id: row.id,
    description: row.description,
    code: row.code ?? undefined,
    quantity: Number(row.quantity),
    unitPrice: fromCents(row.unitPriceCents),
    total: fromCents(row.amountCents),
    category: mapLineCategory(row.category),
  };
}

function mapInvoiceBase(row: InvoiceBase, lineItems: InvoiceLineItem[]): PatientInvoice {
  return {
    invoiceId: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    appointmentId: row.appointmentId ?? undefined,
    encounterId: row.encounterId ?? undefined,
    facilityId: row.facilityId,
    facilityName: row.facilityName,
    providerId: row.providerId,
    providerName: row.providerName,
    insuranceId: row.insurancePolicyId ?? undefined,
    invoiceNumber: row.invoiceNumber,
    issueDate: (row.issuedAt ?? row.createdAt).toISOString(),
    dueDate: (row.dueAt ?? row.createdAt).toISOString(),
    subtotal: fromCents(row.subtotalCents),
    discounts: fromCents(row.discountCents),
    tax: fromCents(row.taxCents),
    total: fromCents(row.totalCents),
    balance: fromCents(row.balanceCents),
    paidAmount: fromCents(row.paidCents),
    currency: asCurrency(row.currencyCode),
    status: mapInvoiceStatus(row.status),
    paymentMethod: row.paymentMethod
      ? mapPaymentMethod(row.paymentMethod)
      : undefined,
    lineItems,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapInvoice(row: InvoiceRow): PatientInvoice {
  return mapInvoiceBase(
    row,
    row.lineItems
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapLineItem),
  );
}

export function mapInvoiceWithoutLines(row: InvoiceBase): PatientInvoice {
  return mapInvoiceBase(row, []);
}

export function mapClaim(row: ClaimRow): InsuranceClaim {
  return {
    claimId: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    invoiceId: row.invoiceId ?? undefined,
    payer: row.payer,
    policyNumber: row.policyNumber,
    authorizationNumber: row.authorizationNumber ?? undefined,
    diagnosisCodes: row.diagnosisCodes,
    procedureCodes: row.procedureCodes,
    medications: row.medications,
    laboratoryOrders: row.laboratoryOrders,
    radiologyOrders: row.radiologyOrders,
    totalClaim: fromCents(row.totalClaimCents),
    approvedAmount: fromCents(row.approvedCents),
    deniedAmount: fromCents(row.deniedCents),
    deductible: fromCents(row.deductibleCents),
    copay: fromCents(row.copayCents),
    coinsurance: fromCents(row.coinsuranceCents),
    currency: asCurrency(row.currencyCode),
    status: mapClaimStatus(row.status),
    submissionDate: row.submissionDate?.toISOString(),
    adjudicationDate: row.adjudicationDate?.toISOString(),
    denialReason: row.denialReason ?? undefined,
    facilityId: row.facilityId,
    providerId: row.providerId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapPayment(row: PaymentRow): Payment {
  return {
    paymentId: row.id,
    invoiceId: row.invoiceId,
    patientId: row.patientId,
    amount: fromCents(row.amountCents),
    currency: asCurrency(row.currencyCode),
    method: mapPaymentMethod(row.method),
    status: mapPaymentStatus(row.status),
    reference: row.reference,
    paidAt: row.paidAt.toISOString(),
    facilityId: row.facilityId ?? undefined,
    providerId: row.providerId ?? undefined,
    installmentNumber: row.installmentNumber ?? undefined,
    totalInstallments: row.totalInstallments ?? undefined,
    retryCount: row.retryCount,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapReceipt(row: ReceiptRow): Receipt {
  return {
    receiptId: row.id,
    paymentId: row.paymentId,
    invoiceId: row.invoiceId,
    patientId: row.patientId,
    amount: fromCents(row.amountCents),
    currency: asCurrency(row.currencyCode),
    issuedAt: row.issuedAt.toISOString(),
    receiptNumber: row.receiptNumber,
    paymentMethod: mapPaymentMethod(row.paymentMethod),
    downloadUrl: row.downloadUrl,
  };
}

export function mapRefund(row: RefundRow): Refund {
  return {
    refundId: row.id,
    paymentId: row.paymentId,
    invoiceId: row.invoiceId,
    patientId: row.patientId,
    amount: fromCents(row.amountCents),
    currency: asCurrency(row.currencyCode),
    reason: row.reason,
    status: mapRefundStatus(row.status),
    processedAt: row.processedAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapPolicy(row: PolicyRow): InsurancePolicy {
  return {
    policyId: row.id,
    patientId: row.patientId,
    payer: row.payer,
    policyNumber: row.policyNumber,
    groupNumber: row.groupNumber ?? undefined,
    planType: row.planType,
    coverageStart: row.coverageStart.toISOString(),
    coverageEnd: row.coverageEnd.toISOString(),
    deductible: fromCents(row.deductibleCents),
    copay: fromCents(row.copayCents),
    coinsurance: row.coinsurancePercent,
    status: row.status as InsurancePolicyStatus,
    eligibilityVerified: row.eligibilityVerified,
    lastVerifiedAt: row.lastVerifiedAt?.toISOString(),
  };
}
