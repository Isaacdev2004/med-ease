import type { RefillRequest, RefillRequestInput } from '@/services/medications/types';
import { PHARMACIES } from '@/services/medications/mock-data';

export function computeExpectedRefillDate(daysLeft: number): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.max(daysLeft, 1));
  return d.toISOString();
}

export function buildRefillRequest(
  input: RefillRequestInput,
  medicationName: string,
  patientName: string,
  remainingTablets?: number,
): RefillRequest {
  const pharmacy = PHARMACIES.find((p) => p.id === input.pharmacyId) ?? PHARMACIES[0]!;
  const daysLeft = remainingTablets ? Math.ceil(remainingTablets / 2) : 5;
  return {
    id: `refill-${Date.now()}`,
    prescriptionId: input.prescriptionId,
    medicationId: input.prescriptionId,
    patientId: input.patientId,
    patientName,
    medicationName,
    pharmacyId: pharmacy.id,
    pharmacyName: pharmacy.name,
    status: 'pending',
    remainingTablets,
    daysLeft,
    requestedAt: new Date().toISOString(),
    expectedDate: computeExpectedRefillDate(daysLeft),
    insuranceApprovalPlaceholder: 'Pending insurer review',
    autoRefill: input.autoRefill ?? false,
  };
}
