import { useQuery } from '@tanstack/react-query';

import { reportingQueries } from '@/features/reporting/queries/reporting.queries';
import type { ReportFilters } from '@/services/reporting/types';

export function useReportDashboard(facilityId?: string) {
  return useQuery(reportingQueries.dashboard(facilityId));
}

export function useReportAnalytics(facilityId?: string) {
  return useQuery(reportingQueries.analytics(facilityId));
}

export function useReportDefinitions(filters?: ReportFilters) {
  return useQuery(reportingQueries.definitions(filters));
}

export function useReportDefinition(reportId: string) {
  return useQuery(reportingQueries.definition(reportId));
}

export function useReportInstances(filters?: ReportFilters) {
  return useQuery(reportingQueries.instances(filters));
}

export function useReportInstance(instanceId: string) {
  return useQuery(reportingQueries.instance(instanceId));
}

export function useReportTemplates(filters?: ReportFilters) {
  return useQuery(reportingQueries.templates(filters));
}

export function useReportSchedules(filters?: ReportFilters) {
  return useQuery(reportingQueries.schedules(filters));
}

export function useReportExports(filters?: ReportFilters) {
  return useQuery(reportingQueries.exports(filters));
}

export function useReportDesigners(filters?: ReportFilters) {
  return useQuery(reportingQueries.designers(filters));
}

export function useReportDesigner(reportId: string) {
  return useQuery(reportingQueries.designer(reportId));
}

export function useReportFields(reportId: string) {
  return useQuery(reportingQueries.fields(reportId));
}

export function useReportCharts(reportId: string) {
  return useQuery(reportingQueries.charts(reportId));
}

export function useReportDataSources(reportId: string) {
  return useQuery(reportingQueries.dataSources(reportId));
}

export function useComplianceReports(filters?: ReportFilters) {
  return useQuery(reportingQueries.compliance(filters));
}

export function useReportAudits(filters?: ReportFilters) {
  return useQuery(reportingQueries.audits(filters));
}

export function useReportSearch(query: string, filters?: ReportFilters) {
  return useQuery(reportingQueries.search(query, filters));
}

export function useReportFavorites(userId?: string) {
  return useQuery(reportingQueries.favorites(userId));
}
