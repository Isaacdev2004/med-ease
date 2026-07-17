import { reportingRepository } from '@/services/reporting/repository';
import type {
  CreateReportInput,
  ExportReportInput,
  ReportFilters,
  RunReportInput,
  ScheduleReportInput,
  ShareReportInput,
  UpdateDesignerInput,
} from '@/services/reporting/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const reportingService = {
  async dashboard(facilityId?: string) {
    await delay();
    return reportingRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return reportingRepository.analytics(facilityId);
  },
  async getDefinitions(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getDefinitions(filters);
  },
  async getDefinition(reportId: string) {
    await delay();
    return reportingRepository.getDefinition(reportId);
  },
  async getInstances(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getInstances(filters);
  },
  async getInstance(instanceId: string) {
    await delay();
    return reportingRepository.getInstance(instanceId);
  },
  async getTemplates(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getTemplates(filters);
  },
  async getSchedules(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getSchedules(filters);
  },
  async getExports(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getExports(filters);
  },
  async getDesigners(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getDesigners(filters);
  },
  async getDesigner(reportId: string) {
    await delay();
    return reportingRepository.getDesigner(reportId);
  },
  async getFields(reportId: string) {
    await delay();
    return reportingRepository.getFields(reportId);
  },
  async getCharts(reportId: string) {
    await delay();
    return reportingRepository.getCharts(reportId);
  },
  async getDataSources(reportId: string) {
    await delay();
    return reportingRepository.getDataSources(reportId);
  },
  async getComplianceReports(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getComplianceReports(filters);
  },
  async getAudits(filters?: ReportFilters) {
    await delay();
    return reportingRepository.getAudits(filters);
  },

  async createReport(input: CreateReportInput) {
    await delay();
    return reportingRepository.createReport(input);
  },
  async publishReport(reportId: string) {
    await delay();
    return reportingRepository.publishReport(reportId);
  },
  async runReport(input: RunReportInput) {
    await delay();
    return reportingRepository.runReport(input);
  },
  async scheduleReport(input: ScheduleReportInput) {
    await delay();
    return reportingRepository.scheduleReport(input);
  },
  async exportReport(input: ExportReportInput) {
    await delay();
    return reportingRepository.exportReport(input);
  },
  async updateDesigner(input: UpdateDesignerInput) {
    await delay();
    return reportingRepository.updateDesigner(input);
  },
  async cancelInstance(instanceId: string) {
    await delay();
    return reportingRepository.cancelInstance(instanceId);
  },
  async toggleSchedule(scheduleId: string) {
    await delay();
    return reportingRepository.toggleSchedule(scheduleId);
  },
  async retryExport(exportId: string) {
    await delay();
    return reportingRepository.retryExport(exportId);
  },

  async search(query: string, filters?: ReportFilters) {
    await delay();
    return reportingRepository.search(query, filters);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return reportingRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'report' | 'instance' | 'template',
    entityId: string,
  ) {
    await delay();
    return reportingRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return reportingRepository.getFavorites(userId);
  },
  async share(input: ShareReportInput) {
    await delay();
    return reportingRepository.share(input);
  },
};
