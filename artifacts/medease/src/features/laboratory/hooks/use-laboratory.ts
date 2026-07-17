import { useQuery } from '@tanstack/react-query';

import { laboratoryQueries } from '@/features/laboratory/queries/laboratory.queries';
import type {
  LabOrderFilters,
  LabResultFilters,
} from '@/services/laboratory/types';
import { laboratoryService } from '@/services/laboratory/laboratory.service';
import { useAuth } from '@/services/auth/auth-context';

export function useLaboratoryDashboard(patientId?: string) {
  return useQuery(laboratoryQueries.dashboard(patientId));
}

export function useLaboratoryOrders(filters?: LabOrderFilters) {
  return useQuery(laboratoryQueries.allOrders(filters));
}

export function useLaboratoryOrder(id: string | undefined) {
  return useQuery({
    ...laboratoryQueries.order(id ?? ''),
    enabled: Boolean(id),
  });
}

export function useLaboratoryResults(filters?: LabResultFilters) {
  return useQuery(laboratoryQueries.allResults(filters));
}

export function useLaboratoryResult(id: string | undefined) {
  return useQuery({
    ...laboratoryQueries.result(id ?? ''),
    enabled: Boolean(id),
  });
}

export function usePatientLaboratory(patientId: string | undefined) {
  return useQuery({
    ...laboratoryQueries.patientLab(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function useLaboratoryTimeline(patientId: string | undefined) {
  return useQuery({
    ...laboratoryQueries.timeline(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function useLaboratoryTrends(patientId: string | undefined) {
  return useQuery({
    ...laboratoryQueries.trends(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function useLaboratoryAlerts(patientId?: string) {
  return useQuery(laboratoryQueries.alerts(patientId));
}

export function useCriticalResults(patientId?: string) {
  return useQuery(laboratoryQueries.critical(patientId));
}

export function useSpecimenTracking(orderId?: string, patientId?: string) {
  return useQuery(laboratoryQueries.specimens(orderId, patientId));
}

export function useLaboratoryAnalytics() {
  return useQuery(laboratoryQueries.analytics());
}

export function useLaboratorySearch(query: string, patientId?: string) {
  return useQuery(laboratoryQueries.search(query, patientId));
}

export function useReferenceRanges() {
  return useQuery(laboratoryQueries.referenceRanges());
}

export function usePendingResults(patientId?: string) {
  return useQuery(laboratoryQueries.pending(patientId));
}

export function usePatientLabs(patientId: string | undefined) {
  return usePatientLaboratory(patientId);
}

export function useTrendAnalysis(
  patientId: string | undefined,
  testId?: string,
) {
  return useQuery({
    ...laboratoryQueries.trendAnalysis(patientId ?? '', testId),
    enabled: Boolean(patientId),
  });
}

export function useLabAnalytics() {
  return useLaboratoryAnalytics();
}

export function useSpecimens(orderId?: string, patientId?: string) {
  return useSpecimenTracking(orderId, patientId);
}

export function useMicrobiology(patientId?: string) {
  return useQuery(laboratoryQueries.microbiology(patientId));
}

export function usePathology(patientId?: string) {
  return useQuery(laboratoryQueries.pathology(patientId));
}

export function useBloodBank(patientId?: string) {
  return useQuery(laboratoryQueries.bloodBank(patientId));
}

export function useQualityDashboard() {
  return useQuery(laboratoryQueries.quality());
}

export function useLabInstruments() {
  return useQuery(laboratoryQueries.instruments());
}

export function useFavorites(patientId?: string) {
  return useQuery(laboratoryQueries.favorites(patientId));
}

export function usePatientLaboratoryContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['laboratory', 'resolve-patient', user?.id ?? ''],
    queryFn: () => laboratoryService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}
