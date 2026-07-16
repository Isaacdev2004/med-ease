export type ClassificationLevel = 'public' | 'internal' | 'confidential' | 'restricted';

export function classifyDocument(module: string, patientId?: string): ClassificationLevel {
  if (patientId) return 'restricted';
  if (['finance', 'workforce', 'research'].includes(module)) return 'confidential';
  if (['quality', 'facilities'].includes(module)) return 'internal';
  return 'internal';
}

export function classificationLabel(level: ClassificationLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}
