import { computeReportAnalytics } from '@/services/reporting/analytics';
import { mergeDesignerState } from '@/services/reporting/designer-engine';
import { estimateFileSizeKb, nextExportStatus } from '@/services/reporting/export-engine';
import {
  MOCK_COMPLIANCE_REPORTS,
  MOCK_REPORT_AUDITS,
  MOCK_REPORT_CHARTS,
  MOCK_REPORT_DATA_SOURCES,
  MOCK_REPORT_DEFINITIONS,
  MOCK_REPORT_DESIGNERS,
  MOCK_REPORT_EXPORTS,
  MOCK_REPORT_FIELDS,
  MOCK_REPORT_INSTANCES,
  MOCK_REPORT_SCHEDULES,
  MOCK_REPORT_TEMPLATES,
  buildReportDashboard,
} from '@/services/reporting/mock-data';
import { parseCronNextRun } from '@/services/reporting/schedule-engine';
import type {
  CreateReportInput,
  ExportReportInput,
  ReportFavorite,
  ReportFilters,
  RunReportInput,
  ScheduleReportInput,
  ShareReportInput,
  UpdateDesignerInput,
} from '@/services/reporting/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

function audit(reportId: string, action: string, actorId = 'system') {
  MOCK_REPORT_AUDITS.unshift({
    auditId: `rpa-${Date.now()}`,
    reportId,
    action,
    actorId,
    outcome: 'success',
    timestamp: new Date().toISOString(),
  });
}

class ReportingRepository {
  private definitions = [...MOCK_REPORT_DEFINITIONS];
  private instances = [...MOCK_REPORT_INSTANCES];
  private schedules = [...MOCK_REPORT_SCHEDULES];
  private exports = [...MOCK_REPORT_EXPORTS];
  private designers = [...MOCK_REPORT_DESIGNERS];
  private favorites: ReportFavorite[] = [];
  private nextId = 880000;

  dashboard(facilityId?: string) { return buildReportDashboard(facilityId); }
  analytics(facilityId?: string) { return computeReportAnalytics(facilityId); }

  getDefinitions(filters?: ReportFilters) {
    let items = this.definitions;
    if (filters?.category) items = items.filter((d) => d.category === filters.category);
    if (filters?.status) items = items.filter((d) => d.status === filters.status);
    if (filters?.q) items = items.filter((d) => matchQ(filters.q, d.name, d.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDefinition(reportId: string) { return this.definitions.find((d) => d.reportId === reportId) ?? null; }

  getInstances(filters?: ReportFilters) {
    let items = this.instances;
    if (filters?.facilityId) items = items.filter((i) => i.facilityId === filters.facilityId);
    if (filters?.category) items = items.filter((i) => i.category === filters.category);
    if (filters?.status) items = items.filter((i) => i.status === filters.status);
    if (filters?.userId) items = items.filter((i) => i.generatedBy === filters.userId);
    if (filters?.q) items = items.filter((i) => matchQ(filters.q, i.reportName, i.instanceId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getInstance(instanceId: string) { return this.instances.find((i) => i.instanceId === instanceId) ?? null; }

  getTemplates(filters?: ReportFilters) {
    let items = MOCK_REPORT_TEMPLATES;
    if (filters?.category) items = items.filter((t) => t.category === filters.category);
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.name, t.subcategory));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSchedules(filters?: ReportFilters) {
    let items = this.schedules;
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getExports(filters?: ReportFilters) {
    let items = this.exports;
    if (filters?.status) items = items.filter((e) => e.status === filters.status);
    if (filters?.userId) items = items.filter((e) => e.requestedBy === filters.userId);
    if (filters?.q) items = items.filter((e) => matchQ(filters.q, e.reportName));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDesigners(filters?: ReportFilters) {
    let items = this.designers;
    if (filters?.q) items = items.filter((d) => matchQ(filters.q, d.reportId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDesigner(reportId: string) { return this.designers.find((d) => d.reportId === reportId) ?? null; }

  getFields(reportId: string) { return MOCK_REPORT_FIELDS.filter((f) => f.reportId === reportId); }
  getCharts(reportId: string) { return MOCK_REPORT_CHARTS.filter((c) => c.reportId === reportId); }
  getDataSources(reportId: string) { return MOCK_REPORT_DATA_SOURCES.filter((s) => s.reportId === reportId); }

  getComplianceReports(filters?: ReportFilters) {
    let items = MOCK_COMPLIANCE_REPORTS;
    if (filters?.category) items = items.filter((c) => c.category === filters.category);
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    if (filters?.q) items = items.filter((c) => matchQ(filters.q, c.name, c.regulatoryBody));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudits(filters?: ReportFilters) {
    let items = MOCK_REPORT_AUDITS;
    if (filters?.userId) items = items.filter((a) => a.actorId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createReport(input: CreateReportInput) {
    const report = {
      reportId: `rpt-${this.nextId++}`,
      name: input.name,
      description: input.description,
      category: input.category,
      version: 1,
      status: 'draft' as const,
      fieldCount: 0,
      chartCount: 0,
      updatedAt: new Date().toISOString(),
    };
    this.definitions.unshift(report);
    this.designers.unshift({
      designerId: `dsn-${this.nextId++}`,
      reportId: report.reportId,
      canvasElements: 0,
      dataSourceCount: 0,
      lastEditedBy: 'system',
      lastEditedAt: new Date().toISOString(),
    });
    return report;
  }

  publishReport(reportId: string) {
    const def = this.definitions.find((d) => d.reportId === reportId);
    if (!def) return null;
    def.status = 'published';
    def.publishedAt = new Date().toISOString();
    def.updatedAt = new Date().toISOString();
    audit(reportId, 'publish');
    return def;
  }

  runReport(input: RunReportInput) {
    const def = this.definitions.find((d) => d.reportId === input.reportId);
    if (!def || def.status !== 'published') return null;
    const instance = {
      instanceId: `rpi-${this.nextId++}`,
      reportId: def.reportId,
      reportName: def.name,
      category: def.category,
      status: 'running' as const,
      generatedBy: input.generatedBy,
      generatedAt: new Date().toISOString(),
      facilityId: input.facilityId,
      rowCount: 0,
    };
    this.instances.unshift(instance);
    audit(def.reportId, 'run', input.generatedBy);
    return instance;
  }

  scheduleReport(input: ScheduleReportInput) {
    const schedule = {
      scheduleId: `rps-${this.nextId++}`,
      reportId: input.reportId,
      name: input.name,
      cron: input.cron,
      format: input.format,
      recipients: input.recipients,
      enabled: true,
      nextRunAt: parseCronNextRun(input.cron),
    };
    this.schedules.unshift(schedule);
    audit(input.reportId, 'schedule');
    return schedule;
  }

  exportReport(input: ExportReportInput) {
    const def = this.definitions.find((d) => d.reportId === input.reportId);
    if (!def) return null;
    const recordCount = 100 + Math.floor(Math.random() * 500);
    const exp = {
      exportId: `exp-${this.nextId++}`,
      reportId: def.reportId,
      reportName: def.name,
      format: input.format,
      status: 'completed' as const,
      requestedBy: input.requestedBy,
      requestedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      recordCount,
      fileSizeKb: estimateFileSizeKb(recordCount, input.format),
    };
    this.exports.unshift(exp);
    audit(def.reportId, 'export', input.requestedBy);
    return exp;
  }

  updateDesigner(input: UpdateDesignerInput) {
    const designer = this.designers.find((d) => d.reportId === input.reportId);
    if (!designer) return null;
    const updated = mergeDesignerState(designer, {
      canvasElements: input.canvasElements,
      dataSourceCount: input.dataSourceCount,
    });
    updated.lastEditedBy = input.editedBy;
    const idx = this.designers.findIndex((d) => d.reportId === input.reportId);
    this.designers[idx] = updated;
    audit(input.reportId, 'design', input.editedBy);
    return updated;
  }

  cancelInstance(instanceId: string) {
    const inst = this.instances.find((i) => i.instanceId === instanceId);
    if (!inst) return null;
    inst.status = 'cancelled';
    audit(inst.reportId, 'cancel');
    return inst;
  }

  toggleSchedule(scheduleId: string) {
    const sched = this.schedules.find((s) => s.scheduleId === scheduleId);
    if (!sched) return null;
    sched.enabled = !sched.enabled;
    return sched;
  }

  retryExport(exportId: string) {
    const exp = this.exports.find((e) => e.exportId === exportId);
    if (!exp) return null;
    exp.status = nextExportStatus(exp.status, 'complete');
    exp.completedAt = new Date().toISOString();
    return exp;
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.instances.length };
  }

  favorite(userId: string, entityType: 'report' | 'instance' | 'template', entityId: string) {
    if (!this.favorites.some((f) => f.userId === userId && f.entityId === entityId)) {
      this.favorites.push({ userId, entityType, entityId, createdAt: new Date().toISOString() });
    }
    return { userId, entityType, entityId };
  }

  getFavorites(userId: string) { return this.favorites.filter((f) => f.userId === userId); }

  share(input: ShareReportInput) {
    audit(input.reportId, 'share');
    return { reportId: input.reportId, sharedWith: input.sharedWith, sharedAt: new Date().toISOString() };
  }

  search(query: string, filters?: ReportFilters) {
    const defs = this.definitions.filter((d) => matchQ(query, d.name, d.description));
    const inst = this.instances.filter((i) => matchQ(query, i.reportName, i.instanceId));
    return { definitions: paginate(defs, filters?.page, filters?.pageSize), instances: paginate(inst, filters?.page, filters?.pageSize) };
  }
}

export const reportingRepository = new ReportingRepository();
