import type { BenchmarkReport, EnterpriseKpi, ExecutiveForecast } from '@/services/executive/types';

export function toFhirMeasureReport(kpi: EnterpriseKpi) {
  return {
    resourceType: 'MeasureReport',
    id: kpi.kpiId,
    status: 'complete',
    type: 'summary',
    measure: kpi.name,
    date: kpi.measuredAt,
    group: [{ measureScore: { value: kpi.value } }],
  };
}

export function toFhirMeasure(kpi: EnterpriseKpi) {
  return {
    resourceType: 'Measure',
    id: kpi.kpiId,
    status: 'active',
    description: kpi.name,
    topic: [{ text: kpi.category }],
  };
}

export function toFhirBasic(report: BenchmarkReport) {
  return {
    resourceType: 'Basic',
    id: report.reportId,
    code: { text: report.metric },
    created: report.generatedAt,
    extension: [{ url: 'percentile', valueInteger: report.percentile }],
  };
}

export function mapExecutiveBundle(resources: { kpis?: EnterpriseKpi[]; forecasts?: ExecutiveForecast[] }) {
  const entries: { resource: unknown }[] = [];
  resources.kpis?.forEach((k) => entries.push({ resource: toFhirMeasureReport(k) }));
  resources.forecasts?.forEach((f) => entries.push({
    resource: { resourceType: 'MeasureReport', id: f.forecastId, measure: f.metric, group: [{ measureScore: { value: f.predictedValue } }] },
  }));
  return { resourceType: 'Bundle', type: 'collection', entry: entries };
}

export function toFhirAuditEvent(action: string, resourceId: string) {
  return { resourceType: 'AuditEvent', type: { text: action }, recorded: new Date().toISOString(), entity: [{ what: { reference: resourceId } }] };
}

export function toFhirProvenance(resourceId: string, actorId: string) {
  return { resourceType: 'Provenance', target: [{ reference: resourceId }], recorded: new Date().toISOString(), agent: [{ who: { reference: `Practitioner/${actorId}` } }] };
}
