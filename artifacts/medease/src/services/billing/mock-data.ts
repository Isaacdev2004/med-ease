import type {
  InsuranceClaim,
  InsurancePolicy,
  InvoiceLineItem,
  OutstandingBalance,
  PatientInvoice,
  Payment,
  Receipt,
  Refund,
} from '@/services/billing/types';
import {
  AUTH_USER_PATIENT_MAP,
  BILLING_PATIENT_IDS,
} from '@/services/billing/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => ({
  id: `fac-${String(i + 1).padStart(3, '0')}`,
  name: `Med-ease Facility ${i + 1}`,
}));

const PROVIDERS = Array.from({ length: 100 }, (_, i) => ({
  id: `prov-${String(i + 1).padStart(3, '0')}`,
  name: `Dr. Provider ${i + 1}`,
}));

const PAYERS = [
  'AXA Santé',
  'Allianz Care',
  'CNAM',
  'Mutuelle Générale',
  'BlueCross',
  'Self-Pay',
];
const PATIENT_NAMES = [
  'Sarah Jenkins',
  'Jean Dupont',
  'Marie Laurent',
  'Pierre Martin',
  'Sophie Bernard',
];
const CATEGORIES: InvoiceLineItem['category'][] = [
  'consultation',
  'laboratory',
  'radiology',
  'medication',
  'monitoring',
  'telemedicine',
  'procedure',
];
const INVOICE_STATUSES: PatientInvoice['status'][] = [
  'draft',
  'issued',
  'partial',
  'paid',
  'overdue',
  'cancelled',
];
const CLAIM_STATUSES: InsuranceClaim['status'][] = [
  'draft',
  'submitted',
  'pending',
  'approved',
  'partially_approved',
  'denied',
  'appealed',
  'resubmitted',
  'paid',
];
const PAYMENT_METHODS: Payment['method'][] = [
  'cash',
  'card',
  'bank_transfer',
  'insurance',
  'stripe',
  'paystack',
  'flutterwave',
  'mobile_money',
];
const PAYMENT_STATUSES: Payment['status'][] = [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function patientName(id: string) {
  const idx = parseInt(id.replace('phr-', ''), 10) - 1;
  return PATIENT_NAMES[idx % PATIENT_NAMES.length] ?? `Patient ${id}`;
}

function lineItems(i: number): InvoiceLineItem[] {
  const count = 1 + (i % 4);
  return Array.from({ length: count }, (_, j) => {
    const qty = 1 + (j % 3);
    const unit = 25 + (((i + j) * 17) % 500);
    return {
      id: `li-${i}-${j}`,
      description: `${CATEGORIES[(i + j) % CATEGORIES.length]!.replace('_', ' ')} service`,
      code: `CPT-${1000 + ((i + j) % 900)}`,
      quantity: qty,
      unitPrice: unit,
      total: qty * unit,
      category: CATEGORIES[(i + j) % CATEGORIES.length]!,
    };
  });
}

export const MOCK_INVOICES: PatientInvoice[] = Array.from(
  { length: 5000 },
  (_, i) => {
    const patientId = BILLING_PATIENT_IDS[i % 40]!;
    const facility = FACILITIES[i % 25]!;
    const provider = PROVIDERS[i % 100]!;
    const items = lineItems(i);
    const subtotal = items.reduce((s, li) => s + li.total, 0);
    const discounts = i % 7 === 0 ? Math.round(subtotal * 0.05) : 0;
    const tax = Math.round((subtotal - discounts) * 0.1);
    const total = subtotal - discounts + tax;
    const status = INVOICE_STATUSES[i % INVOICE_STATUSES.length]!;
    const paidAmount =
      status === 'paid'
        ? total
        : status === 'partial'
          ? Math.round(total * 0.5)
          : 0;
    const balance = total - paidAmount;
    const issueDate = daysAgo(i % 365);
    return {
      invoiceId: `inv-${String(i + 1).padStart(5, '0')}`,
      patientId,
      patientName: patientName(patientId),
      appointmentId: i % 3 === 0 ? `apt-${1000 + i}` : undefined,
      encounterId: i % 4 === 0 ? `enc-${i + 1}` : undefined,
      facilityId: facility.id,
      facilityName: facility.name,
      providerId: provider.id,
      providerName: provider.name,
      insuranceId: i % 5 !== 0 ? `pol-${(i % 400) + 1}` : undefined,
      invoiceNumber: `INV-${2024000 + i}`,
      issueDate,
      dueDate: daysFromNow(30 - (i % 30)),
      subtotal,
      discounts,
      tax,
      total,
      balance,
      paidAmount,
      currency: 'EUR',
      status,
      paymentMethod:
        paidAmount > 0
          ? PAYMENT_METHODS[i % PAYMENT_METHODS.length]
          : undefined,
      lineItems: items,
      notes: i % 10 === 0 ? 'Insurance pending verification' : undefined,
      createdAt: issueDate,
      updatedAt: daysAgo(i % 30),
    };
  },
);

export const MOCK_CLAIMS: InsuranceClaim[] = Array.from(
  { length: 3500 },
  (_, i) => {
    const patientId = BILLING_PATIENT_IDS[i % 40]!;
    const invoice = MOCK_INVOICES[i % MOCK_INVOICES.length]!;
    const status = CLAIM_STATUSES[i % CLAIM_STATUSES.length]!;
    const totalClaim = 200 + ((i * 37) % 5000);
    const approvedAmount =
      status === 'approved' || status === 'paid'
        ? totalClaim
        : status === 'partially_approved'
          ? Math.round(totalClaim * 0.7)
          : status === 'denied'
            ? 0
            : Math.round(totalClaim * 0.3);
    const deniedAmount = totalClaim - approvedAmount;
    return {
      claimId: `clm-${String(i + 1).padStart(5, '0')}`,
      patientId,
      patientName: patientName(patientId),
      invoiceId: invoice.invoiceId,
      payer: PAYERS[i % PAYERS.length]!,
      policyNumber: `POL-${100000 + (i % 99999)}`,
      authorizationNumber: i % 4 === 0 ? `AUTH-${5000 + i}` : undefined,
      diagnosisCodes: [`ICD10-J${(i % 90) + 10}`, `ICD10-E${(i % 50) + 10}`],
      procedureCodes: [`CPT-${7000 + (i % 500)}`, `CPT-${8000 + (i % 300)}`],
      medications: i % 3 === 0 ? [`RX-${i}`] : [],
      laboratoryOrders: i % 5 === 0 ? [`LAB-${i}`] : [],
      radiologyOrders: i % 6 === 0 ? [`RAD-${i}`] : [],
      totalClaim,
      approvedAmount,
      deniedAmount,
      deductible: 50 + (i % 200),
      copay: 10 + (i % 50),
      coinsurance: 10 + (i % 20),
      currency: 'EUR',
      status,
      submissionDate: status !== 'draft' ? daysAgo(i % 90) : undefined,
      adjudicationDate: [
        'approved',
        'partially_approved',
        'denied',
        'paid',
      ].includes(status)
        ? daysAgo(i % 60)
        : undefined,
      denialReason:
        status === 'denied' ? 'Service not covered under plan' : undefined,
      facilityId: invoice.facilityId,
      providerId: invoice.providerId,
      createdAt: daysAgo(i % 120),
      updatedAt: daysAgo(i % 30),
    };
  },
);

export const MOCK_PAYMENTS: Payment[] = Array.from({ length: 6000 }, (_, i) => {
  const invoice = MOCK_INVOICES[i % MOCK_INVOICES.length]!;
  const status = PAYMENT_STATUSES[i % PAYMENT_STATUSES.length]!;
  const amount =
    status === 'completed'
      ? Math.min(invoice.total, 50 + ((i * 23) % invoice.total))
      : 0;
  return {
    paymentId: `pay-${String(i + 1).padStart(5, '0')}`,
    invoiceId: invoice.invoiceId,
    patientId: invoice.patientId,
    amount: amount || Math.round(invoice.total * 0.3),
    currency: invoice.currency,
    method: PAYMENT_METHODS[i % PAYMENT_METHODS.length]!,
    status,
    reference: `REF-${100000 + i}`,
    paidAt: daysAgo(i % 180),
    facilityId: invoice.facilityId,
    providerId: invoice.providerId,
    installmentNumber: i % 6 === 0 ? (i % 3) + 1 : undefined,
    totalInstallments: i % 6 === 0 ? 3 : undefined,
    retryCount: status === 'failed' ? 1 + (i % 3) : 0,
    createdAt: daysAgo(i % 180),
  };
});

export const MOCK_REFUNDS: Refund[] = Array.from({ length: 500 }, (_, i) => {
  const payment = MOCK_PAYMENTS[i * 12]!;
  return {
    refundId: `rfd-${String(i + 1).padStart(4, '0')}`,
    paymentId: payment.paymentId,
    invoiceId: payment.invoiceId,
    patientId: payment.patientId,
    amount: Math.round(payment.amount * 0.5),
    currency: payment.currency,
    reason:
      i % 3 === 0
        ? 'Duplicate payment'
        : i % 3 === 1
          ? 'Service cancelled'
          : 'Billing error',
    status: i % 5 === 0 ? 'pending' : 'completed',
    processedAt: i % 5 !== 0 ? daysAgo(i % 30) : undefined,
    createdAt: daysAgo(i % 60),
  };
});

export const MOCK_POLICIES: InsurancePolicy[] = Array.from(
  { length: 400 },
  (_, i) => {
    const patientId = BILLING_PATIENT_IDS[i % 40]!;
    return {
      policyId: `pol-${i + 1}`,
      patientId,
      payer: PAYERS[i % PAYERS.length]!,
      policyNumber: `POL-${100000 + i}`,
      groupNumber: i % 4 === 0 ? `GRP-${500 + i}` : undefined,
      planType: i % 2 === 0 ? 'PPO' : 'HMO',
      coverageStart: daysAgo(365 + (i % 365)),
      coverageEnd: daysFromNow(365 - (i % 100)),
      deductible: 250 + (i % 500),
      copay: 15 + (i % 35),
      coinsurance: 10 + (i % 30),
      status: i % 10 === 0 ? 'expired' : i % 15 === 0 ? 'pending' : 'active',
      eligibilityVerified: i % 8 !== 0,
      lastVerifiedAt: i % 8 !== 0 ? daysAgo(i % 14) : undefined,
    };
  },
);

export const MOCK_RECEIPTS: Receipt[] = MOCK_PAYMENTS.filter(
  (p) => p.status === 'completed',
)
  .slice(0, 3000)
  .map((p, i) => ({
    receiptId: `rcp-${String(i + 1).padStart(5, '0')}`,
    paymentId: p.paymentId,
    invoiceId: p.invoiceId,
    patientId: p.patientId,
    amount: p.amount,
    currency: p.currency,
    issuedAt: p.paidAt,
    receiptNumber: `RCP-${2024000 + i}`,
    paymentMethod: p.method,
    downloadUrl: `/mock/receipts/rcp-${i + 1}.pdf`,
  }));

export function getPatientIdForUser(userId: string) {
  return AUTH_USER_PATIENT_MAP[userId] ?? BILLING_PATIENT_IDS[0]!;
}

export function buildDashboard(
  patientId?: string,
  providerId?: string,
  facilityId?: string,
) {
  let invoices = MOCK_INVOICES;
  let claims = MOCK_CLAIMS;
  let payments = MOCK_PAYMENTS;
  if (patientId) {
    invoices = invoices.filter((i) => i.patientId === patientId);
    claims = claims.filter((c) => c.patientId === patientId);
    payments = payments.filter((p) => p.patientId === patientId);
  }
  if (providerId) {
    invoices = invoices.filter((i) => i.providerId === providerId);
    claims = claims.filter((c) => c.providerId === providerId);
  }
  if (facilityId) {
    invoices = invoices.filter((i) => i.facilityId === facilityId);
    claims = claims.filter((c) => c.facilityId === facilityId);
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const dailyPayments = payments.filter(
    (p) => p.status === 'completed' && p.paidAt.slice(0, 10) === today,
  );
  const monthlyPayments = payments.filter(
    (p) => p.status === 'completed' && p.paidAt >= monthStart,
  );
  const dailyRevenue = dailyPayments.reduce((s, p) => s + p.amount, 0);
  const monthlyRevenue = monthlyPayments.reduce((s, p) => s + p.amount, 0);
  const outstandingBalances = invoices.reduce((s, i) => s + i.balance, 0);
  const paidInvoices = invoices.filter((i) => i.status === 'paid').length;
  const pendingClaims = claims.filter((c) =>
    ['submitted', 'pending', 'resubmitted'].includes(c.status),
  ).length;
  const deniedClaims = claims.filter((c) => c.status === 'denied').length;
  const refunds = MOCK_REFUNDS.filter(
    (r) =>
      r.status === 'completed' &&
      (!patientId || invoices.some((i) => i.patientId === patientId)),
  ).length;
  const grossRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const collected = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const collectionRate =
    grossRevenue > 0 ? Math.round((collected / grossRevenue) * 100) : 0;
  const netRevenue =
    collected -
    MOCK_REFUNDS.filter((r) => r.status === 'completed').reduce(
      (s, r) => s + r.amount,
      0,
    ) /
      50;

  return {
    dailyRevenue,
    monthlyRevenue,
    outstandingBalances,
    paidInvoices,
    pendingClaims,
    deniedClaims,
    refunds,
    collectionRate,
    netRevenue: Math.round(netRevenue),
    grossRevenue: Math.round(grossRevenue / Math.max(invoices.length, 1)),
    recentInvoices: invoices.slice(0, 8),
    recentClaims: claims.slice(0, 6),
    recentPayments: payments
      .filter((p) => p.status === 'completed')
      .slice(0, 6),
  };
}

export function buildPaymentTimeline(invoiceId: string) {
  const invoice = MOCK_INVOICES.find((i) => i.invoiceId === invoiceId);
  if (!invoice) return [];
  const payments = MOCK_PAYMENTS.filter((p) => p.invoiceId === invoiceId);
  const claims = MOCK_CLAIMS.filter((c) => c.invoiceId === invoiceId);
  const refunds = MOCK_REFUNDS.filter((r) => r.invoiceId === invoiceId);
  return [
    {
      id: `${invoiceId}-inv`,
      invoiceId,
      date: invoice.issueDate,
      type: 'invoice' as const,
      title: 'Invoice issued',
      amount: invoice.total,
      status: invoice.status,
    },
    ...payments.map((p) => ({
      id: p.paymentId,
      invoiceId,
      date: p.paidAt,
      type: 'payment' as const,
      title: `Payment via ${p.method}`,
      amount: p.amount,
      status: p.status,
    })),
    ...claims.map((c) => ({
      id: c.claimId,
      invoiceId,
      date: c.submissionDate ?? c.createdAt,
      type: 'claim' as const,
      title: `Claim to ${c.payer}`,
      amount: c.totalClaim,
      status: c.status,
    })),
    ...refunds.map((r) => ({
      id: r.refundId,
      invoiceId,
      date: r.processedAt ?? r.createdAt,
      type: 'refund' as const,
      title: 'Refund processed',
      amount: -r.amount,
      status: r.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function buildOutstandingBalances() {
  const map = new Map<string, OutstandingBalance>();
  for (const inv of MOCK_INVOICES.filter((i) => i.balance > 0)) {
    const existing = map.get(inv.patientId);
    if (existing) {
      existing.totalOutstanding += inv.balance;
      existing.invoiceCount += 1;
      if (inv.dueDate < existing.oldestDueDate)
        existing.oldestDueDate = inv.dueDate;
    } else {
      map.set(inv.patientId, {
        patientId: inv.patientId,
        patientName: inv.patientName,
        totalOutstanding: inv.balance,
        oldestDueDate: inv.dueDate,
        invoiceCount: 1,
        currency: inv.currency,
      });
    }
  }
  return [...map.values()].sort(
    (a, b) => b.totalOutstanding - a.totalOutstanding,
  );
}
