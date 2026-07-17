import type { DepartmentScorecard } from '@/services/executive/types';

export const DEPARTMENTS = [
  'Emergency',
  'Surgery',
  'Medicine',
  'ICU',
  'Radiology',
  'Laboratory',
  'Pharmacy',
  'Cardiology',
  'Oncology',
  'Pediatrics',
  'Obstetrics',
  'Rehabilitation',
];

export function overallScorecardScore(card: DepartmentScorecard): number {
  return Math.round(
    (card.clinicalScore +
      card.operationalScore +
      card.financialScore +
      card.qualityScore) /
      4,
  );
}

export function scorecardGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
