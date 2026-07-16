import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { LabOrderFilters, LabResultFilters } from '@/services/laboratory/types';
import { laboratoryService } from '@/services/laboratory/laboratory.service';

export const laboratoryQueries = {
  dashboard: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.dashboard(patientId),
    queryFn: () => laboratoryService.getDashboard(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  orders: (filters?: LabOrderFilters) => ({
    queryKey: queryKeys.laboratory.orders(filters as Record<string, unknown>),
    queryFn: () => laboratoryService.searchOrders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  allOrders: (filters?: LabOrderFilters) => ({
    queryKey: queryKeys.laboratory.allOrders(filters as Record<string, unknown>),
    queryFn: () => laboratoryService.getAllOrders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  order: (id: string) => ({
    queryKey: queryKeys.laboratory.order(id),
    queryFn: () => laboratoryService.getOrder(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  results: (filters?: LabResultFilters) => ({
    queryKey: queryKeys.laboratory.results(filters as Record<string, unknown>),
    queryFn: () => laboratoryService.searchResults(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  allResults: (filters?: LabResultFilters) => ({
    queryKey: queryKeys.laboratory.allResults(filters as Record<string, unknown>),
    queryFn: () => laboratoryService.getAllResults(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  result: (id: string) => ({
    queryKey: queryKeys.laboratory.result(id),
    queryFn: () => laboratoryService.getResult(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  patientLab: (patientId: string) => ({
    queryKey: queryKeys.laboratory.patientLab(patientId),
    queryFn: () => laboratoryService.getPatientLaboratory(patientId),
    staleTime: CACHE_TIMES.dashboard,
    enabled: Boolean(patientId),
  }),
  timeline: (patientId: string) => ({
    queryKey: queryKeys.laboratory.timeline(patientId),
    queryFn: () => laboratoryService.getTimeline(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
    enabled: Boolean(patientId),
  }),
  trends: (patientId: string) => ({
    queryKey: queryKeys.laboratory.trends(patientId),
    queryFn: () => laboratoryService.getTrends(patientId),
    staleTime: CACHE_TIMES.dashboard,
    enabled: Boolean(patientId),
  }),
  alerts: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.alerts(patientId),
    queryFn: () => laboratoryService.getAlerts(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  critical: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.critical(patientId),
    queryFn: () => laboratoryService.getCriticalResults(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  specimens: (orderId?: string, patientId?: string) => ({
    queryKey: queryKeys.laboratory.specimens(orderId, patientId),
    queryFn: () => laboratoryService.getSpecimens(orderId, patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  analytics: () => ({
    queryKey: queryKeys.laboratory.analytics(),
    queryFn: () => laboratoryService.getAnalytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  search: (query: string, patientId?: string) => ({
    queryKey: queryKeys.laboratory.search(query, patientId),
    queryFn: () => laboratoryService.search(query, patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  catalog: () => ({
    queryKey: queryKeys.laboratory.catalog(),
    queryFn: () => laboratoryService.getTestCatalog(),
    staleTime: CACHE_TIMES.reference,
  }),
  referenceRanges: () => ({
    queryKey: queryKeys.laboratory.referenceRanges(),
    queryFn: () => laboratoryService.getReferenceRanges(),
    staleTime: CACHE_TIMES.reference,
  }),
  pending: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.pending(patientId),
    queryFn: () => laboratoryService.getPendingResults(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  quality: () => ({
    queryKey: queryKeys.laboratory.quality(),
    queryFn: () => laboratoryService.getQualityDashboard(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.favorites(patientId),
    queryFn: () => laboratoryService.getFavorites(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  microbiology: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.microbiology(patientId),
    queryFn: () => laboratoryService.getMicrobiology(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  pathology: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.pathology(patientId),
    queryFn: () => laboratoryService.getPathology(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  bloodBank: (patientId?: string) => ({
    queryKey: queryKeys.laboratory.bloodBank(patientId),
    queryFn: () => laboratoryService.getBloodBank(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  instruments: () => ({
    queryKey: queryKeys.laboratory.instruments(),
    queryFn: () => laboratoryService.getInstruments(),
    staleTime: CACHE_TIMES.reference,
  }),
  trendAnalysis: (patientId: string, testId?: string) => ({
    queryKey: queryKeys.laboratory.trendAnalysis(patientId, testId),
    queryFn: () => laboratoryService.getTrendAnalysis(patientId, testId),
    staleTime: CACHE_TIMES.dashboard,
    enabled: Boolean(patientId),
  }),
};
