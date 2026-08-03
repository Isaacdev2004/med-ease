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
export type DeviceStatus =
  | 'online'
  | 'offline'
  | 'syncing'
  | 'error'
  | 'maintenance';
export type BatteryStatus = 'full' | 'good' | 'low' | 'critical' | 'unknown';
export type MonitoringContext =
  | 'home'
  | 'ward'
  | 'telemonitoring'
  | 'outpatient'
  | 'rpm';
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
  type:
    | 'threshold'
    | 'missed_reading'
    | 'device_offline'
    | 'battery_low'
    | 'escalation'
    | 'clinical';
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

export interface VitalListResult {
  items: VitalSign[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ObservationListResult {
  items: Observation[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AlertListResult {
  items: MonitoringAlert[];
  total: number;
  page: number;
  pageSize: number;
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
