import type { InsuranceClaim, SubmitClaimInput } from '@/services/billing/types';

export function validateClaim(input: SubmitClaimInput): string[] {
  const errors: string[] = [];
  if (!input.diagnosisCodes.length) errors.push('At least one diagnosis code required');
  if (!input.procedureCodes.length) errors.push('At least one procedure code required');
  if (input.totalClaim <= 0) errors.push('Claim amount must be positive');
  return errors;
}

export function submitClaim(input: SubmitClaimInput, claimId: string, patientName: string): InsuranceClaim {
  const now = new Date().toISOString();
  return {
    claimId,
    patientId: input.patientId,
    patientName,
    invoiceId: input.invoiceId,
    payer: input.payer,
    policyNumber: input.policyNumber,
    diagnosisCodes: input.diagnosisCodes,
    procedureCodes: input.procedureCodes,
    medications: [],
    laboratoryOrders: [],
    radiologyOrders: [],
    totalClaim: input.totalClaim,
    approvedAmount: 0,
    deniedAmount: 0,
    deductible: 0,
    copay: 0,
    coinsurance: 0,
    currency: 'EUR',
    status: 'submitted',
    submissionDate: now,
    facilityId: input.facilityId,
    providerId: input.providerId,
    createdAt: now,
    updatedAt: now,
  };
}

export function approveClaim(claim: InsuranceClaim, approvedAmount: number): InsuranceClaim {
  return {
    ...claim,
    status: approvedAmount >= claim.totalClaim ? 'approved' : 'partially_approved',
    approvedAmount,
    deniedAmount: claim.totalClaim - approvedAmount,
    adjudicationDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function denyClaim(claim: InsuranceClaim, reason: string): InsuranceClaim {
  return {
    ...claim,
    status: 'denied',
    approvedAmount: 0,
    deniedAmount: claim.totalClaim,
    denialReason: reason,
    adjudicationDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function resubmitClaim(claim: InsuranceClaim): InsuranceClaim {
  return {
    ...claim,
    status: 'resubmitted',
    submissionDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function verifyEligibility(policyNumber: string) {
  return { eligible: true, policyNumber, verifiedAt: new Date().toISOString(), copay: 25, deductibleRemaining: 500 };
}

export function checkPreauthorization(procedureCode: string) {
  return { required: procedureCode.startsWith('CPT-8'), authorizationNumber: procedureCode.startsWith('CPT-8') ? `AUTH-${Date.now()}` : undefined };
}
