import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { patientMonitoringService } from '@/services/patient-monitoring/patient-monitoring.service';
import type { MonitoringFilters } from '@/services/patient-monitoring/types';

export const patientMonitoringQueries = {
  dashboard: (patientId?: string) => ({
    queryKey: queryKeys.monitoring.dashboard(patientId),
    queryFn: () => patientMonitoringService.getDashboard(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  vitals: (filters?: MonitoringFilters) => ({
    queryKey: queryKeys.monitoring.vitals(
      filters?.patientId ?? 'all',
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => patientMonitoringService.getVitalSigns(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  observations: (filters?: MonitoringFilters) => ({
    queryKey: queryKeys.monitoring.observations(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => patientMonitoringService.getObservations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  observation: (id: string) => ({
    queryKey: queryKeys.monitoring.observation(id),
    queryFn: () => patientMonitoringService.getObservation(id),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(id),
  }),
  timeline: (patientId: string) => ({
    queryKey: queryKeys.monitoring.timeline(patientId),
    queryFn: () => patientMonitoringService.getTimeline(patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(patientId),
  }),
  alerts: (filters?: MonitoringFilters) => ({
    queryKey: queryKeys.monitoring.alerts(
      filters?.patientId,
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => patientMonitoringService.getAlerts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  devices: (patientId?: string) => ({
    queryKey: queryKeys.monitoring.devices(patientId),
    queryFn: () => patientMonitoringService.getDevices(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  device: (id: string) => ({
    queryKey: queryKeys.monitoring.device(id),
    queryFn: () => patientMonitoringService.getDevice(id),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(id),
  }),
  analytics: () => ({
    queryKey: queryKeys.monitoring.analytics(),
    queryFn: () => patientMonitoringService.getAnalytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  rpm: (patientId?: string) => ({
    queryKey: queryKeys.monitoring.rpm(patientId),
    queryFn: () => patientMonitoringService.getRPMPrograms(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  trendAnalysis: (patientId: string, metric?: string) => ({
    queryKey: queryKeys.monitoring.trendAnalysis(patientId, metric),
    queryFn: () => patientMonitoringService.getTrendAnalysis(patientId, metric),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(patientId),
  }),
  scores: (patientId?: string) => ({
    queryKey: queryKeys.monitoring.scores(patientId),
    queryFn: () => patientMonitoringService.getEarlyWarningScores(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  history: (patientId: string) => ({
    queryKey: queryKeys.monitoring.history(patientId),
    queryFn: () => patientMonitoringService.getHistory(patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(patientId),
  }),
  favorites: (patientId: string) => ({
    queryKey: queryKeys.monitoring.favorites(patientId),
    queryFn: () => patientMonitoringService.getFavorites(patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(patientId),
  }),
  search: (query: string, patientId?: string) => ({
    queryKey: queryKeys.monitoring.search(query, patientId),
    queryFn: () => patientMonitoringService.search(query, patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
