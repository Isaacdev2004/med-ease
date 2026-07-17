import type {
  BiomedicalDevice,
  CalibrationRecord,
  CalibrationStatus,
} from '@/services/facilities/types';

export function getCalibrationStatus(nextDue: string): CalibrationStatus {
  const days = Math.ceil(
    (new Date(nextDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (days < 0) return 'overdue';
  if (days <= 14) return 'due';
  return 'valid';
}

export function complianceRate(records: CalibrationRecord[]): number {
  if (!records.length) return 100;
  const compliant = records.filter((r) => r.status === 'valid').length;
  return Math.round((compliant / records.length) * 100);
}

export function expiringCalibrations(
  devices: BiomedicalDevice[],
  withinDays = 30,
): BiomedicalDevice[] {
  const cutoff = Date.now() + withinDays * 24 * 60 * 60 * 1000;
  return devices.filter(
    (d) => d.calibrationDue && new Date(d.calibrationDue).getTime() <= cutoff,
  );
}

export function validateBiomedicalDevice(device: BiomedicalDevice): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (device.status === 'out_of_service') issues.push('Device out of service');
  if (device.calibrationDue && new Date(device.calibrationDue) < new Date())
    issues.push('Calibration overdue');
  if (device.deviceClass === 'class_iii' && !device.lastCalibration)
    issues.push('Class III requires calibration record');
  return { valid: issues.length === 0, issues };
}

export function renewCalibration(
  record: CalibrationRecord,
  extensionDays = 365,
): CalibrationRecord {
  const next = new Date(record.performedDate);
  next.setDate(next.getDate() + extensionDays);
  return { ...record, nextDue: next.toISOString(), status: 'valid' };
}
