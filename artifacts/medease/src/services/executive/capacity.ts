import type { CapacitySnapshot } from '@/services/executive/types';

export const CAPACITY_UNITS = ['Medical/Surgical', 'ICU', 'ED', 'Pediatrics', 'Obstetrics', 'Rehab', 'Psychiatric'];

export function aggregateOccupancy(snapshots: CapacitySnapshot[]): number {
  if (snapshots.length === 0) return 0;
  const total = snapshots.reduce((s, c) => s + c.totalBeds, 0);
  const occupied = snapshots.reduce((s, c) => s + c.occupiedBeds, 0);
  return Math.round((occupied / Math.max(total, 1)) * 100);
}

export function capacityStatus(rate: number): 'normal' | 'elevated' | 'critical' {
  if (rate >= 95) return 'critical';
  if (rate >= 85) return 'elevated';
  return 'normal';
}
