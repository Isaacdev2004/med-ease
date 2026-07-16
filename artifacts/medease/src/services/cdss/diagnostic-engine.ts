import type { DiagnosticSuggestion, DifferentialDiagnosis } from '@/services/cdss/types';

export function rankDiagnosesByProbability(
  diagnoses: DifferentialDiagnosis['diagnoses'],
): DifferentialDiagnosis['diagnoses'] {
  return [...diagnoses].sort((a, b) => b.probability - a.probability);
}

export function buildSuggestedWorkup(suggestion: DiagnosticSuggestion): string[] {
  return [...suggestion.suggestedLabs, ...suggestion.suggestedImaging];
}

export function diagnosticConfidence(probability: number): 'low' | 'moderate' | 'high' {
  if (probability >= 70) return 'high';
  if (probability >= 40) return 'moderate';
  return 'low';
}
