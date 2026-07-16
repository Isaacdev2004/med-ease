import type { ClinicalSummary } from '@/services/ai-intelligence/types';

export const SUMMARY_TEMPLATES = {
  note: 'Progress note summary highlighting assessment, plan changes, and follow-up items.',
  encounter: 'Encounter summary covering chief complaint, diagnostics, interventions, and disposition.',
  discharge: 'Discharge summary with admission reason, hospital course, medications, and outpatient plan.',
} as const;

export function generateSummary(
  sourceType: ClinicalSummary['sourceType'],
  patientId: string,
): Pick<ClinicalSummary, 'summary' | 'keyFindings'> {
  const findings = [
    'Vitals stable over last 24 hours',
    'Medication regimen optimized',
    'Follow-up scheduled within 7 days',
  ];
  if (sourceType === 'discharge') {
    findings.push('Patient education completed');
    findings.push('Care transition plan documented');
  }
  return {
    summary: `${SUMMARY_TEMPLATES[sourceType]} Patient ${patientId}: clinically improving with no acute concerns. Continue current management per care plan.`,
    keyFindings: findings,
  };
}

export function toFhirDiagnosticReport(summary: ClinicalSummary) {
  return {
    resourceType: 'DiagnosticReport',
    id: summary.summaryId,
    status: 'final',
    code: { text: 'AI Clinical Summary' },
    subject: { reference: `Patient/${summary.patientId}` },
    effectiveDateTime: summary.generatedAt,
    conclusion: summary.summary,
  };
}
