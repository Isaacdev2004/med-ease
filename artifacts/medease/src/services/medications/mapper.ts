import type {
  MedicationAdministration,
  PatientMedication,
  Prescription,
} from '@/services/medications/types';

export function toFhirMedication(medication: PatientMedication) {
  return {
    resourceType: 'Medication' as const,
    id: medication.id,
    code: { text: medication.name },
    form: { text: medication.route },
    ingredient: [{ itemCodeableConcept: { text: medication.genericName } }],
  };
}

export function toFhirMedicationKnowledge(medication: PatientMedication) {
  return {
    resourceType: 'MedicationKnowledge' as const,
    id: `mk-${medication.id}`,
    code: { text: medication.name },
    status: 'active' as const,
    doseForm: { text: medication.medicationType },
  };
}

export function toFhirMedicationRequest(prescription: Prescription) {
  return {
    resourceType: 'MedicationRequest' as const,
    id: prescription.id,
    status: prescription.status === 'active' ? 'active' : 'completed',
    intent: 'order' as const,
    medicationCodeableConcept: { text: prescription.medication.name },
    subject: { reference: `Patient/${prescription.patientId}` },
    authoredOn: prescription.createdAt,
    requester: { reference: `Practitioner/${prescription.prescribingPhysicianId}` },
    dosageInstruction: [{ text: `${prescription.dose} ${prescription.frequency}` }],
  };
}

export function toFhirMedicationStatement(medication: PatientMedication) {
  return {
    resourceType: 'MedicationStatement' as const,
    id: medication.id,
    status: medication.status === 'active' ? 'active' : 'completed',
    medicationCodeableConcept: { text: medication.name },
    subject: { reference: `Patient/${medication.patientId}` },
    effectivePeriod: { start: medication.startDate, end: medication.endDate },
  };
}

export function toFhirMedicationDispense(prescription: Prescription) {
  return {
    resourceType: 'MedicationDispense' as const,
    id: `disp-${prescription.id}`,
    status: 'completed' as const,
    medicationCodeableConcept: { text: prescription.medication.name },
    subject: { reference: `Patient/${prescription.patientId}` },
    performer: [{ actor: { reference: `Organization/${prescription.dispensingPharmacyId}` } }],
  };
}

export function toFhirMedicationAdministration(record: MedicationAdministration) {
  return {
    resourceType: 'MedicationAdministration' as const,
    id: record.id,
    status: record.status === 'completed' ? 'completed' : 'in-progress',
    medicationCodeableConcept: { text: record.medicationName },
    subject: { reference: `Patient/${record.patientId}` },
    effectiveDateTime: record.administeredAt,
    performer: [{ actor: { reference: `Practitioner/${record.administeredBy}` } }],
    dosage: { text: record.dose },
  };
}

export function toFhirMedicationSchedule(medication: PatientMedication) {
  return {
    resourceType: 'MedicationRequest' as const,
    id: `schedule-${medication.id}`,
    status: medication.status === 'active' ? 'active' : 'completed',
    intent: 'plan' as const,
    medicationCodeableConcept: { text: medication.name },
    subject: { reference: `Patient/${medication.patientId}` },
    dosageInstruction: [{ text: `${medication.dose} ${medication.frequency}` }],
  };
}
