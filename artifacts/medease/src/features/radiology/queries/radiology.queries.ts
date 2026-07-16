import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { StudyFilters } from '@/services/radiology/types';
import { radiologyService } from '@/services/radiology/radiology.service';

export const radiologyQueries = {
  dashboard: (patientId?: string) => ({
    queryKey: queryKeys.radiology.dashboard(patientId),
    queryFn: () => radiologyService.getDashboard(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  studies: (filters?: StudyFilters) => ({
    queryKey: queryKeys.radiology.allStudies(filters as Record<string, unknown>),
    queryFn: () => radiologyService.getAllStudies(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  study: (id: string) => ({
    queryKey: queryKeys.radiology.study(id),
    queryFn: () => radiologyService.getStudy(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  report: (id: string) => ({
    queryKey: queryKeys.radiology.report(id),
    queryFn: () => radiologyService.getReport(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  patientImaging: (patientId: string) => ({
    queryKey: queryKeys.radiology.patientImaging(patientId),
    queryFn: () => radiologyService.getPatientImaging(patientId),
    staleTime: CACHE_TIMES.dashboard,
    enabled: Boolean(patientId),
  }),
  timeline: (patientId: string) => ({
    queryKey: queryKeys.radiology.timeline(patientId),
    queryFn: () => radiologyService.getTimeline(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
    enabled: Boolean(patientId),
  }),
  critical: (patientId?: string) => ({
    queryKey: queryKeys.radiology.critical(patientId),
    queryFn: () => radiologyService.getCriticalResults(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  pending: () => ({
    queryKey: queryKeys.radiology.pending(),
    queryFn: () => radiologyService.getPendingReports(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  viewer: (studyId: string) => ({
    queryKey: queryKeys.radiology.viewer(studyId),
    queryFn: () => radiologyService.getImageViewerState(studyId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(studyId),
  }),
  annotations: (studyId: string) => ({
    queryKey: queryKeys.radiology.annotations(studyId),
    queryFn: () => radiologyService.getAnnotations(studyId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(studyId),
  }),
  measurements: (studyId: string) => ({
    queryKey: queryKeys.radiology.measurements(studyId),
    queryFn: () => radiologyService.getMeasurements(studyId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(studyId),
  }),
  analytics: () => ({
    queryKey: queryKeys.radiology.analytics(),
    queryFn: () => radiologyService.getAnalytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  comparison: (studyId: string, compareId: string) => ({
    queryKey: queryKeys.radiology.comparison(studyId, compareId),
    queryFn: () => radiologyService.compareStudies(studyId, compareId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(studyId && compareId),
  }),
  favorites: (patientId?: string) => ({
    queryKey: queryKeys.radiology.favorites(patientId),
    queryFn: () => radiologyService.getFavorites(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  devices: () => ({
    queryKey: queryKeys.radiology.devices(),
    queryFn: () => radiologyService.getDevices(),
    staleTime: CACHE_TIMES.reference,
  }),
  radiologistDashboard: (id?: string) => ({
    queryKey: queryKeys.radiology.radiologistDashboard(id),
    queryFn: () => radiologyService.getRadiologistDashboard(id),
    staleTime: CACHE_TIMES.dashboard,
  }),
  facilityImaging: (facilityId?: string) => ({
    queryKey: queryKeys.radiology.facilityImaging(facilityId),
    queryFn: () => radiologyService.getFacilityImaging(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  search: (query: string, patientId?: string) => ({
    queryKey: queryKeys.radiology.search(query, patientId),
    queryFn: () => radiologyService.search(query, patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
