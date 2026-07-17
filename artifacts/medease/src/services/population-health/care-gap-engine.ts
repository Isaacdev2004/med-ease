import type {
  CareGap,
  CareGapType,
  PopulationMember,
  RiskTier,
} from '@/services/population-health/types';

const GAP_RULES: Record<
  CareGapType,
  { title: string; monthsInterval: number }
> = {
  annual_checkup: { title: 'Annual wellness visit', monthsInterval: 12 },
  vaccination: { title: 'Recommended vaccination', monthsInterval: 12 },
  colonoscopy: { title: 'Colonoscopy screening', monthsInterval: 120 },
  mammogram: { title: 'Mammogram screening', monthsInterval: 24 },
  pap_smear: { title: 'Pap smear screening', monthsInterval: 36 },
  eye_exam: { title: 'Diabetic eye exam', monthsInterval: 12 },
  hba1c: { title: 'HbA1c lab test', monthsInterval: 6 },
  lipid_profile: { title: 'Lipid profile', monthsInterval: 12 },
  medication_review: { title: 'Medication therapy review', monthsInterval: 12 },
  follow_up: { title: 'Follow-up appointment', monthsInterval: 3 },
};

export function detectCareGap(
  member: PopulationMember,
  type: CareGapType,
): boolean {
  if (!member.lastVisit && type !== 'vaccination') return true;
  if (
    member.primaryCondition === 'Diabetes' &&
    ['eye_exam', 'hba1c'].includes(type)
  )
    return member.openGaps > 0;
  if (member.age >= 50 && type === 'colonoscopy') return member.openGaps > 1;
  return member.openGaps > 0 && type === 'annual_checkup';
}

export function gapPriority(gap: CareGap): number {
  const weights = { high: 3, medium: 2, low: 1 };
  return weights[gap.priority] + Math.min(gap.daysOverdue / 30, 5);
}

export function getGapRule(type: CareGapType) {
  return GAP_RULES[type];
}

export function stratifyRisk(score: number): RiskTier {
  if (score >= 8) return 'high';
  if (score >= 6) return 'rising';
  if (score >= 4) return 'moderate';
  return 'low';
}
