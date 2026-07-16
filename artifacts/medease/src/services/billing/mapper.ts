import type { InsuranceClaim, PatientInvoice, Payment } from '@/services/billing/types';

/** FHIR R4 adapter stubs — swap repository layer for production. */
export function toFhirClaim(claim: InsuranceClaim) {
  return {
    resourceType: 'Claim',
    id: claim.claimId,
    status: claim.status,
    patient: { reference: `Patient/${claim.patientId}` },
    provider: { reference: `Practitioner/${claim.providerId}` },
    insurer: { display: claim.payer },
    created: claim.createdAt,
    total: { value: claim.totalClaim, currency: claim.currency },
  };
}

export function toFhirCoverage(policyId: string, patientId: string, payer: string) {
  return { resourceType: 'Coverage', id: policyId, beneficiary: { reference: `Patient/${patientId}` }, payor: [{ display: payer }] };
}

export function toFhirInvoice(invoice: PatientInvoice) {
  return {
    resourceType: 'Invoice',
    id: invoice.invoiceId,
    status: invoice.status,
    subject: { reference: `Patient/${invoice.patientId}` },
    date: invoice.issueDate,
    totalNet: { value: invoice.total, currency: invoice.currency },
  };
}

export function toFhirPaymentNotice(payment: Payment) {
  return {
    resourceType: 'PaymentNotice',
    id: payment.paymentId,
    status: payment.status,
    amount: { value: payment.amount, currency: payment.currency },
    paymentDate: payment.paidAt,
  };
}

export function toFhirPaymentReconciliation(paymentId: string, amount: number) {
  return { resourceType: 'PaymentReconciliation', paymentIdentifier: paymentId, paymentAmount: { value: amount } };
}

export function toFhirExplanationOfBenefit(claim: InsuranceClaim) {
  return {
    resourceType: 'ExplanationOfBenefit',
    id: `eob-${claim.claimId}`,
    claim: [{ reference: `Claim/${claim.claimId}` }],
    total: [{ amount: { value: claim.approvedAmount, currency: claim.currency } }],
  };
}
