import type {
  AlertSeverity,
  AlertStatus,
  BatteryStatus,
  DeviceAssignment,
  DeviceStatus,
  EarlyWarningScore,
  MonitoringAlert,
  MonitoringContext,
  MonitoringDevice,
  Observation,
  ObservationCategory,
  RemoteMonitoringProgram,
  RPMProgramStatus,
  VitalSign,
  VitalType,
} from '@medease/monitoring-contract';
import type { Prisma } from '@medease/prisma';

const OBSERVATION_CATEGORIES: ObservationCategory[] = [
  'vital-signs',
  'activity',
  'symptom',
  'survey',
  'device',
  'laboratory',
  'imaging',
  'medication-response',
];

const VITAL_TYPES: VitalType[] = [
  'blood_pressure',
  'heart_rate',
  'respiratory_rate',
  'temperature',
  'spo2',
  'blood_glucose',
  'weight',
  'bmi',
  'ecg_summary',
  'pain_score',
  'fall_risk',
];

export function mapObservationCategory(value: string): ObservationCategory {
  const normalized = value.trim().toLowerCase().replace(/_/g, '-');
  return (
    OBSERVATION_CATEGORIES.find((c) => c === normalized) ?? 'vital-signs'
  );
}

export function mapVitalType(value: string): VitalType | undefined {
  const normalized = value.trim().toLowerCase().replace(/-/g, '_');
  return VITAL_TYPES.find((t) => t === normalized);
}

export function mapMonitoringContext(value: string): MonitoringContext {
  switch (value) {
    case 'home':
    case 'ward':
    case 'telemonitoring':
    case 'outpatient':
    case 'rpm':
      return value;
    default:
      return 'home';
  }
}

export function mapDeviceStatus(status: string): DeviceStatus {
  switch (status) {
    case 'online':
    case 'offline':
    case 'syncing':
    case 'error':
    case 'maintenance':
      return status;
    default:
      return 'online';
  }
}

export function mapBatteryStatus(status: string): BatteryStatus {
  switch (status) {
    case 'full':
    case 'good':
    case 'low':
    case 'critical':
    case 'unknown':
      return status;
    default:
      return 'unknown';
  }
}

export function mapAlertSeverity(severity: string): AlertSeverity {
  switch (severity) {
    case 'info':
    case 'warning':
    case 'critical':
    case 'urgent':
      return severity;
    default:
      return 'warning';
  }
}

export function mapAlertStatus(status: string): AlertStatus {
  switch (status) {
    case 'active':
    case 'acknowledged':
    case 'resolved':
    case 'dismissed':
      return status;
    default:
      return 'active';
  }
}

export function mapRpmStatus(status: string): RPMProgramStatus {
  switch (status) {
    case 'active':
    case 'paused':
    case 'completed':
    case 'pending':
      return status;
    default:
      return 'active';
  }
}

function mapStoredValue(
  valueText: string,
  valueNumeric: number | null | undefined,
): number | string {
  if (valueNumeric != null && !Number.isNaN(valueNumeric)) {
    return valueNumeric;
  }
  const parsed = Number(valueText);
  if (valueText.trim() !== '' && !Number.isNaN(parsed) && String(parsed) === valueText.trim()) {
    return parsed;
  }
  return valueText;
}

function parseComponents(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === 'number' && !Number.isNaN(raw)) {
      out[key] = raw;
    }
  }
  return out;
}

function mapSupportedMetrics(values: string[]): VitalType[] {
  const out: VitalType[] = [];
  for (const value of values) {
    const mapped = mapVitalType(value);
    if (mapped) out.push(mapped);
  }
  return out;
}

function mapProgramMetrics(values: string[]): VitalType[] {
  return mapSupportedMetrics(values);
}

export function mapVital(
  row: Prisma.MonitoringVitalGetPayload<object>,
): VitalSign {
  return {
    id: row.id,
    patientId: row.patientId,
    type: mapVitalType(row.type) ?? 'heart_rate',
    value: mapStoredValue(row.valueText, row.valueNumeric),
    unit: row.unit,
    recordedAt: row.recordedAt.toISOString(),
    context: mapMonitoringContext(row.context),
    deviceId: row.deviceId ?? undefined,
    recordedBy: row.recordedBy ?? undefined,
    status:
      row.status === 'warning' || row.status === 'critical'
        ? row.status
        : 'normal',
    systolic: row.systolic ?? undefined,
    diastolic: row.diastolic ?? undefined,
  };
}

export function mapObservation(
  row: Prisma.MonitoringObservationGetPayload<object>,
): Observation {
  return {
    id: row.id,
    patientId: row.patientId,
    category: mapObservationCategory(row.category),
    code: row.code,
    display: row.display,
    value: mapStoredValue(row.valueText, row.valueNumeric),
    unit: row.unit,
    recordedAt: row.recordedAt.toISOString(),
    context: mapMonitoringContext(row.context),
    deviceId: row.deviceId ?? undefined,
    sessionId: row.sessionId ?? undefined,
    status:
      row.status === 'preliminary' || row.status === 'amended'
        ? row.status
        : 'final',
    interpretation:
      row.interpretation === 'abnormal' || row.interpretation === 'critical'
        ? row.interpretation
        : row.interpretation === 'normal'
          ? 'normal'
          : undefined,
    referenceRange: row.referenceRange ?? undefined,
    recordedBy: row.recordedBy ?? undefined,
    notes: row.notes ?? undefined,
    carePlanId: row.carePlanId ?? undefined,
    appointmentId: row.appointmentId ?? undefined,
  };
}

export function mapDevice(
  row: Prisma.MonitoringDeviceGetPayload<object>,
): MonitoringDevice {
  return {
    id: row.id,
    name: row.name,
    manufacturer: row.manufacturer,
    model: row.model,
    type:
      row.type === 'wearable' ||
      row.type === 'bedside' ||
      row.type === 'mobile' ||
      row.type === 'gateway'
        ? row.type
        : 'home',
    serialNumber: row.serialNumber,
    status: mapDeviceStatus(row.status),
    battery: mapBatteryStatus(row.battery),
    batteryPercent: row.batteryPercent ?? undefined,
    lastSyncAt: row.lastSyncAt?.toISOString(),
    firmwareVersion: row.firmwareVersion ?? undefined,
    calibrationDue: row.calibrationDue?.toISOString(),
    supportedMetrics: mapSupportedMetrics(row.supportedMetrics),
  };
}

export function mapAssignment(
  row: Prisma.DeviceAssignmentGetPayload<object>,
): DeviceAssignment {
  return {
    id: row.id,
    deviceId: row.deviceId,
    patientId: row.patientId,
    assignedAt: row.assignedAt.toISOString(),
    assignedBy: row.assignedBy,
    unassignedAt: row.unassignedAt?.toISOString(),
    programId: row.programId ?? undefined,
    active: row.active,
  };
}

export function mapAlert(
  row: Prisma.MonitoringAlertGetPayload<object>,
): MonitoringAlert {
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    type:
      row.type === 'threshold' ||
      row.type === 'missed_reading' ||
      row.type === 'device_offline' ||
      row.type === 'battery_low' ||
      row.type === 'escalation' ||
      row.type === 'clinical'
        ? row.type
        : 'clinical',
    severity: mapAlertSeverity(row.severity),
    status: mapAlertStatus(row.status),
    title: row.title,
    message: row.message,
    metric: row.metric ? mapVitalType(row.metric) : undefined,
    value: row.valueText ?? undefined,
    threshold: row.threshold ?? undefined,
    createdAt: row.createdAt.toISOString(),
    acknowledgedAt: row.acknowledgedAt?.toISOString(),
    acknowledgedBy: row.acknowledgedBy ?? undefined,
    resolvedAt: row.resolvedAt?.toISOString(),
    observationId: row.observationId ?? undefined,
    deviceId: row.deviceId ?? undefined,
  };
}

export function mapProgram(
  row: Prisma.MonitoringProgramGetPayload<object>,
): RemoteMonitoringProgram {
  return {
    id: row.id,
    patientId: row.patientId,
    name: row.name,
    status: mapRpmStatus(row.status),
    enrolledAt: row.enrolledAt.toISOString(),
    enrolledBy: row.enrolledBy,
    deviceIds: row.deviceIds,
    metrics: mapProgramMetrics(row.metrics),
    frequency: row.frequency,
    clinicianId: row.clinicianId,
    clinicianName: row.clinicianName,
    carePlanId: row.carePlanId ?? undefined,
    completedAt: row.completedAt?.toISOString(),
  };
}

export function mapEarlyWarningScore(
  row: Prisma.EarlyWarningScoreGetPayload<object>,
): EarlyWarningScore {
  return {
    id: row.id,
    patientId: row.patientId,
    type: row.type === 'MEWS' ? 'MEWS' : 'NEWS2',
    score: row.score,
    riskLevel:
      row.riskLevel === 'medium' ||
      row.riskLevel === 'high' ||
      row.riskLevel === 'critical'
        ? row.riskLevel
        : 'low',
    components: parseComponents(row.components),
    calculatedAt: row.calculatedAt.toISOString(),
    context: mapMonitoringContext(row.context),
  };
}

export function splitValue(value: number | string): {
  valueText: string;
  valueNumeric: number | null;
} {
  if (typeof value === 'number') {
    return { valueText: String(value), valueNumeric: value };
  }
  const trimmed = value.trim();
  const parsed = Number(trimmed);
  if (trimmed !== '' && !Number.isNaN(parsed)) {
    return { valueText: trimmed, valueNumeric: parsed };
  }
  return { valueText: value, valueNumeric: null };
}
