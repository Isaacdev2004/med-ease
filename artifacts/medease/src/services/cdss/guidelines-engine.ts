import type { Guideline, GuidelineSource } from '@/services/cdss/types';

export function filterGuidelinesBySource(
  guidelines: Guideline[],
  source?: GuidelineSource,
): Guideline[] {
  if (!source) return guidelines;
  return guidelines.filter((g) => g.source === source);
}

export function sortGuidelinesByCompliance(
  guidelines: Guideline[],
): Guideline[] {
  return [...guidelines].sort((a, b) => b.complianceRate - a.complianceRate);
}

export function lookupGuidelineForCondition(
  guidelines: Guideline[],
  condition: string,
): Guideline | undefined {
  const lower = condition.toLowerCase();
  return guidelines.find(
    (g) =>
      g.condition.toLowerCase().includes(lower) ||
      g.title.toLowerCase().includes(lower),
  );
}

export const GUIDELINE_SOURCES: GuidelineSource[] = [
  'nice',
  'who',
  'cdc',
  'aha',
  'esc',
  'ada',
  'kdigo',
  'idsa',
  'local',
];
