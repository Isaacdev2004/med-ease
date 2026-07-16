import { useQuery } from '@tanstack/react-query';

import { patientMonitoringQueries } from '@/features/patient-monitoring/queries/patient-monitoring.queries';
import { useAuth } from '@/services/auth/auth-context';
import { patientMonitoringService } from '@/services/patient-monitoring/patient-monitoring.service';
import type { MonitoringFilters } from '@/services/patient-monitoring/types';

export function usePatientMonitoringContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['patient-monitoring', 'context', user?.id],
    queryFn: () => patientMonitoringService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}

export function useMonitoringDashboard(patientId?: string) {
  return useQuery(patientMonitoringQueries.dashboard(patientId));
}

export function usePatientMonitoring(patientId?: string) {
  return useMonitoringDashboard(patientId);
}

export function useVitalSigns(filters?: MonitoringFilters) {
  return useQuery(patientMonitoringQueries.vitals(filters));
}

export function useObservations(filters?: MonitoringFilters) {
  return useQuery(patientMonitoringQueries.observations(filters));
}

export function useObservation(id: string) {
  return useQuery(patientMonitoringQueries.observation(id));
}

export function useObservationTimeline(patientId?: string) {
  return useQuery(patientMonitoringQueries.timeline(patientId ?? ''));
}

export function useMonitoringAlerts(filters?: MonitoringFilters) {
  return useQuery(patientMonitoringQueries.alerts(filters));
}

export function useMonitoringAnalytics() {
  return useQuery(patientMonitoringQueries.analytics());
}

export function useMonitoringDevices(patientId?: string) {
  return useQuery(patientMonitoringQueries.devices(patientId));
}

export function usePatientDevice(id: string) {
  return useQuery(patientMonitoringQueries.device(id));
}

export function useRPMPrograms(patientId?: string) {
  return useQuery(patientMonitoringQueries.rpm(patientId));
}

export function useTrendAnalysis(patientId?: string, metric?: string) {
  return useQuery(patientMonitoringQueries.trendAnalysis(patientId ?? '', metric));
}

export function useEarlyWarningScores(patientId?: string) {
  return useQuery(patientMonitoringQueries.scores(patientId));
}

export function useMonitoringHistory(patientId?: string) {
  return useQuery(patientMonitoringQueries.history(patientId ?? ''));
}

export function useMonitoringSearch(query: string, patientId?: string) {
  return useQuery(patientMonitoringQueries.search(query, patientId));
}

export function useMonitoringFavorites(patientId?: string) {
  return useQuery(patientMonitoringQueries.favorites(patientId ?? ''));
}
