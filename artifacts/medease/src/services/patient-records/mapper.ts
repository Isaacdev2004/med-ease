import type { PatientHealthRecord } from '@/services/patient-records/types';

/** FHIR mapping stubs — prepared for Patient, Observation, Encounter, Condition, etc. */
export function toFhirPatientReference(record: PatientHealthRecord) {
  return {
    resourceType: 'Patient' as const,
    id: record.demographics.id,
    identifier: [{ system: 'urn:medease:mrn', value: record.demographics.mrn }],
    name: [{ text: record.demographics.fullName }],
    gender: record.demographics.gender,
    birthDate: record.demographics.dateOfBirth,
  };
}

export function toFhirObservationSummary(record: PatientHealthRecord) {
  return record.vitals.slice(0, 5).map((v) => ({
    resourceType: 'Observation' as const,
    id: v.id,
    status: 'final' as const,
    effectiveDateTime: v.recordedAt,
    code: { text: 'Vital signs panel' },
  }));
}
