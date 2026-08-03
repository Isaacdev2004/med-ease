import type { QueryParams } from '@workspace/repository-transport';
import type {
  AlertSeverity,
  AlertStatus,
  BatteryStatus,
  DeviceAssignment,
  DeviceStatus,
  EarlyWarningScore,
  MonitoringAlert,
  MonitoringContext,
  MonitoringDashboard,
  MonitoringDevice,
  MonitoringFilters,
  Observation,
  ObservationCategory,
  ObservationTimelineEntry,
  RemoteMonitoringProgram,
  RPMProgramStatus,
  VitalSign,
  VitalType,
} from '@/services/patient-monitoring/types';

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asValue(value: unknown): number | string {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return asString(value);
}

export function monitoringFiltersToQuery(
  filters?: MonitoringFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    category: filters.category,
    metric: filters.metric,
    context: filters.context,
    status: filters.status,
    severity: filters.severity,
    from: filters.from,
    to: filters.to,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function mapVitalSign(dto: unknown): VitalSign {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    type: asString(row.type, 'heart_rate') as VitalType,
    value: asValue(row.value),
    unit: asString(row.unit),
    recordedAt: asString(row.recordedAt),
    context: asString(row.context, 'home') as MonitoringContext,
    deviceId: asOptionalString(row.deviceId),
    recordedBy: asOptionalString(row.recordedBy),
    status: asString(row.status, 'normal') as VitalSign['status'],
    systolic: asOptionalNumber(row.systolic),
    diastolic: asOptionalNumber(row.diastolic),
  };
}

export function mapVitalSignArray(dto: unknown): VitalSign[] {
  return Array.isArray(dto) ? dto.map(mapVitalSign) : [];
}

export function mapPaginatedVitals(
  dto: unknown,
): PaginatedResult<VitalSign> {
  const row = asRecord(dto);
  return {
    items: mapVitalSignArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapObservation(dto: unknown): Observation {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    category: asString(row.category, 'vital-signs') as ObservationCategory,
    code: asString(row.code),
    display: asString(row.display),
    value: asValue(row.value),
    unit: asString(row.unit),
    recordedAt: asString(row.recordedAt),
    context: asString(row.context, 'home') as MonitoringContext,
    deviceId: asOptionalString(row.deviceId),
    sessionId: asOptionalString(row.sessionId),
    status: asString(row.status, 'final') as Observation['status'],
    interpretation: asOptionalString(row.interpretation) as
      | Observation['interpretation']
      | undefined,
    referenceRange: asOptionalString(row.referenceRange),
    recordedBy: asOptionalString(row.recordedBy),
    notes: asOptionalString(row.notes),
    carePlanId: asOptionalString(row.carePlanId),
    appointmentId: asOptionalString(row.appointmentId),
  };
}

export function mapObservationArray(dto: unknown): Observation[] {
  return Array.isArray(dto) ? dto.map(mapObservation) : [];
}

export function mapPaginatedObservations(
  dto: unknown,
): PaginatedResult<Observation> {
  const row = asRecord(dto);
  return {
    items: mapObservationArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapMonitoringAlert(dto: unknown): MonitoringAlert {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    type: asString(row.type, 'threshold') as MonitoringAlert['type'],
    severity: asString(row.severity, 'warning') as AlertSeverity,
    status: asString(row.status, 'active') as AlertStatus,
    title: asString(row.title),
    message: asString(row.message),
    metric: asOptionalString(row.metric) as VitalType | undefined,
    value:
      row.value !== undefined && row.value !== null
        ? asValue(row.value)
        : undefined,
    threshold: asOptionalString(row.threshold),
    createdAt: asString(row.createdAt),
    acknowledgedAt: asOptionalString(row.acknowledgedAt),
    acknowledgedBy: asOptionalString(row.acknowledgedBy),
    resolvedAt: asOptionalString(row.resolvedAt),
    observationId: asOptionalString(row.observationId),
    deviceId: asOptionalString(row.deviceId),
  };
}

export function mapMonitoringAlertArray(dto: unknown): MonitoringAlert[] {
  return Array.isArray(dto) ? dto.map(mapMonitoringAlert) : [];
}

export function mapPaginatedAlerts(
  dto: unknown,
): PaginatedResult<MonitoringAlert> {
  const row = asRecord(dto);
  return {
    items: mapMonitoringAlertArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapMonitoringDevice(dto: unknown): MonitoringDevice {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    name: asString(row.name),
    manufacturer: asString(row.manufacturer),
    model: asString(row.model),
    type: asString(row.type, 'home') as MonitoringDevice['type'],
    serialNumber: asString(row.serialNumber),
    status: asString(row.status, 'online') as DeviceStatus,
    battery: asString(row.battery, 'unknown') as BatteryStatus,
    batteryPercent: asOptionalNumber(row.batteryPercent),
    lastSyncAt: asOptionalString(row.lastSyncAt),
    firmwareVersion: asOptionalString(row.firmwareVersion),
    calibrationDue: asOptionalString(row.calibrationDue),
    supportedMetrics: asStringArray(row.supportedMetrics) as VitalType[],
  };
}

export function mapMonitoringDeviceArray(dto: unknown): MonitoringDevice[] {
  return Array.isArray(dto) ? dto.map(mapMonitoringDevice) : [];
}

export function mapDeviceAssignment(dto: unknown): DeviceAssignment {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    deviceId: asString(row.deviceId),
    patientId: asString(row.patientId),
    assignedAt: asString(row.assignedAt),
    assignedBy: asString(row.assignedBy),
    unassignedAt: asOptionalString(row.unassignedAt),
    programId: asOptionalString(row.programId),
    active: asBoolean(row.active, true),
  };
}

export function mapRemoteMonitoringProgram(
  dto: unknown,
): RemoteMonitoringProgram {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    name: asString(row.name),
    status: asString(row.status, 'active') as RPMProgramStatus,
    enrolledAt: asString(row.enrolledAt),
    enrolledBy: asString(row.enrolledBy),
    deviceIds: asStringArray(row.deviceIds),
    metrics: asStringArray(row.metrics) as VitalType[],
    frequency: asString(row.frequency),
    clinicianId: asString(row.clinicianId),
    clinicianName: asString(row.clinicianName),
    carePlanId: asOptionalString(row.carePlanId),
    completedAt: asOptionalString(row.completedAt),
  };
}

export function mapRemoteMonitoringProgramArray(
  dto: unknown,
): RemoteMonitoringProgram[] {
  return Array.isArray(dto) ? dto.map(mapRemoteMonitoringProgram) : [];
}

export function mapEarlyWarningScore(dto: unknown): EarlyWarningScore {
  const row = asRecord(dto);
  const components =
    row.components && typeof row.components === 'object'
      ? (row.components as Record<string, number>)
      : {};
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    type: asString(row.type, 'NEWS2') as EarlyWarningScore['type'],
    score: asNumber(row.score),
    riskLevel: asString(row.riskLevel, 'low') as EarlyWarningScore['riskLevel'],
    components,
    calculatedAt: asString(row.calculatedAt),
    context: asString(row.context, 'ward') as MonitoringContext,
  };
}

export function mapEarlyWarningScoreArray(dto: unknown): EarlyWarningScore[] {
  return Array.isArray(dto) ? dto.map(mapEarlyWarningScore) : [];
}

export function mapTimelineEntry(dto: unknown): ObservationTimelineEntry {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    date: asString(row.date),
    type: asString(row.type, 'observation') as ObservationTimelineEntry['type'],
    title: asString(row.title),
    description: asString(row.description),
    severity: asOptionalString(row.severity) as AlertSeverity | undefined,
    actor: asOptionalString(row.actor),
  };
}

export function mapTimelineEntryArray(
  dto: unknown,
): ObservationTimelineEntry[] {
  return Array.isArray(dto) ? dto.map(mapTimelineEntry) : [];
}

export function mapMonitoringDashboard(dto: unknown): MonitoringDashboard {
  const row = asRecord(dto);
  return {
    patientId: asOptionalString(row.patientId),
    activePatients: asNumber(row.activePatients),
    rpmEnrollments: asNumber(row.rpmEnrollments),
    activeAlerts: asNumber(row.activeAlerts),
    criticalAlerts: asNumber(row.criticalAlerts),
    averageNews2: asNumber(row.averageNews2),
    averageMews: asNumber(row.averageMews),
    deviceUtilization: asNumber(row.deviceUtilization),
    monitoringCompliance: asNumber(row.monitoringCompliance),
    missedReadings: asNumber(row.missedReadings),
    batteryHealth: asNumber(row.batteryHealth),
    alertResponseMinutes: asNumber(row.alertResponseMinutes),
    recentObservations: mapObservationArray(row.recentObservations),
    recentAlerts: mapMonitoringAlertArray(row.recentAlerts),
    activeSessions: asNumber(row.activeSessions),
  };
}
