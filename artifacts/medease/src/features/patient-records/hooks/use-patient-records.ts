import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { patientRecordQueries } from '@/features/patient-records/queries/patient-records.queries';
import type { PatientRecordFilters } from '@/services/patient-records/types';
import { patientRecordService } from '@/services/patient-records/patient-record.service';
import { useAuth } from '@/services/auth/auth-context';

const queryKeysPatientResolve = (userId: string, explicitId?: string) =>
  ['patient-records', 'resolve', userId, explicitId ?? 'self'] as const;

export function usePatientId(explicitId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeysPatientResolve(user?.id ?? '', explicitId)],
    queryFn: () =>
      patientRecordService.resolvePatientId(user?.id ?? '', explicitId),
    enabled: Boolean(user?.id) || Boolean(explicitId),
  });
}

function useWithPatientId<TData>(
  patientId: string | undefined,
  factory: (id: string) => UseQueryOptions<TData>,
) {
  return useQuery({
    ...factory(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function usePatientRecord(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.record);
}

export function usePatientSummary(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.summary);
}

export function usePatientTimeline(
  patientId?: string,
  filters?: PatientRecordFilters,
) {
  return useQuery({
    ...patientRecordQueries.timeline(patientId ?? '', filters),
    enabled: Boolean(patientId),
  });
}

export function usePatientVitals(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.vitals);
}

export function usePatientLabs(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.labs);
}

export function usePatientRadiology(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.radiology);
}

export function usePatientDocuments(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.documents);
}

export function usePatientMedications(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.medications);
}

export function usePatientAllergies(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.allergies);
}

export function usePatientProcedures(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.procedures);
}

export function usePatientImmunizations(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.immunizations);
}

export function usePatientEncounters(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.encounters);
}

export function usePatientCarePlans(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.carePlans);
}

export function usePatientNotes(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.notes);
}

export function useEmergencySummary(patientId?: string) {
  return useWithPatientId(patientId, patientRecordQueries.emergency);
}

export function usePatientRecordStats() {
  return useQuery(patientRecordQueries.stats());
}

export function usePatientRecordSearch(filters?: PatientRecordFilters) {
  return useQuery(patientRecordQueries.search(filters));
}

/** Resolves patient id for current user or explicit clinician route param. */
export function useResolvedPatientId(routePatientId?: string) {
  const resolveQuery = usePatientId(routePatientId);
  return routePatientId ?? resolveQuery.data ?? undefined;
}
