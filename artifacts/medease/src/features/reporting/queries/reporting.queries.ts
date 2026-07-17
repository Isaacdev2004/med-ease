import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { reportingService } from '@/services/reporting/reporting.service';
import type { ReportFilters } from '@/services/reporting/types';

export const reportingQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.reporting.dashboard(facilityId),
    queryFn: () => reportingService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.reporting.analytics(facilityId),
    queryFn: () => reportingService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  definitions: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.definitions(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getDefinitions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  definition: (reportId: string) => ({
    queryKey: queryKeys.reporting.definition(reportId),
    queryFn: () => reportingService.getDefinition(reportId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(reportId),
  }),
  instances: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.instances(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getInstances(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  instance: (instanceId: string) => ({
    queryKey: queryKeys.reporting.instance(instanceId),
    queryFn: () => reportingService.getInstance(instanceId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(instanceId),
  }),
  templates: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.templates(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getTemplates(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  schedules: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.schedules(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getSchedules(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  exports: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.exports(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getExports(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  designers: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.designers(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getDesigners(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  designer: (reportId: string) => ({
    queryKey: queryKeys.reporting.designer(reportId),
    queryFn: () => reportingService.getDesigner(reportId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(reportId),
  }),
  fields: (reportId: string) => ({
    queryKey: queryKeys.reporting.fields(reportId),
    queryFn: () => reportingService.getFields(reportId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(reportId),
  }),
  charts: (reportId: string) => ({
    queryKey: queryKeys.reporting.charts(reportId),
    queryFn: () => reportingService.getCharts(reportId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(reportId),
  }),
  dataSources: (reportId: string) => ({
    queryKey: queryKeys.reporting.dataSources(reportId),
    queryFn: () => reportingService.getDataSources(reportId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(reportId),
  }),
  compliance: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.compliance(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getComplianceReports(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audits: (filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.audits(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.getAudits(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, filters?: ReportFilters) => ({
    queryKey: queryKeys.reporting.search(
      query,
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => reportingService.search(query, filters),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.reporting.favorites(userId),
    queryFn: () => reportingService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
