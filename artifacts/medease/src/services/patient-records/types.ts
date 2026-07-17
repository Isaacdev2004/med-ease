/** Patient Health Record domain types — FHIR-ready structure. */

export type Gender = 'male' | 'female' | 'other' | 'unknown';
export type BloodGroup =
  'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
export type AllergySeverity =
  'mild' | 'moderate' | 'severe' | 'life_threatening';
export type AllergyType = 'drug' | 'food' | 'environmental';
export type MedicationStatus = 'active' | 'stopped' | 'paused' | 'completed';
export type EncounterType =
  'emergency' | 'admission' | 'consultation' | 'teleconsultation' | 'procedure';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertCategory =
  | 'drug_allergy'
  | 'critical_lab'
  | 'fall_risk'
  | 'diabetes'
  | 'hypertension'
  | 'pregnancy'
  | 'critical_condition'
  | 'care_plan'
  | 'high_risk';
export type TimelineCategory =
  | 'encounter'
  | 'lab'
  | 'medication'
  | 'procedure'
  | 'immunization'
  | 'note'
  | 'admission'
  | 'discharge'
  | 'radiology'
  | 'care_plan'
  | 'vital';
export type DocumentType =
  | 'referral'
  | 'discharge'
  | 'prescription'
  | 'certificate'
  | 'insurance'
  | 'consent'
  | 'other';
export type LabFlag = 'normal' | 'low' | 'high' | 'critical';
export type CarePlanStatus = 'active' | 'completed' | 'on_hold' | 'cancelled';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validUntil?: string;
}

export interface PatientDemographics {
  id: string;
  mrn: string;
  userId?: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  photoUrl?: string;
  address: Address;
  language: string;
  maritalStatus: string;
  occupation: string;
  nationality: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  smoking: 'never' | 'former' | 'current';
  alcohol: 'none' | 'moderate' | 'heavy';
  primaryPhysician: string;
  emergencyContacts: EmergencyContact[];
  insurance: InsuranceInfo;
  nationalId: string;
}

export interface Diagnosis {
  id: string;
  code?: string;
  label: string;
  status: 'active' | 'resolved' | 'chronic';
  onsetDate: string;
  resolvedDate?: string;
}

export interface MedicalSummary {
  problemList: Diagnosis[];
  chronicDiseases: string[];
  currentDiagnoses: Diagnosis[];
  resolvedConditions: Diagnosis[];
  activeTreatments: string[];
  clinicalRisks: string[];
}

export interface Allergy {
  id: string;
  type: AllergyType;
  substance: string;
  severity: AllergySeverity;
  reaction: string;
  recordedDate: string;
}

export interface VitalReading {
  id: string;
  recordedAt: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperatureC?: number;
  respirationRate?: number;
  oxygenSaturation?: number;
  bloodGlucose?: number;
  weightKg?: number;
  bmi?: number;
  recordedBy?: string;
}

export interface Encounter {
  id: string;
  type: EncounterType;
  date: string;
  department: string;
  physician: string;
  facility: string;
  reason: string;
  summary?: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  author: string;
  specialty: string;
  title: string;
  content: string;
}

export interface PatientMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: MedicationStatus;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  compliance?: number;
  renewals?: number;
}

export interface Immunization {
  id: string;
  vaccine: string;
  date: string;
  dose: string;
  site?: string;
  lotNumber?: string;
  provider: string;
}

export interface LabResult {
  id: string;
  testName: string;
  category: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: LabFlag;
  collectedAt: string;
  resultedAt: string;
}

export interface RadiologyStudy {
  id: string;
  modality: 'MRI' | 'CT' | 'Ultrasound' | 'X-Ray';
  bodyPart: string;
  date: string;
  report: string;
  radiologist: string;
  imageUrl?: string;
}

export interface ProcedureRecord {
  id: string;
  name: string;
  category: string;
  date: string;
  physician: string;
  facility: string;
  notes?: string;
  recoveryNotes?: string;
}

export interface CarePlan {
  id: string;
  title: string;
  goals: string[];
  interventions: string[];
  progress: string;
  assignedClinicians: string[];
  status: CarePlanStatus;
  reviewSchedule: string;
}

export interface ClinicalDocument {
  id: string;
  title: string;
  type: DocumentType;
  date: string;
  author: string;
  facility?: string;
  pdfUrl?: string;
}

export interface TimelineEntry {
  id: string;
  category: TimelineCategory;
  date: string;
  title: string;
  description: string;
  actor?: string;
  severity?: AlertSeverity;
  metadata?: Record<string, string>;
}

export interface ClinicalAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  active: boolean;
}

export interface FamilyHistoryEntry {
  relation: string;
  condition: string;
  ageOfOnset?: number;
}

export interface LifestyleProfile {
  diet: string;
  exercise: string;
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high';
}

export interface SocialHistory {
  livingSituation: string;
  supportNetwork: string;
  employment: string;
  travelHistory?: string;
}

export interface EmergencySummary {
  bloodGroup: BloodGroup;
  criticalAllergies: string[];
  activeMedications: string[];
  chronicConditions: string[];
  emergencyContacts: EmergencyContact[];
  primaryPhysician: string;
  advanceDirectives?: string;
  lastUpdated: string;
}

export interface HealthScore {
  overall: number;
  vitals: number;
  labs: number;
  medications: number;
  carePlans: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface PatientHealthRecord {
  demographics: PatientDemographics;
  summary: MedicalSummary;
  allergies: Allergy[];
  vitals: VitalReading[];
  encounters: Encounter[];
  notes: ClinicalNote[];
  medications: PatientMedication[];
  immunizations: Immunization[];
  labs: LabResult[];
  radiology: RadiologyStudy[];
  procedures: ProcedureRecord[];
  carePlans: CarePlan[];
  documents: ClinicalDocument[];
  timeline: TimelineEntry[];
  alerts: ClinicalAlert[];
  familyHistory: FamilyHistoryEntry[];
  lifestyle: LifestyleProfile;
  socialHistory: SocialHistory;
  emergencySummary: EmergencySummary;
  healthScore: HealthScore;
  updatedAt: string;
}

export interface PatientRecordFilters {
  q?: string;
  condition?: string;
  provider?: string;
  facility?: string;
  category?: TimelineCategory;
  severity?: AlertSeverity;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PatientRecordSearchResult {
  items: PatientDemographics[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PatientRecordStats {
  totalPatients: number;
  activeAlerts: number;
  pendingCarePlans: number;
}

/** Maps auth user id to PHR patient id. */
export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};
