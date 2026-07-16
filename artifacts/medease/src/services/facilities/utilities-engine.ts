import type { EnvironmentalReading, UtilitySystem, UtilityStatus } from '@/services/facilities/types';

export function evaluateUtilityStatus(reading: number, threshold: number): UtilityStatus {
  if (reading >= threshold * 1.2) return 'critical';
  if (reading >= threshold) return 'warning';
  return 'normal';
}

export function aggregateUtilityAlerts(utilities: UtilitySystem[]): UtilitySystem[] {
  return utilities.filter((u) => u.status !== 'normal');
}

export function generatorStatus(isOnline: boolean, fuelPercent: number): UtilityStatus {
  if (!isOnline) return 'offline';
  if (fuelPercent < 20) return 'critical';
  if (fuelPercent < 40) return 'warning';
  return 'normal';
}

export function hvacEfficiency(temp: number, target: number): number {
  const diff = Math.abs(temp - target);
  return Math.max(0, 100 - diff * 10);
}

export function environmentalAlarm(reading: EnvironmentalReading): boolean {
  return reading.status === 'critical' || reading.status === 'warning';
}

export function medicalGasPressureStatus(kPa: number): UtilityStatus {
  if (kPa < 300 || kPa > 500) return 'critical';
  if (kPa < 350 || kPa > 450) return 'warning';
  return 'normal';
}
