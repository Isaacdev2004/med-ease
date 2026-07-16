import type { AccreditationStandard } from '@/services/quality/types';

export function accreditationReadiness(standards: AccreditationStandard[]): number {
  if (!standards.length) return 0;
  return Math.round(standards.reduce((s, st) => s + st.complianceScore, 0) / standards.length);
}

export function gapAnalysis(standards: AccreditationStandard[]) {
  return standards
    .filter((s) => s.gapCount > 0)
    .map((s) => ({ standardId: s.standardId, code: s.code, title: s.title, gaps: s.gapCount, score: s.complianceScore }));
}

export function frameworkScore(standards: AccreditationStandard[], framework: AccreditationStandard['framework']): number {
  const items = standards.filter((s) => s.framework === framework);
  if (!items.length) return 0;
  return Math.round(items.reduce((s, i) => s + i.complianceScore, 0) / items.length);
}
