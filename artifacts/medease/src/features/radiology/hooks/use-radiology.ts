import { useQuery } from '@tanstack/react-query';

import { radiologyQueries } from '@/features/radiology/queries/radiology.queries';
import type { StudyFilters } from '@/services/radiology/types';
import { radiologyService } from '@/services/radiology/radiology.service';
import { useAuth } from '@/services/auth/auth-context';

export function useRadiologyDashboard(patientId?: string) {
  return useQuery(radiologyQueries.dashboard(patientId));
}

export function useRadiologyStudies(filters?: StudyFilters) {
  return useQuery(radiologyQueries.studies(filters));
}

export function useRadiologyStudy(id: string | undefined) {
  return useQuery({
    ...radiologyQueries.study(id ?? ''),
    enabled: Boolean(id),
  });
}

export function useDiagnosticReport(id: string | undefined) {
  return useQuery({
    ...radiologyQueries.report(id ?? ''),
    enabled: Boolean(id),
  });
}

export function useStudyTimeline(patientId: string | undefined) {
  return useQuery({
    ...radiologyQueries.timeline(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function usePatientImaging(patientId: string | undefined) {
  return useQuery({
    ...radiologyQueries.patientImaging(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function useCriticalResults(patientId?: string) {
  return useQuery(radiologyQueries.critical(patientId));
}

export function usePendingReports() {
  return useQuery(radiologyQueries.pending());
}

export function useRadiologistDashboard(radiologistId?: string) {
  return useQuery(radiologyQueries.radiologistDashboard(radiologistId));
}

export function useFacilityImaging(facilityId?: string) {
  return useQuery(radiologyQueries.facilityImaging(facilityId));
}

export function useStudyAnalytics() {
  return useQuery(radiologyQueries.analytics());
}

export function useImageViewer(studyId: string | undefined) {
  return useQuery({
    ...radiologyQueries.viewer(studyId ?? ''),
    enabled: Boolean(studyId),
  });
}

export function useImageAnnotations(studyId: string | undefined) {
  return useQuery({
    ...radiologyQueries.annotations(studyId ?? ''),
    enabled: Boolean(studyId),
  });
}

export function useMeasurements(studyId: string | undefined) {
  return useQuery({
    ...radiologyQueries.measurements(studyId ?? ''),
    enabled: Boolean(studyId),
  });
}

export function useFavorites(patientId?: string) {
  return useQuery(radiologyQueries.favorites(patientId));
}

export function useCompareStudies(
  studyId: string | undefined,
  compareId: string | undefined,
) {
  return useQuery({
    ...radiologyQueries.comparison(studyId ?? '', compareId ?? ''),
    enabled: Boolean(studyId && compareId),
  });
}

export function useRadiologySearch(query: string, patientId?: string) {
  return useQuery(radiologyQueries.search(query, patientId));
}

export function usePatientRadiologyContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['radiology', 'resolve-patient', user?.id ?? ''],
    queryFn: () => radiologyService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}
