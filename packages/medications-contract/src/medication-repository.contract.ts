import type {
  CreatePrescriptionInput,
  DoseLog,
  LogDoseInput,
  MedicationFilters,
  MedicationListResult,
  MedicationReminder,
  MedicationSearchResult,
  PatientMedication,
  Prescription,
  RefillRequest,
  RefillRequestInput,
  ScheduledDose,
} from './medication.types';

/**
 * Canonical Medications repository contract — mock and HTTP adapters.
 */
export interface MedicationsRepositoryContract {
  listMedications(filters?: MedicationFilters): Promise<MedicationListResult>;
  getAllMedications(filters?: MedicationFilters): Promise<PatientMedication[]>;
  getMedication(id: string): Promise<PatientMedication>;
  listPrescriptions(filters?: MedicationFilters): Promise<Prescription[]>;
  getPrescription(id: string): Promise<Prescription>;
  getSchedule(patientId?: string): Promise<ScheduledDose[]>;
  getLogs(patientId?: string): Promise<DoseLog[]>;
  getReminders(patientId?: string): Promise<MedicationReminder[]>;
  getRefills(patientId?: string): Promise<RefillRequest[]>;
  createPrescription(input: CreatePrescriptionInput): Promise<Prescription>;
  cancelPrescription(id: string): Promise<Prescription>;
  renewPrescription(id: string): Promise<Prescription>;
  logDose(input: LogDoseInput): Promise<DoseLog>;
  requestRefill(input: RefillRequestInput): Promise<RefillRequest>;
  approveRefill(id: string): Promise<RefillRequest>;
  rejectRefill(id: string): Promise<RefillRequest>;
  pauseMedication(medicationId: string): Promise<PatientMedication>;
  resumeMedication(medicationId: string): Promise<PatientMedication>;
  completeCourse(medicationId: string): Promise<PatientMedication>;
  markReminderDone(reminderId: string): Promise<MedicationReminder>;
  search(query: string, patientId?: string): Promise<MedicationSearchResult>;
}
