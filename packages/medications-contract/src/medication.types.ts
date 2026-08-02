export type MedicationStatus =
  | 'active'
  | 'completed'
  | 'paused'
  | 'cancelled'
  | 'future';

export type PrescriptionStatus =
  | 'draft'
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'renewed'
  | 'pending'
  | 'completed'
  | 'on_hold';

export type DoseLogStatus =
  | 'taken'
  | 'skipped'
  | 'late'
  | 'partial'
  | 'vomited'
  | 'rescheduled';

export type ScheduleSlot =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'custom'
  | 'prn';

export type ScheduledDoseStatus =
  | 'pending'
  | 'taken'
  | 'missed'
  | 'late'
  | 'skipped';

export type MedicationRoute =
  | 'oral'
  | 'topical'
  | 'injection'
  | 'inhalation'
  | 'sublingual'
  | 'other';

export type RefillStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'dispensed'
  | 'partial';

export interface MedicationIdentity {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  strength: string;
  medicationClass: string;
  medicationType: string;
  manufacturer?: string;
  controlledSubstance: boolean;
  libraryMedicationId?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  medication: MedicationIdentity;
  dose: string;
  frequency: string;
  route: MedicationRoute;
  durationDays: number;
  startDate: string;
  endDate?: string;
  validityDays: number;
  expiresAt: string;
  status: PrescriptionStatus;
  refillCount: number;
  refillsRemaining: number;
  prescribingPhysician: string;
  prescribingPhysicianId: string;
  dispensingPharmacy?: string;
  dispensingPharmacyId?: string;
  instructions: string;
  warnings: string[];
  contraindications: string[];
  isRecurring: boolean;
  carePlanId?: string;
  diagnosisCode?: string;
  appointmentId?: string;
  facilityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientMedication extends MedicationIdentity {
  prescriptionId: string;
  patientId: string;
  status: MedicationStatus;
  dose: string;
  frequency: string;
  route: MedicationRoute;
  startDate: string;
  endDate?: string;
  remainingDays?: number;
  instructions: string;
  warnings: string[];
  contraindications: string[];
  sideEffects: string[];
  storage?: string;
  prescribingPhysician: string;
  dispensingPharmacy?: string;
  refillCount: number;
  refillsRemaining: number;
  adherencePercent: number;
  condition?: string;
  carePlanId?: string;
}

export interface ScheduledDose {
  id: string;
  medicationId: string;
  patientId: string;
  medicationName: string;
  scheduledAt: string;
  slot: ScheduleSlot;
  dose: string;
  status: ScheduledDoseStatus;
  instructions?: string;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  patientId: string;
  scheduledDoseId?: string;
  status: DoseLogStatus;
  loggedAt: string;
  notes?: string;
  symptoms?: string;
  sideEffects?: string;
  mood?: string;
  painScore?: number;
  bloodSugar?: number;
  bloodPressure?: string;
  temperature?: number;
  weight?: number;
}

export interface MedicationReminder {
  id: string;
  medicationId: string;
  patientId: string;
  type: 'dose' | 'refill' | 'expiration' | 'follow_up' | 'caregiver';
  channel: 'push' | 'email' | 'sms' | 'in_app';
  title: string;
  message: string;
  dueAt: string;
  active: boolean;
}

export interface RefillRequest {
  id: string;
  prescriptionId: string;
  medicationId: string;
  patientId: string;
  patientName: string;
  medicationName: string;
  pharmacyId: string;
  pharmacyName: string;
  status: RefillStatus;
  remainingTablets?: number;
  daysLeft?: number;
  requestedAt: string;
  expectedDate?: string;
  autoRefill: boolean;
}

export interface MedicationFilters {
  patientId?: string;
  status?: MedicationStatus;
  physician?: string;
  pharmacy?: string;
  condition?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface MedicationListResult {
  items: PatientMedication[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreatePrescriptionInput {
  patientId: string;
  medicationName: string;
  genericName: string;
  strength: string;
  dose: string;
  frequency: string;
  route: MedicationRoute;
  durationDays: number;
  instructions: string;
  refillCount?: number;
  controlledSubstance?: boolean;
  diagnosisCode?: string;
  brandName?: string;
  medicationClass?: string;
  medicationType?: string;
  prescribingPhysician?: string;
  prescribingPhysicianId?: string;
  dispensingPharmacy?: string;
  dispensingPharmacyId?: string;
  warnings?: string[];
  contraindications?: string[];
  sideEffects?: string[];
  storage?: string;
  condition?: string;
  scheduleTimes?: string[];
}

export interface LogDoseInput {
  medicationId: string;
  patientId: string;
  scheduledDoseId?: string;
  status: DoseLogStatus;
  notes?: string;
}

export interface RefillRequestInput {
  prescriptionId: string;
  patientId: string;
  pharmacyId: string;
  pharmacyName?: string;
  autoRefill?: boolean;
}

export interface MedicationSearchResult {
  medications: PatientMedication[];
  prescriptions: Prescription[];
}
