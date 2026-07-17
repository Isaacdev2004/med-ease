export type MedicationStatus =
  'active' | 'completed' | 'paused' | 'cancelled' | 'future';
export type PrescriptionStatus =
  'draft' | 'active' | 'expired' | 'cancelled' | 'renewed' | 'pending';
export type DoseLogStatus =
  'taken' | 'skipped' | 'late' | 'partial' | 'vomited' | 'rescheduled';
export type InteractionSeverity = 'critical' | 'high' | 'moderate' | 'low';
export type RefillStatus =
  'pending' | 'approved' | 'rejected' | 'dispensed' | 'partial';
export type ScheduleSlot =
  'morning' | 'afternoon' | 'evening' | 'night' | 'custom' | 'prn';
export type MedicationRoute =
  'oral' | 'topical' | 'injection' | 'inhalation' | 'sublingual' | 'other';

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
  digitalSignaturePlaceholder?: string;
  qrCodePlaceholder?: string;
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
  status: 'pending' | 'taken' | 'missed' | 'late' | 'skipped';
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
  insuranceApprovalPlaceholder?: string;
  autoRefill: boolean;
}

export interface DrugInteraction {
  id: string;
  patientId: string;
  type:
    | 'medication'
    | 'allergy'
    | 'diagnosis'
    | 'pregnancy'
    | 'food'
    | 'alcohol'
    | 'supplement';
  source: string;
  target: string;
  severity: InteractionSeverity;
  recommendation: string;
  active: boolean;
}

export interface MedicationTimelineEntry {
  id: string;
  patientId: string;
  date: string;
  type: 'prescription' | 'refill' | 'dose' | 'change' | 'stop' | 'interaction';
  title: string;
  description: string;
  actor?: string;
}

export interface MedicationAdherence {
  patientId: string;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  compliancePercent: number;
  missedDoses: number;
  lateDoses: number;
  skippedDoses: number;
  completedDoses: number;
  medicationScore: number;
  trend: { label: string; value: number }[];
}

export interface MedicationDashboard {
  patientId: string;
  todayTotal: number;
  taken: number;
  pending: number;
  missed: number;
  upcoming: number;
  refillAlerts: number;
  interactionAlerts: number;
  prescriptionAlerts: number;
  medicationScore: number;
  adherencePercent: number;
  recentActivity: MedicationTimelineEntry[];
}

export interface MedicationAnalytics {
  totalPrescriptions: number;
  activeMedications: number;
  adherenceAverage: number;
  refillRate: number;
  interactionCount: number;
  pendingRefills: number;
  missedDoses: number;
  highRiskMedications: number;
  administrationCompliance: number;
  dispensingTurnaroundHours: number;
  mostPrescribed: { label: string; value: number }[];
  adherenceByMonth: { label: string; value: number }[];
  prescriptionStats: { label: string; value: number }[];
  safetyReports: { label: string; value: number }[];
  medicationClasses: { label: string; value: number }[];
}

export interface PharmacyPrescriptionQueue {
  id: string;
  prescriptionId: string;
  patientName: string;
  medicationName: string;
  status: 'pending' | 'approved' | 'rejected' | 'dispensed' | 'delivered';
  receivedAt: string;
  pharmacyId: string;
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
  autoRefill?: boolean;
}

export interface MedicationAdministration {
  id: string;
  medicationId: string;
  patientId: string;
  prescriptionId: string;
  medicationName: string;
  dose: string;
  route: MedicationRoute;
  administeredAt: string;
  administeredBy: string;
  status: 'completed' | 'refused' | 'held' | 'partial';
  notes?: string;
  witness?: string;
}

export interface MedicationDispense {
  id: string;
  prescriptionId: string;
  patientId: string;
  medicationName: string;
  pharmacyId: string;
  pharmacyName: string;
  quantity: number;
  unit: string;
  dispensedAt: string;
  dispensedBy: string;
  status: 'dispensed' | 'partial' | 'cancelled';
  lotNumber?: string;
}

export interface MedicationCourse {
  id: string;
  medicationId: string;
  patientId: string;
  medicationName: string;
  startDate: string;
  endDate?: string;
  totalDoses: number;
  completedDoses: number;
  status: 'active' | 'completed' | 'paused';
}

export interface MedicationEducation {
  medicationId: string;
  title: string;
  summary: string;
  instructions: string[];
  sideEffects: string[];
  storage: string;
  whenToCall: string[];
}

export interface MedicationExportRecord {
  id: string;
  patientId: string;
  format: 'pdf' | 'fhir' | 'csv';
  exportedAt: string;
}

export interface MedicationShareRecord {
  id: string;
  medicationId: string;
  sharedWith: string;
  sharedAt: string;
}

export interface PharmacistProfile {
  id: string;
  name: string;
  pharmacyId: string;
  pharmacyName: string;
  credentials: string;
  activeQueue: number;
}

export interface DispenseInput {
  prescriptionId: string;
  pharmacyId: string;
  dispensedBy: string;
  quantity: number;
}

export interface AdministerInput {
  medicationId: string;
  patientId: string;
  dose: string;
  administeredBy: string;
  notes?: string;
}

export interface PauseMedicationInput {
  medicationId: string;
  reason?: string;
}

export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};
