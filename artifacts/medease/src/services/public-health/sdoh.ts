import type { SdohAssessment, SdohDomain } from '@/services/public-health/types';

export const SDOH_DOMAINS: SdohDomain[] = ['housing', 'food', 'transportation', 'employment', 'education', 'social_support', 'safety'];

export function sdohRiskLevel(score: number): 'low' | 'moderate' | 'high' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

export function interventionRate(assessments: SdohAssessment[]): number {
  if (assessments.length === 0) return 0;
  const needed = assessments.filter((a) => a.interventionNeeded).length;
  return Math.round((needed / assessments.length) * 100);
}

export function toFhirQuestionnaireResponse(assessment: SdohAssessment) {
  return {
    resourceType: 'QuestionnaireResponse',
    id: assessment.assessmentId,
    status: 'completed',
    subject: { reference: `Patient/${assessment.patientId}` },
    authored: assessment.assessedAt,
  };
}
