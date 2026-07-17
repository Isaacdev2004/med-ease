export const NLP_ENTITY_TYPES = [
  'medication',
  'condition',
  'procedure',
  'lab',
  'symptom',
] as const;

export function extractEntities(
  text: string,
): { type: string; value: string; confidence: number }[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  return tokens.slice(0, 5).map((token, i) => ({
    type: NLP_ENTITY_TYPES[i % NLP_ENTITY_TYPES.length]!,
    value: token.replace(/[^a-zA-Z0-9-]/g, ''),
    confidence: Math.round((0.75 + (i % 3) * 0.08) * 100) / 100,
  }));
}

export function sentimentScore(text: string): number {
  const positive = ['stable', 'improving', 'normal', 'resolved'];
  const negative = ['critical', 'worsening', 'abnormal', 'urgent'];
  const lower = text.toLowerCase();
  let score = 0.5;
  positive.forEach((w) => {
    if (lower.includes(w)) score += 0.1;
  });
  negative.forEach((w) => {
    if (lower.includes(w)) score -= 0.1;
  });
  return Math.max(0, Math.min(1, Math.round(score * 100) / 100));
}

export function toFhirObservation(
  entity: { type: string; value: string; confidence: number },
  patientId: string,
) {
  return {
    resourceType: 'Observation',
    status: 'final',
    code: { text: entity.type },
    subject: { reference: `Patient/${patientId}` },
    valueString: entity.value,
    extension: [{ url: 'confidence', valueDecimal: entity.confidence }],
  };
}
