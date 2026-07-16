export type ObservationCategory =
  | 'vital-signs'
  | 'activity'
  | 'symptom'
  | 'survey'
  | 'device'
  | 'laboratory'
  | 'imaging'
  | 'medication-response';

export type VitalType =
  | 'blood_pressure'
  | 'heart_rate'
  | 'respiratory_rate'
  | 'temperature'
  | 'spo2'
  | 'blood_glucose'
  | 'weight'
  | 'bmi'
  | 'ecg_summary'
  | 'pain_score'
  | 'fall_risk';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'urgent';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
export type DeviceStatus = 'online' | 'offline' | 'syncing' | 'error' | 'maintenance';
export type BatteryStatus = 'full' | 'good' | 'low' | 'critical' | 'unknown';
export type MonitoringContext = 'home' | 'ward' | 'telemonitoring' | 'outpatient' | 'rpm';
export type RPMProgramStatus = 'active' | 'paused' | 'completed' | 'pending';

export interface VitalSign {
  id: string;
  patientId: string;
  type: VitalType;
  value: number | string;
  unit: string;
  recordedAt: string;
  context: MonitoringContext;
  deviceId?: string;
  recordedBy?: string;
  status: 'normal' | 'warning' | 'critical';
  systolic?: number;
  diastolic?: number;
}

export interface Observation {
  id: string;
  patientId: string;
  category: ObservationCategory;
  code: string;
  display: string;
  value: number | string;
  unit: string;
  recordedAt: string;
  context: MonitoringContext;
  deviceId?: string;
  sessionId?: string;
  status: 'final' | 'preliminary' | 'amended';
  interpretation?: 'normal' | 'abnormal' | 'critical';
  referenceRange?: string;
  recordedBy?: string;
  notes?: string;
  carePlanId?: string;
  appointmentId?: string;
}

export interface MonitoringSession {
  id: string;
  patientId: string;
  context: MonitoringContext;
  startedAt: string;
  endedAt?: string;
  deviceIds: string[];
  observationCount: number;
  alertCount: number;
  status: 'active' | 'completed' | 'interrupted';
}

export interface MonitoringDevice {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  type: 'wearable' | 'bedside' | 'home' | 'mobile' | 'gateway';
  serialNumber: string;
  status: DeviceStatus;
  battery: BatteryStatus;
  batteryPercent?: number;
  lastSyncAt?: string;
  firmwareVersion?: string;
  calibrationDue?: string;
  supportedMetrics: VitalType[];
}

export interface DeviceReading {
  id: string;
  deviceId: string;
  patientId: string;
  metric: VitalType;
  value: number | string;
  unit: string;
  recordedAt: string;
  syncedAt: string;
}

export interface DeviceAssignment {
  id: string;
  deviceId: string;
  patientId: string;
  assignedAt: string;
  assignedBy: string;
  unassignedAt?: string;
  programId?: string;
  active: boolean;
}

export interface RemoteMonitoringProgram {
  id: string;
  patientId: string;
  name: string;
  status: RPMProgramStatus;
  enrolledAt: string;
  enrolledBy: string;
  deviceIds: string[];
  metrics: VitalType[];
  frequency: string;
  clinicianId: string;
  clinicianName: string;
  carePlanId?: string;
  completedAt?: string;
}

export interface MonitoringAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'threshold' | 'missed_reading' | 'device_offline' | 'battery_low' | 'escalation' | 'clinical';
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  metric?: VitalType;
  value?: number | string;
  threshold?: string;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  observationId?: string;
  deviceId?: string;
}

export interface AlertRule {
  id: string;
  patientId?: string;
  metric: VitalType;
  minValue?: number;
  maxValue?: number;
  severity: AlertSeverity;
  active: boolean;
}

export interface EarlyWarningScore {
  id: string;
  patientId: string;
  type: 'NEWS2' | 'MEWS';
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  components: Record<string, number>;
  calculatedAt: string;
  context: MonitoringContext;
}

export interface NEWS2 extends EarlyWarningScore {
  type: 'NEWS2';
}

export interface MEWS extends EarlyWarningScore {
  type: 'MEWS';
}

export interface PatientTrend {
  id: string;
  patientId: string;
  metric: VitalType;
  period: 'daily' | 'weekly' | 'monthly' | 'longitudinal';
  points: { label: string; value: number; status?: string }[];
  average: number;
  min: number;
  max: number;
  trend: 'improving' | 'stable' | 'deteriorating';
}

export interface MonitoringDashboard {
  patientId?: string;
  activePatients: number;
  rpmEnrollments: number;
  activeAlerts: number;
  criticalAlerts: number;
  averageNews2: number;
  averageMews: number;
  deviceUtilization: number;
  monitoringCompliance: number;
  missedReadings: number;
  batteryHealth: number;
  alertResponseMinutes: number;
  recentObservations: Observation[];
  recentAlerts: MonitoringAlert[];
  activeSessions: number;
}

export interface ObservationTimelineEntry {
  id: string;
  patientId: string;
  date: string;
  type: 'observation' | 'alert' | 'session' | 'device' | 'rpm' | 'score';
  title: string;
  description: string;
  severity?: AlertSeverity;
  actor?: string;
}

export interface DeviceCalibration {
  id: string;
  deviceId: string;
  calibratedAt: string;
  calibratedBy: string;
  nextDue: string;
  status: 'valid' | 'due' | 'overdue';
}

export interface MonitoringAnalytics {
  activeMonitoredPatients: number;
  rpmEnrollments: number;
  criticalAlerts: number;
  averageNews2: number;
  averageMews: number;
  deviceUtilization: number;
  monitoringCompliance: number;
  missedReadings: number;
  batteryHealth: number;
  alertResponseMinutes: number;
  dailyVitalTrends: { label: string; value: number }[];
  populationBloodPressure: { label: string; value: number }[];
  heartRateDistribution: { label: string; value: number }[];
  glucoseTrends: { label: string; value: number }[];
  alertTrends: { label: string; value: number }[];
  deviceUtilizationChart: { label: string; value: number }[];
  deteriorationTrends: { label: string; value: number }[];
  rpmEnrollmentGrowth: { label: string; value: number }[];
}

export interface MonitoringFilters {
  patientId?: string;
  category?: ObservationCategory;
  metric?: VitalType;
  context?: MonitoringContext;
  status?: AlertStatus;
  severity?: AlertSeverity;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface MonitoringSearchResult {
  observations: Observation[];
  vitals: VitalSign[];
  alerts: MonitoringAlert[];
  devices: MonitoringDevice[];
}

export interface ObservationExport {
  id: string;
  patientId: string;
  format: 'pdf' | 'csv' | 'fhir';
  exportedAt: string;
  recordCount: number;
}

export interface ObservationShare {
  id: string;
  patientId: string;
  sharedWith: string;
  sharedAt: string;
  observationIds: string[];
}

export interface ObservationFavorite {
  id: string;
  patientId: string;
  observationId: string;
  createdAt: string;
}

export interface MonitoringPermissions {
  canView: boolean;
  canWrite: boolean;
  canManageAlerts: boolean;
  canManageDevices: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
  canManageRpm: boolean;
}

export interface CreateObservationInput {
  patientId: string;
  category: ObservationCategory;
  code: string;
  display: string;
  value: number | string;
  unit: string;
  context?: MonitoringContext;
  deviceId?: string;
  notes?: string;
}

export interface UpdateObservationInput {
  id: string;
  value?: number | string;
  notes?: string;
  status?: Observation['status'];
}

export interface AssignDeviceInput {
  deviceId: string;
  patientId: string;
  assignedBy: string;
  programId?: string;
}

export interface EnrollRPMInput {
  patientId: string;
  name: string;
  metrics: VitalType[];
  frequency: string;
  clinicianId: string;
  clinicianName: string;
  deviceIds?: string[];
  carePlanId?: string;
}

export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};

export const MONITORED_PATIENT_IDS = Array.from({ length: 40 }, (_, i) =>
  `phr-${String(i + 1).padStart(3, '0')}`,
);
