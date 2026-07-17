import {
  verifyEligibility,
  checkPreauthorization,
} from '@/services/billing/claims';
import type { InsurancePolicy } from '@/services/billing/types';

export { verifyEligibility, checkPreauthorization };

export function getCoverageSummary(policy: InsurancePolicy) {
  return {
    policyId: policy.policyId,
    payer: policy.payer,
    planType: policy.planType,
    deductible: policy.deductible,
    copay: policy.copay,
    coinsurance: policy.coinsurance,
    status: policy.status,
    eligible: policy.status === 'active' && policy.eligibilityVerified,
  };
}

export function estimatePatientResponsibility(
  total: number,
  policy: InsurancePolicy,
) {
  const covered = total * (1 - policy.coinsurance / 100);
  return {
    total,
    covered: Math.round(covered),
    patientOwes: Math.round(total - covered + policy.copay),
  };
}
