import type {
  MonitoringAlert,
  MonitoringDevice,
  Observation,
  RemoteMonitoringProgram,
} from '@/services/patient-monitoring/types';

type MonitoringNotification = {
  id: string;
  title: string;
  message: string;
  type: 'monitoring';
  priority: 'low' | 'normal' | 'high' | 'urgent';
};

export function buildCriticalVitalsNotification(
  alert: MonitoringAlert,
): MonitoringNotification {
  return {
    id: `notif-vital-${alert.id}`,
    title: alert.title,
    message: alert.message,
    type: 'monitoring',
    priority: alert.severity === 'urgent' ? 'urgent' : 'high',
  };
}

export function buildMissedReadingNotification(
  patientId: string,
  hours: number,
): MonitoringNotification {
  return {
    id: `notif-missed-${patientId}`,
    title: 'Missed monitoring reading',
    message: `No readings received in ${hours} hours`,
    type: 'monitoring',
    priority: hours >= 72 ? 'high' : 'normal',
  };
}

export function buildDeviceDisconnectedNotification(
  device: MonitoringDevice,
): MonitoringNotification {
  return {
    id: `notif-device-${device.id}`,
    title: 'Device disconnected',
    message: `${device.name} is offline`,
    type: 'monitoring',
    priority: 'high',
  };
}

export function buildBatteryLowNotification(
  device: MonitoringDevice,
): MonitoringNotification {
  return {
    id: `notif-battery-${device.id}`,
    title: 'Low device battery',
    message: `${device.name} battery at ${device.batteryPercent ?? 0}%`,
    type: 'monitoring',
    priority: device.battery === 'critical' ? 'urgent' : 'normal',
  };
}

export function buildMonitoringReminderNotification(
  metric: string,
  dueAt: string,
): MonitoringNotification {
  return {
    id: `notif-reminder-${metric}-${dueAt}`,
    title: 'Monitoring reminder',
    message: `Time to record your ${metric.replace(/_/g, ' ')}`,
    type: 'monitoring',
    priority: 'normal',
  };
}

export function buildClinicalEscalationNotification(
  alert: MonitoringAlert,
): MonitoringNotification {
  return {
    id: `notif-escalation-${alert.id}`,
    title: 'Clinical escalation',
    message: alert.message,
    type: 'monitoring',
    priority: 'urgent',
  };
}

export function buildRPMEnrollmentNotification(
  program: RemoteMonitoringProgram,
): MonitoringNotification {
  return {
    id: `notif-rpm-${program.id}`,
    title: 'RPM enrollment confirmed',
    message: `Enrolled in ${program.name} — ${program.frequency} monitoring`,
    type: 'monitoring',
    priority: 'normal',
  };
}

export function buildMonitoringCompletedNotification(
  program: RemoteMonitoringProgram,
): MonitoringNotification {
  return {
    id: `notif-rpm-complete-${program.id}`,
    title: 'Monitoring program completed',
    message: `${program.name} has been completed`,
    type: 'monitoring',
    priority: 'low',
  };
}

export function buildObservationRecordedNotification(
  observation: Observation,
): MonitoringNotification {
  return {
    id: `notif-obs-${observation.id}`,
    title: 'Observation recorded',
    message: `${observation.display}: ${observation.value} ${observation.unit}`,
    type: 'monitoring',
    priority: observation.interpretation === 'critical' ? 'urgent' : 'normal',
  };
}
