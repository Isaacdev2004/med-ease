export { patientRecordOfflineQueue } from '@/services/patient-records/offline-sync';
export { toFhirObservationSummary, toFhirPatientReference } from '@/services/patient-records/mapper';
export { MOCK_PATIENT_RECORDS, generatePatientRecord, getPatientIdForUser } from '@/services/patient-records/mock-data';
export {
  getPatientRecordBasePath,
  patientRecordService,
} from '@/services/patient-records/patient-record.service';
export { patientRecordRepository } from '@/services/patient-records/repository';
export type {
  Allergy,
  AllergySeverity,
  AllergyType,
  AlertCategory,
  AlertSeverity,
  CarePlan,
  CarePlanStatus,
  ClinicalAlert,
  ClinicalDocument,
  ClinicalNote,
  DocumentType,
  Encounter,
  EncounterType,
  EmergencySummary,
  FamilyHistoryEntry,
  Gender,
  HealthScore,
  Immunization,
  LabFlag,
  LabResult,
  LifestyleProfile,
  MedicalSummary,
  MedicationStatus,
  PatientDemographics,
  PatientHealthRecord,
  PatientMedication,
  PatientRecordFilters,
  PatientRecordSearchResult,
  PatientRecordStats,
  ProcedureRecord,
  RadiologyStudy,
  SocialHistory,
  TimelineCategory,
  TimelineEntry,
  VitalReading,
} from '@/services/patient-records/types';
export { AUTH_USER_PATIENT_MAP } from '@/services/patient-records/types';
