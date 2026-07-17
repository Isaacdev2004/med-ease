import type {
  AiPrediction,
  PredictionType,
  RiskAssessment,
} from '@/services/ai-intelligence/types';

export const PREDICTION_TYPES: PredictionType[] = [
  'deterioration',
  'sepsis',
  'readmission',
  'length_of_stay',
  'mortality',
  'fall_risk',
  'medication_adherence',
  'no_show',
];

export const PREDICTION_LABELS: Record<PredictionType, string> = {
  deterioration: 'Clinical Deterioration',
  sepsis: 'Sepsis Risk',
  readmission: '30-Day Readmission',
  length_of_stay: 'Length of Stay',
  mortality: 'Mortality Risk',
  fall_risk: 'Fall Risk',
  medication_adherence: 'Medication Adherence',
  no_show: 'Appointment No-Show',
};

export function scoreToRiskLevel(score: number): AiPrediction['riskLevel'] {
  if (score >= 0.85) return 'critical';
  if (score >= 0.65) return 'high';
  if (score >= 0.4) return 'moderate';
  return 'low';
}

export function computePredictionScore(
  type: PredictionType,
  seed: number,
): number {
  const base = (seed % 100) / 100;
  const modifiers: Record<PredictionType, number> = {
    deterioration: 0.72,
    sepsis: 0.68,
    readmission: 0.55,
    length_of_stay: 0.48,
    mortality: 0.62,
    fall_risk: 0.44,
    medication_adherence: 0.38,
    no_show: 0.32,
  };
  return Math.min(0.99, Math.round(base * modifiers[type] * 100) / 100);
}

export function buildRiskFactors(category: string, score: number): string[] {
  const common = ['Age', 'Comorbidities', 'Recent vitals trend'];
  if (score > 0.7) return [...common, 'Prior admissions', 'Lab abnormalities'];
  if (category.includes('Sepsis'))
    return [...common, 'Elevated lactate', 'Hypotension'];
  return common;
}

export function aggregateRiskScore(assessments: RiskAssessment[]): number {
  if (assessments.length === 0) return 0;
  return (
    Math.round(
      (assessments.reduce((s, a) => s + a.score, 0) / assessments.length) * 100,
    ) / 100
  );
}

export function toFhirRiskAssessment(assessment: RiskAssessment) {
  return {
    resourceType: 'RiskAssessment',
    id: assessment.assessmentId,
    status: 'final',
    subject: { reference: `Patient/${assessment.patientId}` },
    occurrenceDateTime: assessment.assessedAt,
    prediction: [
      {
        outcome: { text: assessment.category },
        probabilityDecimal: assessment.score,
      },
    ],
  };
}
