import type {
  ClinicalRecommendation,
  RecommendationStatus,
} from '@/services/ai-intelligence/types';

export const RECOMMENDATION_CATEGORIES = [
  'Medication Optimization',
  'Care Pathway',
  'Diagnostic Workup',
  'Preventive Care',
  'Referral',
  'Monitoring',
] as const;

export function recommendationPriority(
  category: string,
): ClinicalRecommendation['priority'] {
  if (category.includes('Diagnostic') || category.includes('Monitoring'))
    return 'high';
  if (category.includes('Preventive')) return 'medium';
  return 'low';
}

export function acceptanceRate(
  recommendations: ClinicalRecommendation[],
): number {
  const decided = recommendations.filter(
    (r) => r.status === 'accepted' || r.status === 'rejected',
  );
  if (decided.length === 0) return 0;
  const accepted = decided.filter((r) => r.status === 'accepted').length;
  return Math.round((accepted / decided.length) * 100);
}

export function applyRating(
  status: RecommendationStatus,
  rating: number,
): RecommendationStatus {
  if (rating >= 4) return status === 'pending' ? 'accepted' : status;
  if (rating <= 2) return 'rejected';
  return status;
}

export function toFhirDetectedIssue(rec: ClinicalRecommendation) {
  return {
    resourceType: 'DetectedIssue',
    id: rec.recommendationId,
    status: rec.status === 'pending' ? 'preliminary' : 'final',
    code: { text: rec.category },
    detail: rec.rationale,
    patient: { reference: `Patient/${rec.patientId}` },
  };
}
