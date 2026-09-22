import type {
  Allergy,
  CarePlan,
  ClinicalAlert,
  ClinicalDocument,
  ClinicalNote,
  Encounter,
  FamilyHistoryEntry,
  Immunization,
  LabResult,
  PatientHealthRecord,
  PatientMedication,
  ProcedureRecord,
  RadiologyStudy,
  TimelineEntry,
  VitalReading,
} from '@/services/patient-records/types';
import { ensureArray } from '@/shared/lib/ensure-array';

/** Guarantee list/object fields exist before PHR UI renders. */
export function normalizePatientHealthRecord(
  record: PatientHealthRecord,
): PatientHealthRecord {
  const summary = record.summary ?? {
    problemList: [],
    chronicDiseases: [],
    currentDiagnoses: [],
    resolvedConditions: [],
    activeTreatments: [],
    clinicalRisks: [],
  };

  const emergencySummary = record.emergencySummary ?? {
    bloodGroup: record.demographics?.bloodGroup ?? 'unknown',
    criticalAllergies: [],
    activeMedications: [],
    chronicConditions: [],
    emergencyContacts: [],
    primaryPhysician: '—',
    lastUpdated: record.updatedAt,
  };

  const demographics = record.demographics ?? {
    id: '',
    mrn: '—',
    fullName: 'Patient',
    gender: 'unknown' as const,
    dateOfBirth: '—',
    bloodGroup: 'unknown',
    address: {
      street: '—',
      city: '—',
      postalCode: '—',
      country: '—',
    },
    language: '—',
    maritalStatus: '—',
    occupation: '—',
    nationality: '—',
    weightKg: 0,
    heightCm: 0,
    bmi: 0,
    smoking: 'never' as const,
    alcohol: 'none' as const,
    primaryPhysician: '—',
    emergencyContacts: [],
    insurance: { provider: '—', policyNumber: '—' },
    nationalId: '—',
  };

  return {
    ...record,
    demographics: {
      ...demographics,
      fullName: demographics.fullName || 'Patient',
      address: {
        street: demographics.address?.street ?? '—',
        city: demographics.address?.city ?? '—',
        postalCode: demographics.address?.postalCode ?? '—',
        country: demographics.address?.country ?? '—',
      },
      insurance: {
        provider: demographics.insurance?.provider ?? '—',
        policyNumber: demographics.insurance?.policyNumber ?? '—',
      },
      emergencyContacts: ensureArray(demographics.emergencyContacts),
    },
    summary: {
      ...summary,
      problemList: ensureArray(summary.problemList),
      chronicDiseases: ensureArray(summary.chronicDiseases),
      currentDiagnoses: ensureArray(summary.currentDiagnoses),
      resolvedConditions: ensureArray(summary.resolvedConditions),
      activeTreatments: ensureArray(summary.activeTreatments),
      clinicalRisks: ensureArray(summary.clinicalRisks),
    },
    allergies: ensureArray<Allergy>(record.allergies),
    vitals: ensureArray<VitalReading>(record.vitals),
    encounters: ensureArray<Encounter>(record.encounters),
    notes: ensureArray<ClinicalNote>(record.notes),
    medications: ensureArray<PatientMedication>(record.medications).map(
      (med) => ({
        ...med,
        prescribedBy: med.prescribedBy ?? '—',
      }),
    ),
    immunizations: ensureArray<Immunization>(record.immunizations),
    labs: ensureArray<LabResult>(record.labs),
    radiology: ensureArray<RadiologyStudy>(record.radiology),
    procedures: ensureArray<ProcedureRecord>(record.procedures),
    carePlans: ensureArray<CarePlan>(record.carePlans).map((plan) => ({
      ...plan,
      goals: ensureArray<string>(plan.goals),
      interventions: ensureArray<string>(plan.interventions),
      assignedClinicians: ensureArray<string>(plan.assignedClinicians),
    })),
    documents: ensureArray<ClinicalDocument>(record.documents),
    timeline: ensureArray<TimelineEntry>(record.timeline),
    alerts: ensureArray<ClinicalAlert>(record.alerts),
    familyHistory: ensureArray<FamilyHistoryEntry>(record.familyHistory),
    emergencySummary: {
      ...emergencySummary,
      criticalAllergies: ensureArray(emergencySummary.criticalAllergies),
      activeMedications: ensureArray(emergencySummary.activeMedications),
      chronicConditions: ensureArray(emergencySummary.chronicConditions),
      emergencyContacts: ensureArray(emergencySummary.emergencyContacts),
    },
    lifestyle: record.lifestyle ?? {
      diet: '—',
      exercise: '—',
      sleepHours: 0,
      stressLevel: 'moderate',
    },
    socialHistory: record.socialHistory ?? {
      livingSituation: '—',
      supportNetwork: '—',
      employment: record.demographics?.occupation ?? '—',
    },
    healthScore: record.healthScore ?? {
      overall: 0,
      vitals: 0,
      labs: 0,
      medications: 0,
      carePlans: 0,
      trend: 'stable',
    },
  };
}
