import { toFhirGuidanceResponse } from '@/services/ai-intelligence/clinical-copilot';
import { toFhirMeasureReport } from '@/services/ai-intelligence/forecasting';
import { toFhirDiagnosticReport } from '@/services/ai-intelligence/summarization';
import { toFhirRiskAssessment } from '@/services/ai-intelligence/predictive-models';
import { toFhirDetectedIssue } from '@/services/ai-intelligence/recommendation-engine';
import type {
  ClinicalRecommendation,
  ClinicalSummary,
  CopilotSession,
  OperationalForecast,
  RiskAssessment,
} from '@/services/ai-intelligence/types';

export function mapToFhirBundle(resources: {
  riskAssessments?: RiskAssessment[];
  recommendations?: ClinicalRecommendation[];
  summaries?: ClinicalSummary[];
  forecasts?: OperationalForecast[];
  copilotSessions?: CopilotSession[];
}) {
  const entries: { resource: unknown }[] = [];
  resources.riskAssessments?.forEach((r) =>
    entries.push({ resource: toFhirRiskAssessment(r) }),
  );
  resources.recommendations?.forEach((r) =>
    entries.push({ resource: toFhirDetectedIssue(r) }),
  );
  resources.summaries?.forEach((s) =>
    entries.push({ resource: toFhirDiagnosticReport(s) }),
  );
  resources.forecasts?.forEach((f) =>
    entries.push({ resource: toFhirMeasureReport(f) }),
  );
  resources.copilotSessions?.forEach((s) =>
    entries.push({ resource: toFhirGuidanceResponse(s) }),
  );
  return { resourceType: 'Bundle', type: 'collection', entry: entries };
}

export function toFhirProvenance(resourceId: string, actorId: string) {
  return {
    resourceType: 'Provenance',
    target: [{ reference: resourceId }],
    recorded: new Date().toISOString(),
    agent: [
      {
        who: { reference: `Practitioner/${actorId}` },
        type: { text: 'AI System' },
      },
    ],
  };
}

export function toFhirAuditEvent(action: string, resourceId: string) {
  return {
    resourceType: 'AuditEvent',
    type: { text: action },
    recorded: new Date().toISOString(),
    entity: [{ what: { reference: resourceId } }],
  };
}
