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

export type CollectionMethod =
  | 'in_clinic'
  | 'home_collection'
  | 'external_lab'
  | 'referral';

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

export interface SpecimenEvent {
  id: string;
  timestamp: string;
  status: SpecimenStatus;
  actor: string;
  notes?: string;
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

export interface LabOrderListResult {
  items: LabOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LabResultListResult {
  items: LabDiagnosticReport[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LabResultDetail {
  report: LabDiagnosticReport;
  observations: LabObservation[];
}

export interface CreateLabOrderInput {
  patientId: string;
  patientName?: string;
  orderingPhysician: string;
  orderingPhysicianId: string;
  facilityId: string;
  facilityName: string;
  department: string;
  laboratoryId: string;
  laboratoryName: string;
  priority?: LabOrderPriority;
  collectionMethod?: CollectionMethod;
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

export interface CollectSpecimenInput {
  orderId: string;
  collectedBy: string;
  temperature?: string;
}

export interface UploadObservationInput {
  testId: string;
  value: string;
  numericValue?: number;
  interpretation?: string;
}

export interface UploadResultInput {
  orderId: string;
  technologistId: string;
  technologistName: string;
  title: string;
  category: LabCategory;
  observations: UploadObservationInput[];
  summary?: string;
  comments?: string;
}

export interface VerifyResultInput {
  reportId: string;
  verifiedBy: string;
  comments?: string;
}

export interface ApproveResultInput {
  reportId: string;
  approvedBy: string;
  digitalSignature?: string;
  comments?: string;
}

export interface ReleaseResultInput {
  reportId: string;
  comments?: string;
}
