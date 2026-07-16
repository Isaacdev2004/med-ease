export { createClinicianPatientRecordRoute, createClinicianPatientRecordRoutes, createPatientRecordsRoutes } from '@/features/patient-records/routes';
export { PatientBanner, HealthScoreWidget, HealthStatusBanner } from '@/features/patient-records/components/PatientBanner';
export { PatientRecordsShell } from '@/features/patient-records/components/PatientRecordsShell';
export { RecordSectionContent, AllergiesSection, CarePlansSection, DocumentsSection, EmergencySection, LaboratorySection, MedicationsSection, SummarySection, TimelineSection } from '@/features/patient-records/components/RecordSections';
export { RecordTabs, getSectionFromPath } from '@/features/patient-records/components/RecordTabs';
export { usePatientRecordPermissions } from '@/features/patient-records/hooks/use-patient-record-permissions';
export {
  useEmergencySummary,
  usePatientAllergies,
  usePatientCarePlans,
  usePatientDocuments,
  usePatientEncounters,
  usePatientImmunizations,
  usePatientLabs,
  usePatientMedications,
  usePatientNotes,
  usePatientProcedures,
  usePatientRadiology,
  usePatientRecord,
  usePatientRecordSearch,
  usePatientRecordStats,
  usePatientSummary,
  usePatientTimeline,
  usePatientVitals,
  useResolvedPatientId,
} from '@/features/patient-records/hooks/use-patient-records';
export { usePatientRecordMutations } from '@/features/patient-records/mutations/patient-records.mutations';
export { patientRecordQueries } from '@/features/patient-records/queries/patient-records.queries';
export { default as ClinicianPatientRecordPage } from '@/features/patient-records/pages/ClinicianPatientRecordPage';
export { default as PatientRecordsPage } from '@/features/patient-records/pages/PatientRecordsPage';
