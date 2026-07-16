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

export type ReportStatus = 'draft' | 'preliminary' | 'final' | 'amended' | 'cancelled';

export type BillingStatus = 'pending' | 'submitted' | 'paid' | 'denied';

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

export interface ImageAnnotation {
  id: string;
  studyId: string;
  seriesId: string;
  instanceId: string;
  type: 'arrow' | 'circle' | 'rectangle' | 'text' | 'freehand';
  label?: string;
  coordinates: { x: number; y: number; width?: number; height?: number };
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
  metadata?: DICOMMetadata;
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

export interface DICOMMetadata {
  studyInstanceUid: string;
  seriesInstanceUid: string;
  sopInstanceUid: string;
  patientId: string;
  accessionNumber: string;
  studyDate: string;
  modality: string;
  bodyPartExamined?: string;
  windowCenter?: number;
  windowWidth?: number;
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
  status: 'online' | 'offline' | 'maintenance';
  utilizationPercent: number;
}

export interface RadiologyOrder {
  id: string;
  studyId?: string;
  patientId: string;
  orderingPhysician: string;
  clinicalIndication: string;
  modality: Modality;
  bodyPart: BodyPart;
  priority: StudyPriority;
  status: StudyStatus;
  carePlanId?: string;
  appointmentId?: string;
  scheduledAt?: string;
  createdAt: string;
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

export interface RadiologyTimelineEntry {
  id: string;
  patientId: string;
  studyId?: string;
  type: 'order' | 'study' | 'report' | 'annotation' | 'share' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'critical';
}

export interface ImagingComparison {
  studyId: string;
  comparisonStudyId: string;
  modality: Modality;
  bodyPart: BodyPart;
  deltaSummary: string;
  changedFindings: string[];
}

export interface RadiologyDashboard {
  patientId?: string;
  studiesToday: number;
  pendingReports: number;
  criticalFindings: number;
  averageReportingHours: number;
  unreadReports: number;
  emergencyStudies: number;
  recentStudies: RadiologyStudy[];
  recentActivity: RadiologyTimelineEntry[];
  kpis: { label: string; value: number }[];
  chartData: { label: string; value: number }[];
}

export interface RadiologyAnalytics {
  totalStudies: number;
  completedStudies: number;
  pendingInterpretation: number;
  criticalCount: number;
  averageReportingHours: number;
  radiologistUtilization: number;
  deviceUtilization: number;
  studiesByModality: { label: string; value: number }[];
  studiesByBodyPart: { label: string; value: number }[];
  turnaroundByMonth: { label: string; value: number }[];
  emergencyCount: number;
}

export interface ImageViewerState {
  studyId: string;
  activeSeriesId: string;
  activeInstanceId: string;
  layout: '1x1' | '1x2' | '2x2';
  zoom: number;
  pan: { x: number; y: number };
  rotation: number;
  invert: boolean;
  windowCenter: number;
  windowWidth: number;
}

export interface PACSConnection {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'degraded';
  latencyMs: number;
  lastSync: string;
}

export interface StudyPermissions {
  canView: boolean;
  canAnnotate: boolean;
  canMeasure: boolean;
  canExport: boolean;
  canShare: boolean;
  canReport: boolean;
}

export interface ImageExport {
  id: string;
  studyId: string;
  format: 'png' | 'jpeg' | 'pdf' | 'dicom';
  status: 'pending' | 'ready' | 'failed';
  url?: string;
  createdAt: string;
}

export interface ImageShare {
  id: string;
  studyId: string;
  sharedWith: string;
  expiresAt: string;
  createdAt: string;
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

export interface CreateRadiologyOrderInput {
  patientId: string;
  patientName: string;
  orderingPhysician: string;
  orderingPhysicianId: string;
  facilityId: string;
  facilityName: string;
  modality: Modality;
  bodyPart: BodyPart;
  priority: StudyPriority;
  clinicalIndication: string;
  reason: string;
  carePlanId?: string;
  appointmentId?: string;
  scheduledAt?: string;
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

export interface AddAnnotationInput {
  studyId: string;
  seriesId: string;
  instanceId: string;
  type: ImageAnnotation['type'];
  label?: string;
  coordinates: ImageAnnotation['coordinates'];
  createdBy: string;
}

export interface AddMeasurementInput {
  studyId: string;
  seriesId?: string;
  instanceId?: string;
  label: string;
  value: number;
  unit: string;
  createdBy: string;
}

export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};
