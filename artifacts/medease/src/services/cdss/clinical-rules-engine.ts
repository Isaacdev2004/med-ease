import type { AlertSeverity, AlertType, ClinicalAlert, ClinicalRule } from '@/services/cdss/types';

const SEVERITY_WEIGHT: Record<AlertSeverity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

export function alertPriority(alert: ClinicalAlert): number {
  let score = SEVERITY_WEIGHT[alert.severity] * 10;
  if (alert.status === 'active') score += 5;
  if (alert.type === 'interaction' || alert.type === 'allergy') score += 3;
  return score;
}

export function sortAlertsByPriority(alerts: ClinicalAlert[]): ClinicalAlert[] {
  return [...alerts].sort((a, b) => alertPriority(b) - alertPriority(a));
}

export function evaluateRules(
  rules: ClinicalRule[],
  context: { alertType?: AlertType; facilityId?: string },
): ClinicalRule[] {
  return rules.filter((r) => {
    if (!r.enabled) return false;
    if (context.facilityId && r.facilityId && r.facilityId !== context.facilityId) return false;
    if (context.alertType && r.category !== context.alertType) return false;
    return true;
  });
}

export function matchAbnormalLab(value: number, low: number, high: number): boolean {
  return value < low || value > high;
}

export function requiresRenalDoseAdjustment(creatinineClearance: number): boolean {
  return creatinineClearance < 60;
}

export function requiresHepaticDoseAdjustment(altRatio: number): boolean {
  return altRatio > 3;
}
