import type {
  MonitoringAlert,
  MonitoringDevice,
  Observation,
  VitalSign,
} from '@/services/patient-monitoring/types';

export function detectThresholdAlert(
  vital: VitalSign,
  patientName: string,
): MonitoringAlert | null {
  if (vital.status === 'normal') return null;
  return {
    id: `alert-threshold-${vital.id}`,
    patientId: vital.patientId,
    patientName,
    type: 'threshold',
    severity: vital.status === 'critical' ? 'critical' : 'warning',
    status: 'active',
    title: `${vital.type.replace(/_/g, ' ')} out of range`,
    message: `Value ${vital.value} ${vital.unit} recorded at ${new Date(vital.recordedAt).toLocaleString()}`,
    metric: vital.type,
    value: vital.value,
    createdAt: new Date().toISOString(),
    deviceId: vital.deviceId,
  };
}

export function detectMissedReadingAlert(
  patientId: string,
  patientName: string,
  hoursSinceLastReading: number,
): MonitoringAlert | null {
  if (hoursSinceLastReading < 24) return null;
  return {
    id: `alert-missed-${patientId}-${Date.now()}`,
    patientId,
    patientName,
    type: 'missed_reading',
    severity: hoursSinceLastReading >= 72 ? 'critical' : 'warning',
    status: 'active',
    title: 'Missed monitoring reading',
    message: `No readings received in ${Math.round(hoursSinceLastReading)} hours`,
    createdAt: new Date().toISOString(),
  };
}

export function detectDeviceOfflineAlert(
  device: MonitoringDevice,
  patientId: string,
  patientName: string,
): MonitoringAlert | null {
  if (device.status !== 'offline' && device.status !== 'error') return null;
  return {
    id: `alert-device-${device.id}`,
    patientId,
    patientName,
    type: 'device_offline',
    severity: device.status === 'error' ? 'critical' : 'warning',
    status: 'active',
    title: 'Device disconnected',
    message: `${device.name} is ${device.status}`,
    createdAt: new Date().toISOString(),
    deviceId: device.id,
  };
}

export function detectBatteryAlert(
  device: MonitoringDevice,
  patientId: string,
  patientName: string,
): MonitoringAlert | null {
  if (device.battery !== 'low' && device.battery !== 'critical') return null;
  return {
    id: `alert-battery-${device.id}`,
    patientId,
    patientName,
    type: 'battery_low',
    severity: device.battery === 'critical' ? 'critical' : 'warning',
    status: 'active',
    title: 'Low device battery',
    message: `${device.name} battery at ${device.batteryPercent ?? 0}%`,
    createdAt: new Date().toISOString(),
    deviceId: device.id,
  };
}

export function detectEscalationAlert(
  patientId: string,
  patientName: string,
  activeAlertCount: number,
): MonitoringAlert | null {
  if (activeAlertCount < 3) return null;
  return {
    id: `alert-escalation-${patientId}`,
    patientId,
    patientName,
    type: 'escalation',
    severity: 'urgent',
    status: 'active',
    title: 'Clinical escalation required',
    message: `${activeAlertCount} active monitoring alerts require clinician review`,
    createdAt: new Date().toISOString(),
  };
}

export function scoreAlertRisk(alerts: MonitoringAlert[]): number {
  const weights = { info: 1, warning: 3, critical: 8, urgent: 10 };
  return alerts.reduce((s, a) => s + (weights[a.severity] ?? 1), 0);
}

export function evaluateObservationAlerts(
  observation: Observation,
  patientName: string,
): MonitoringAlert | null {
  if (
    observation.interpretation !== 'critical' &&
    observation.interpretation !== 'abnormal'
  )
    return null;
  return {
    id: `alert-obs-${observation.id}`,
    patientId: observation.patientId,
    patientName,
    type: 'clinical',
    severity:
      observation.interpretation === 'critical' ? 'critical' : 'warning',
    status: 'active',
    title: `Abnormal ${observation.display}`,
    message: `${observation.value} ${observation.unit}`,
    value: observation.value,
    createdAt: new Date().toISOString(),
    observationId: observation.id,
    deviceId: observation.deviceId,
  };
}
