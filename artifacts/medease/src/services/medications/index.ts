export { medicationService } from '@/services/medications/medication.service';
export { medicationOfflineQueue } from '@/services/medications/offline-sync';
export { computeAdherence } from '@/services/medications/adherence';
export {
  checkMedicationInteractions,
  getInteractionSeverityColor,
} from '@/services/medications/interaction-engine';
export {
  buildRefillRequest,
  computeExpectedRefillDate,
} from '@/services/medications/refill';
export {
  buildDoseReminders,
  buildRefillReminder,
} from '@/services/medications/reminders';
export {
  buildMedicationCalendar,
  getTodayDoses,
  getUpcomingDoses,
  calendarLabel,
} from '@/services/medications/scheduler';
export { computeMedicationAnalytics } from '@/services/medications/analytics';
export {
  toFhirMedication,
  toFhirMedicationKnowledge,
  toFhirMedicationRequest,
  toFhirMedicationStatement,
  toFhirMedicationDispense,
  toFhirMedicationAdministration,
  toFhirMedicationSchedule,
} from '@/services/medications/mapper';
export { medicationRepository } from '@/services/medications/repository';
export { buildTimeline } from '@/services/medications/timeline';
export {
  MOCK_MEDICATIONS,
  MOCK_PRESCRIPTIONS,
  MOCK_SCHEDULE,
  MOCK_REFILL_REQUESTS,
  MOCK_INTERACTIONS,
  MOCK_PHARMACY_QUEUE,
  MOCK_ADMINISTRATIONS,
  MOCK_DISPENSES,
  MOCK_PHARMACISTS,
  MEDICATION_CATALOG,
  PHARMACIES,
  MOCK_REMINDERS,
  buildMedicationEducation,
} from '@/services/medications/mock-data';
export type {
  PatientMedication,
  Prescription,
  ScheduledDose,
  DoseLog,
  MedicationReminder,
  RefillRequest,
  DrugInteraction,
  MedicationAdherence,
  MedicationDashboard,
  MedicationAnalytics,
  MedicationAdministration,
  MedicationDispense,
  MedicationEducation,
  MedicationFilters,
  CreatePrescriptionInput,
  LogDoseInput,
  RefillRequestInput,
  DispenseInput,
  AdministerInput,
  MedicationStatus,
  PrescriptionStatus,
  InteractionSeverity,
} from '@/services/medications/types';
export { AUTH_USER_PATIENT_MAP } from '@/services/medications/types';
