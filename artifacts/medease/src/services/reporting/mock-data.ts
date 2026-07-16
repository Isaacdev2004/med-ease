import { estimateFileSizeKb, exportsTodayCount, formatBreakdown, pendingExportCount } from '@/services/reporting/export-engine';
import { activeScheduleCount, scheduleComplianceRate } from '@/services/reporting/schedule-engine';
import { templateReuseRate } from '@/services/reporting/template-engine';
import type {
  ComplianceReport,
  ReportAnalytics,
  ReportAudit,
  ReportChart,
  ReportDashboard,
  ReportDataSource,
  ReportDefinition,
  ReportDesigner,
  ReportExport,
  ReportField,
  ReportInstance,
  ReportSchedule,
  ReportTemplate,
} from '@/services/reporting/types';

const SCALE = { definitions: 80, instances: 300, templates: 40, schedules: 35, exports: 200, audits: 400 };
const ENTERPRISE = { definitions: 1200, instances: 85_000, exports: 250_000, schedules: 6_000, audits: 1_500_000 };

const CATEGORIES = ['clinical', 'finance', 'audit', 'moh', 'insurance', 'hospital', 'patient', 'research'] as const;
const REPORT_NAMES = [
  'Patient Census Summary', 'Revenue Cycle Analysis', 'Audit Trail Export', 'MOH Compliance Summary',
  'Claims Reconciliation', 'Bed Occupancy Report', 'Patient Outcomes Dashboard', 'Clinical Trial Metrics',
  'AR Aging', 'Infection Control Log', 'Insurance Denial Rate', 'Discharge Summary',
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_REPORT_DEFINITIONS: ReportDefinition[] = Array.from({ length: SCALE.definitions }, (_, i) => ({
  reportId: `rpt-${String(i + 1).padStart(4, '0')}`,
  name: REPORT_NAMES[i % REPORT_NAMES.length]!,
  description: `${REPORT_NAMES[i % REPORT_NAMES.length]} for ${CATEGORIES[i % CATEGORIES.length]} reporting`,
  category: CATEGORIES[i % CATEGORIES.length]!,
  version: 1 + (i % 4),
  status: (['published', 'published', 'draft', 'archived'] as const)[i % 4]!,
  fieldCount: 8 + (i % 12),
  chartCount: 1 + (i % 5),
  publishedAt: i % 4 !== 2 ? daysAgo(i % 60) : undefined,
  updatedAt: daysAgo(i % 20),
}));

export const MOCK_REPORT_INSTANCES: ReportInstance[] = Array.from({ length: SCALE.instances }, (_, i) => {
  const def = MOCK_REPORT_DEFINITIONS[i % MOCK_REPORT_DEFINITIONS.length]!;
  return {
    instanceId: `rpi-${String(i + 1).padStart(5, '0')}`,
    reportId: def.reportId,
    reportName: def.name,
    category: def.category,
    status: (['completed', 'completed', 'running', 'queued', 'failed', 'cancelled'] as const)[i % 6]!,
    generatedBy: `user-${String((i % 20) + 1).padStart(5, '0')}`,
    generatedAt: daysAgo(i % 14),
    completedAt: i % 6 <= 1 ? daysAgo(i % 7) : undefined,
    facilityId: i % 3 === 0 ? `fac-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
    rowCount: 100 + (i % 500) * 10,
  };
});

export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = REPORT_NAMES.map((name, i) => ({
  templateId: `tpl-${String(i + 1).padStart(3, '0')}`,
  name,
  category: CATEGORIES[i % CATEGORIES.length]!,
  subcategory: ['summary', 'detail', 'dashboard', 'compliance'][i % 4]!,
  usageCount: 30 + i * 25,
}));

export const MOCK_REPORT_SCHEDULES: ReportSchedule[] = Array.from({ length: SCALE.schedules }, (_, i) => ({
  scheduleId: `rps-${String(i + 1).padStart(3, '0')}`,
  reportId: MOCK_REPORT_DEFINITIONS[i % MOCK_REPORT_DEFINITIONS.length]!.reportId,
  name: `Schedule ${i + 1}`,
  cron: i % 2 === 0 ? '0 6 * * *' : '0 0 * * 1',
  format: (['pdf', 'xlsx', 'csv'] as const)[i % 3]!,
  recipients: [`user-${String((i % 5) + 1).padStart(5, '0')}@hospital.org`],
  enabled: i % 5 !== 0,
  lastRunAt: i % 3 === 0 ? daysAgo(1) : undefined,
  nextRunAt: daysAgo(-(i % 3)),
}));

export const MOCK_REPORT_EXPORTS: ReportExport[] = Array.from({ length: SCALE.exports }, (_, i) => {
  const def = MOCK_REPORT_DEFINITIONS[i % MOCK_REPORT_DEFINITIONS.length]!;
  const format = (['pdf', 'xlsx', 'csv'] as const)[i % 3]!;
  const recordCount = 50 + (i % 200) * 5;
  const status = (['completed', 'completed', 'processing', 'queued', 'failed'] as const)[i % 5]!;
  return {
    exportId: `exp-${String(i + 1).padStart(5, '0')}`,
    reportId: def.reportId,
    reportName: def.name,
    format,
    status,
    requestedBy: `user-${String((i % 15) + 1).padStart(5, '0')}`,
    requestedAt: daysAgo(i % 10),
    completedAt: status === 'completed' ? daysAgo(i % 5) : undefined,
    recordCount: status === 'completed' ? recordCount : undefined,
    fileSizeKb: status === 'completed' ? estimateFileSizeKb(recordCount, format) : undefined,
  };
});

export const MOCK_REPORT_DESIGNERS: ReportDesigner[] = MOCK_REPORT_DEFINITIONS.slice(0, 30).map((d, i) => ({
  designerId: `dsn-${String(i + 1).padStart(3, '0')}`,
  reportId: d.reportId,
  canvasElements: 5 + (i % 15),
  dataSourceCount: 1 + (i % 4),
  lastEditedBy: `user-${String((i % 8) + 1).padStart(5, '0')}`,
  lastEditedAt: daysAgo(i % 14),
}));

export const MOCK_REPORT_FIELDS: ReportField[] = Array.from({ length: 60 }, (_, i) => ({
  fieldId: `fld-${String(i + 1).padStart(4, '0')}`,
  reportId: MOCK_REPORT_DEFINITIONS[i % MOCK_REPORT_DEFINITIONS.length]!.reportId,
  name: `Field ${(i % 20) + 1}`,
  type: (['string', 'number', 'date', 'boolean'] as const)[i % 4]!,
  source: `ds.${['patient', 'encounter', 'billing', 'lab'][i % 4]}.${['id', 'name', 'amount', 'date'][i % 4]}`,
}));

export const MOCK_REPORT_CHARTS: ReportChart[] = Array.from({ length: 40 }, (_, i) => ({
  chartId: `cht-${String(i + 1).padStart(4, '0')}`,
  reportId: MOCK_REPORT_DEFINITIONS[i % MOCK_REPORT_DEFINITIONS.length]!.reportId,
  type: (['bar', 'line', 'pie', 'table'] as const)[i % 4]!,
  title: `Chart ${(i % 10) + 1}`,
}));

export const MOCK_REPORT_DATA_SOURCES: ReportDataSource[] = Array.from({ length: 35 }, (_, i) => ({
  sourceId: `src-${String(i + 1).padStart(4, '0')}`,
  reportId: MOCK_REPORT_DEFINITIONS[i % MOCK_REPORT_DEFINITIONS.length]!.reportId,
  name: `Source ${(i % 8) + 1}`,
  module: ['clinical', 'billing', 'appointments', 'lab', 'pharmacy'][i % 5]!,
  query: `SELECT * FROM ${['patients', 'encounters', 'claims', 'results'][i % 4]} WHERE facility_id = :facilityId`,
}));

export const MOCK_COMPLIANCE_REPORTS: ComplianceReport[] = Array.from({ length: 24 }, (_, i) => ({
  complianceId: `cmp-${String(i + 1).padStart(3, '0')}`,
  name: ['MOH Monthly Return', 'NHIS Claims Summary', 'HIPAA Audit Log', 'JCI Quality Metrics'][i % 4]!,
  category: CATEGORIES[i % CATEGORIES.length]!,
  regulatoryBody: ['MOH', 'NHIS', 'HHS', 'JCI'][i % 4]!,
  dueDate: daysAgo(-(i % 14)),
  status: (['compliant', 'pending', 'overdue'] as const)[i % 3]!,
  lastSubmittedAt: i % 3 === 0 ? daysAgo(i % 30) : undefined,
}));

export const MOCK_REPORT_AUDITS: ReportAudit[] = Array.from({ length: SCALE.audits }, (_, i) => ({
  auditId: `rpa-${String(i + 1).padStart(5, '0')}`,
  reportId: MOCK_REPORT_DEFINITIONS[i % MOCK_REPORT_DEFINITIONS.length]!.reportId,
  action: ['run', 'export', 'schedule', 'publish', 'share'][i % 5]!,
  actorId: `user-${String((i % 20) + 1).padStart(5, '0')}`,
  outcome: i % 12 === 0 ? 'failure' as const : 'success' as const,
  timestamp: daysAgo(i % 30),
}));

function generationSuccessRate(instances: ReportInstance[]): number {
  const completed = instances.filter((i) => i.status === 'completed').length;
  const attempted = instances.filter((i) => i.status !== 'queued').length;
  if (attempted === 0) return 100;
  return Math.round((completed / attempted) * 100);
}

function complianceOnTimeRate(reports: ComplianceReport[]): number {
  if (reports.length === 0) return 100;
  const onTime = reports.filter((r) => r.status === 'compliant').length;
  return Math.round((onTime / reports.length) * 100);
}

export function buildReportDashboard(facilityId?: string): ReportDashboard {
  let instances = MOCK_REPORT_INSTANCES;
  if (facilityId) instances = instances.filter((i) => i.facilityId === facilityId);

  return {
    totalDefinitions: ENTERPRISE.definitions,
    activeInstances: instances.filter((i) => i.status === 'running' || i.status === 'queued').length * 150,
    pendingExports: pendingExportCount(MOCK_REPORT_EXPORTS) * 40,
    scheduledReports: activeScheduleCount(MOCK_REPORT_SCHEDULES) * 80,
    complianceDue: MOCK_COMPLIANCE_REPORTS.filter((c) => c.status !== 'compliant').length,
    exportsToday: exportsTodayCount(MOCK_REPORT_EXPORTS) * 25,
    categoryBreakdown: CATEGORIES.slice(0, 6).map((label) => ({
      label,
      value: instances.filter((i) => i.category === label).length * 200,
    })),
    generationTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
      label,
      value: 120 + i * 20,
    })),
    recentExports: MOCK_REPORT_EXPORTS.slice(0, 8),
  };
}

export function computeReportAnalytics(facilityId?: string): ReportAnalytics {
  let instances = MOCK_REPORT_INSTANCES;
  if (facilityId) instances = instances.filter((i) => i.facilityId === facilityId);
  const dashboard = buildReportDashboard(facilityId);

  return {
    generationSuccessRate: generationSuccessRate(instances),
    avgGenerationTimeMinutes: 4.2,
    scheduleComplianceRate: scheduleComplianceRate(MOCK_REPORT_SCHEDULES),
    exportVolumeDaily: 680,
    templateReuseRate: templateReuseRate(MOCK_REPORT_TEMPLATES),
    complianceOnTimeRate: complianceOnTimeRate(MOCK_COMPLIANCE_REPORTS),
    generationTrend: dashboard.generationTrend,
    categoryThroughput: dashboard.categoryBreakdown,
    formatBreakdown: formatBreakdown(MOCK_REPORT_EXPORTS),
  };
}
