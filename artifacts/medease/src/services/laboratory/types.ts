export type LabCategory =
  | 'hematology'
  | 'biochemistry'
  | 'microbiology'
  | 'immunology'
  | 'virology'
  | 'pathology'
  | 'genetics'
  | 'endocrinology'
  | 'toxicology'
  | 'urinalysis'
  | 'coagulation'
  | 'blood_bank'
  | 'covid'
  | 'pregnancy'
  | 'custom';

export type LabOrderStatus =
  | 'draft'
  | 'pending'
  | 'scheduled'
  | 'collected'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type LabOrderPriority = 'routine' | 'urgent' | 'stat';

export type CollectionMethod = 'in_clinic' | 'home_collection' | 'external_lab' | 'referral';

export type LabResultStatus =
  | 'pending'
  | 'processing'
  | 'verified'
  | 'released'
  | 'corrected'
  | 'amended'
  | 'cancelled'
  | 'rejected';

export type ResultFlag =
  | 'normal'
  | 'high'
  | 'low'
  | 'critical_high'
  | 'critical_low'
  | 'abnormal';

export type SpecimenStatus =
  | 'pending'
  | 'collected'
  | 'in_transit'
  | 'received'
  | 'processing'
  | 'rejected'
  | 'lost'
  | 'damaged'
  | 'stored'
  | 'recollected';

export type LabAlertSeverity = 'info' | 'warning' | 'critical';

export type LabAlertType =
  | 'critical_result'
  | 'abnormal_result'
  | 'duplicate_order'
  | 'expired_specimen'
  | 'delayed_turnaround'
  | 'care_plan'
  | 'medication_interaction'
  | 'appointment_followup';

export interface LabTestDefinition {
  id: string;
  loincCode: string;
  name: string;
  category: LabCategory;
  description: string;
  preparation?: string;
  specimenType: string;
  tubeType: string;
  collectionInstructions: string;
  normalRange: string;
  criticalRange?: string;
  referenceRange: string;
  units: string;
  turnaroundHours: number;
  costPlaceholder?: number;
  clinicalNotes?: string;
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  orderingPhysician: string;
  orderingPhysicianId: string;
  facilityId: string;
  facilityName: string;
  department: string;
  laboratoryId: string;
  laboratoryName: string;
  priority: LabOrderPriority;
  status: LabOrderStatus;
  collectionMethod: CollectionMethod;
  clinicalIndication: string;
  diagnosis?: string;
  carePlanId?: string;
  appointmentId?: string;
  testIds: string[];
  testNames: string[];
  notes?: string;
  isRecurring: boolean;
  isStanding: boolean;
  scheduledAt?: string;
  collectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabObservation {
  id: string;
  reportId: string;
  orderId: string;
  patientId: string;
  testId: string;
  testName: string;
  loincCode: string;
  category: LabCategory;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  flag: ResultFlag;
  interpretation?: string;
  patientFriendlyText?: string;
  collectedAt: string;
  resultedAt?: string;
}

export interface LabDiagnosticReport {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  reportNumber: string;
  status: LabResultStatus;
  category: LabCategory;
  title: string;
  summary?: string;
  observationIds: string[];
  verifiedBy?: string;
  approvedBy?: string;
  digitalSignature?: string;
  technologistId?: string;
  technologistName?: string;
  releasedAt?: string;
  correctedAt?: string;
  attachments?: string[];
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpecimenRecord {
  id: string;
  orderId: string;
  patientId: string;
  barcode: string;
  qrCode: string;
  specimenType: string;
  status: SpecimenStatus;
  collectedBy?: string;
  collectedAt?: string;
  receivedAt?: string;
  temperature?: string;
  storageLocation?: string;
  rejectionReason?: string;
  chainOfCustody: SpecimenEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface SpecimenEvent {
  id: string;
  timestamp: string;
  status: SpecimenStatus;
  actor: string;
  notes?: string;
}

export interface LabAlert {
  id: string;
  type: LabAlertType;
  severity: LabAlertSeverity;
  patientId: string;
  orderId?: string;
  reportId?: string;
  observationId?: string;
  title: string;
  message: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface LabTimelineEntry {
  id: string;
  patientId: string;
  type: 'order' | 'specimen' | 'result' | 'alert' | 'verification';
  title: string;
  description: string;
  timestamp: string;
  orderId?: string;
  reportId?: string;
  severity?: LabAlertSeverity;
}

export interface LaboratoryDashboard {
  patientId?: string;
  todayOrders: number;
  pendingCollection: number;
  collectedSamples: number;
  inProcessing: number;
  resultsReady: number;
  criticalResults: number;
  rejectedSamples: number;
  cancelledOrders: number;
  averageTurnaroundHours: number;
  recentActivity: LabTimelineEntry[];
  kpis: { label: string; value: number }[];
  chartData: { label: string; value: number }[];
}

export interface LabTrendPoint {
  date: string;
  value: number;
}

export interface LabTrendSeries {
  testId: string;
  testName: string;
  unit: string;
  referenceRange: string;
  points: LabTrendPoint[];
}

export interface LaboratoryAnalytics {
  totalOrders: number;
  completedOrders: number;
  averageTurnaroundHours: number;
  criticalResultCount: number;
  rejectionRate: number;
  qualityScore: number;
  verificationRate: number;
  pendingVerification: number;
  instrumentUtilization: number;
  specimenQualityScore: number;
  ordersByCategory: { label: string; value: number }[];
  turnaroundByDepartment: { label: string; value: number }[];
  criticalByMonth: { label: string; value: number }[];
}

export interface ObservationGroup {
  id: string;
  reportId: string;
  name: string;
  observationIds: string[];
}

export interface CollectionSite {
  id: string;
  name: string;
  facilityId: string;
}

export interface LaboratoryPanel {
  id: string;
  name: string;
  loincCode: string;
  testIds: string[];
  category: LabCategory;
}

export interface SensitivityResult {
  antibiotic: string;
  interpretation: 'S' | 'I' | 'R';
  mic?: string;
}

export interface CultureResult {
  organism: string;
  colonyCount?: string;
  sensitivities: SensitivityResult[];
}

export interface MicrobiologyResult {
  id: string;
  reportId: string;
  patientId: string;
  specimenType: string;
  status: LabResultStatus;
  cultures: CultureResult[];
  gramStain?: string;
  comments?: string;
  finalizedAt?: string;
  technologistName?: string;
}

export interface HistologyReport {
  id: string;
  reportId: string;
  findings: string;
  diagnosis: string;
  margins?: string;
}

export interface PathologyResult {
  id: string;
  reportId: string;
  patientId: string;
  specimenSite: string;
  status: LabResultStatus;
  histology: HistologyReport[];
  macroscopic?: string;
  microscopic?: string;
  pathologistName?: string;
  finalizedAt?: string;
}

export interface BloodBankRecord {
  id: string;
  patientId: string;
  orderId?: string;
  component: 'RBC' | 'Platelets' | 'Plasma' | 'Whole Blood' | 'Cryoprecipitate';
  bloodGroup: string;
  rhFactor: 'Positive' | 'Negative';
  crossMatchResult: 'compatible' | 'incompatible' | 'pending';
  status: LabResultStatus;
  collectedAt: string;
  verifiedBy?: string;
}

export interface QualityControl {
  id: string;
  instrumentId: string;
  testName: string;
  expectedValue: string;
  observedValue: string;
  withinRange: boolean;
  runAt: string;
  technologistId: string;
}

export interface LaboratoryInstrument {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  department: string;
  status: 'online' | 'offline' | 'maintenance' | 'calibration';
  utilizationPercent: number;
  lastCalibration?: string;
}

export interface Technologist {
  id: string;
  name: string;
  credentials: string;
  department: string;
  activeOrders: number;
}

export interface QualityDashboard {
  qualityScore: number;
  verificationRate: number;
  rejectionRate: number;
  pendingVerification: number;
  instrumentUtilization: number;
  recentQc: QualityControl[];
  kpis: { label: string; value: number }[];
}

export interface LabExportRecord {
  id: string;
  reportId: string;
  format: ExportResultInput['format'];
  exportedAt: string;
  exportedBy: string;
}

export interface LabShareRecord {
  id: string;
  reportId: string;
  sharedWith: string;
  sharedAt: string;
}

export interface LabOrderFilters {
  patientId?: string;
  status?: LabOrderStatus;
  priority?: LabOrderPriority;
  category?: LabCategory;
  facilityId?: string;
  laboratoryId?: string;
  carePlanId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface LabResultFilters {
  patientId?: string;
  status?: LabResultStatus;
  category?: LabCategory;
  flag?: ResultFlag;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateLabOrderInput {
  patientId: string;
  patientName: string;
  orderingPhysician: string;
  orderingPhysicianId: string;
  facilityId: string;
  facilityName: string;
  department: string;
  laboratoryId: string;
  laboratoryName: string;
  priority: LabOrderPriority;
  collectionMethod: CollectionMethod;
  clinicalIndication: string;
  diagnosis?: string;
  carePlanId?: string;
  appointmentId?: string;
  testIds: string[];
  notes?: string;
  isRecurring?: boolean;
  isStanding?: boolean;
  scheduledAt?: string;
}

export interface CancelLabOrderInput {
  orderId: string;
  reason?: string;
}

export interface VerifyResultInput {
  reportId: string;
  verifiedBy: string;
  comments?: string;
}

export interface ReleaseResultInput {
  reportId: string;
  comments?: string;
}

export interface ApproveResultInput {
  reportId: string;
  approvedBy: string;
  digitalSignature?: string;
  comments?: string;
}

export interface UploadResultInput {
  orderId: string;
  technologistId: string;
  technologistName: string;
  title: string;
  category: LabCategory;
  observations: Array<{
    testId: string;
    value: string;
    numericValue?: number;
    interpretation?: string;
  }>;
}

export interface ExportResultInput {
  reportId: string;
  format: 'pdf' | 'hl7' | 'fhir' | 'csv';
}

export interface ShareResultInput {
  reportId: string;
  sharedWith: string;
}

export interface CollectSpecimenInput {
  orderId: string;
  collectedBy: string;
  temperature?: string;
}

export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};
