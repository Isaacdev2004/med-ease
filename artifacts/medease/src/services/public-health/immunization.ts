import type { ImmunizationRecord } from '@/services/public-health/types';

export const VACCINES = ['MMR', 'DTaP', 'HPV', 'Influenza', 'COVID-19', 'Hepatitis B', 'Varicella', 'Polio', 'Tdap', 'Pneumococcal'];

export function isOverdue(record: ImmunizationRecord): boolean {
  return record.status === 'overdue' || (record.dueDate ? new Date(record.dueDate) < new Date() : false);
}

export function forecastNextDose(record: ImmunizationRecord): string | undefined {
  if (record.status !== 'administered') return record.dueDate;
  const next = new Date(record.administeredAt ?? Date.now());
  next.setMonth(next.getMonth() + 6);
  return next.toISOString();
}

export function toFhirImmunization(record: ImmunizationRecord) {
  return {
    resourceType: 'Immunization',
    id: record.immunizationId,
    status: record.status === 'administered' ? 'completed' : 'not-done',
    vaccineCode: { coding: [{ code: record.cvxCode, display: record.vaccine }] },
    patient: { reference: `Patient/${record.patientId}` },
    occurrenceDateTime: record.administeredAt,
  };
}
