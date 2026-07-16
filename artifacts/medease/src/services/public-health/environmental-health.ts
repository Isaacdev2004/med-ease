import type { EnvironmentalInspection } from '@/services/public-health/types';

export function inspectionPassRate(inspections: EnvironmentalInspection[]): number {
  if (inspections.length === 0) return 100;
  const passed = inspections.filter((i) => i.status === 'passed').length;
  return Math.round((passed / inspections.length) * 100);
}

export function requiresFollowUp(inspection: EnvironmentalInspection): boolean {
  return inspection.status === 'failed' || inspection.status === 'follow_up_required';
}
