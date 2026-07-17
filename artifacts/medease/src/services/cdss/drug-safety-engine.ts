import type {
  DrugInteractionAlert,
  DrugSafetyType,
} from '@/services/cdss/types';

export function drugSafetySeverity(
  type: DrugSafetyType,
  score: number,
): 'info' | 'low' | 'medium' | 'high' | 'critical' {
  if (type === 'allergy' || type === 'contraindication')
    return score > 7 ? 'critical' : 'high';
  if (type === 'black_box') return 'critical';
  if (type === 'interaction')
    return score > 6 ? 'high' : score > 3 ? 'medium' : 'low';
  return score > 5 ? 'medium' : 'low';
}

export function sortDrugAlertsBySeverity(
  alerts: DrugInteractionAlert[],
): DrugInteractionAlert[] {
  const weight = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
  return [...alerts].sort((a, b) => weight[b.severity] - weight[a.severity]);
}

export function hasDuplicateTherapeuticClass(
  medications: string[],
  classMap: Record<string, string>,
): boolean {
  const classes = medications.map((m) => classMap[m]).filter(Boolean);
  return new Set(classes).size < classes.length;
}
