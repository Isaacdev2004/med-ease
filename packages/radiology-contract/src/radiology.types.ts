export type Modality =
  | 'MRI'
  | 'CT'
  | 'X-Ray'
  | 'Ultrasound'
  | 'PET'
  | 'Mammography'
  | 'Fluoroscopy'
  | 'DEXA'
  | 'Dental'
  | 'Nuclear Medicine';

export type StudyStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'pending_interpretation'
  | 'preliminary'
  | 'final'
  | 'amended'
  | 'cancelled';

export type StudyPriority = 'routine' | 'urgent' | 'stat';

export type BodyPart =
  | 'head'
  | 'neck'
  | 'chest'
  | 'abdomen'
  | 'pelvis'
  | 'spine'
  | 'upper_extremity'
  | 'lower_extremity'
  | 'whole_body'
  | 'breast'
  | 'dental'
  | 'cardiac';

export type RadiologyCategory =
  | 'diagnostic'
  | 'screening'
  | 'interventional'
  | 'emergency'
  | 'follow_up'
  | 'research';

export type ReportStatus =
  | 'draft'
  | 'preliminary'
  | 'final'
  | 'amended'
  | 'cancelled';

export type BillingStatus = 'pending' | 'submitted' | 'paid' | 'denied';

export type DeviceStatus = 'online' | 'offline' | 'maintenance';

export interface ContrastInformation {
  used: boolean;
  agent?: string;
  volumeMl?: number;
  reaction?: string;
}

export interface PatientPosition {
  code: string;
  description: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'critical';
  bodyRegion?: string;
}

export interface Impression {
  summary: string;
  critical: boolean;
}

export interface Recommendation {
  id: string;
  text: string;
  priority: 'routine' | 'urgent';
  followUpModality?: Modality;
}

export interface Measurement {
  id: string;
  studyId: string;
  seriesId?: string;
  instanceId?: string;
  label: string;
  value: number;
  unit: string;
  createdBy: string;
  createdAt: string;
}

export interface ImagingInstance {
  id: string;
  seriesId: string;
  instanceNumber: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  dicomUid?: string;
}

export interface ImagingSeries {
  id: string;
  studyId: string;
  seriesNumber: number;
  modality: Modality;
  description: string;
  bodyPart: BodyPart;
  instanceCount: number;
  instances: ImagingInstance[];
}

export interface Radiologist {
  id: string;
  name: string;
  specialty: string;
  facilityId: string;
  activeStudies: number;
}

export interface ImagingDevice {
  id: string;
  name: string;
  modality: Modality;
  facilityId: string;
  facilityName: string;
  status: DeviceStatus;
  utilizationPercent: number;
}

export interface RadiologyOrder {
  id: string;
  studyId?: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  orderingPhysician: string;
  orderingPhysicianId: string;
  facilityId: string;
  facilityName: string;
  clinicalIndication: string;
  reason: string;
  modality: Modality;
  bodyPart: BodyPart;
  priority: StudyPriority;
  status: StudyStatus;
  carePlanId?: string;
  appointmentId?: string;
  scheduledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticReport {
  id: string;
  studyId: string;
  patientId: string;
  patientName: string;
  accessionNumber: string;
  status: ReportStatus;
  modality: Modality;
  bodyPart: BodyPart;
  title: string;
  findings: Finding[];
  impression: Impression;
  recommendations: Recommendation[];
  measurements: Measurement[];
  radiologistId: string;
  radiologistName: string;
  signedAt?: string;
  isCritical: boolean;
  isUnread: boolean;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RadiologyStudy {
  id: string;
  accessionNumber: string;
  patientId: string;
  patientName: string;
  orderingPhysician: string;
  orderingPhysicianId: string;
  facilityId: string;
  facilityName: string;
  radiologistId?: string;
  radiologistName?: string;
  modality: Modality;
  bodyPart: BodyPart;
  category: RadiologyCategory;
  status: StudyStatus;
  priority: StudyPriority;
  studyDate: string;
  reason: string;
  clinicalIndication: string;
  protocol: string;
  contrast: ContrastInformation;
  patientPosition: PatientPosition;
  imageCount: number;
  seriesCount: number;
  series: ImagingSeries[];
  reportId?: string;
  radiationDoseMsv?: number;
  deviceId: string;
  deviceName: string;
  isEmergency: boolean;
  billingStatus: BillingStatus;
  isCritical: boolean;
  carePlanId?: string;
  appointmentId?: string;
  comparisonStudyIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyFilters {
  patientId?: string;
  modality?: Modality;
  bodyPart?: BodyPart;
  status?: StudyStatus;
  priority?: StudyPriority;
  facilityId?: string;
  radiologistId?: string;
  isCritical?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface ReportFilters {
  patientId?: string;
  status?: ReportStatus;
  isCritical?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface StudyListResult {
  items: RadiologyStudy[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReportListResult {
  items: DiagnosticReport[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateRadiologyOrderInput {
  patientId: string;
  patientName?: string;
  orderingPhysician: string;
  orderingPhysicianId: string;
  facilityId: string;
  facilityName: string;
  modality: Modality;
  bodyPart: BodyPart;
  priority?: StudyPriority;
  clinicalIndication: string;
  reason: string;
  carePlanId?: string;
  appointmentId?: string;
  scheduledAt?: string;
  notes?: string;
}

export interface CancelRadiologyOrderInput {
  orderId: string;
  reason?: string;
}

export interface CompleteAcquisitionInput {
  studyId: string;
  imageCount?: number;
  seriesCount?: number;
  radiationDoseMsv?: number;
  deviceId?: string;
  deviceName?: string;
}

export interface CompleteInterpretationInput {
  reportId: string;
  findings: Finding[];
  impression: Impression;
  recommendations?: Recommendation[];
}

export interface ApproveReportInput {
  reportId: string;
  radiologistId: string;
  radiologistName: string;
}
