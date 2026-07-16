import { CACHE_TIMES, REFETCH_INTERVALS } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { PatientRecordFilters } from '@/services/patient-records/types';
import { patientRecordService } from '@/services/patient-records/patient-record.service';

export const patientRecordQueries = {
  search: (filters?: PatientRecordFilters) => ({
    queryKey: queryKeys.patientRecords.search(filters as Record<string, unknown> | undefined),
    queryFn: () => patientRecordService.search(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  record: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.record(patientId),
    queryFn: () => patientRecordService.getRecord(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
    refetchInterval: REFETCH_INTERVALS.patientTimeline,
  }),
  summary: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.summary(patientId),
    queryFn: () => patientRecordService.getSummary(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  timeline: (patientId: string, filters?: PatientRecordFilters) => ({
    queryKey: queryKeys.patientRecords.timeline(patientId, filters as Record<string, unknown> | undefined),
    queryFn: () => patientRecordService.getTimeline(patientId, filters),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  vitals: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.vitals(patientId),
    queryFn: () => patientRecordService.getVitals(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  labs: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.labs(patientId),
    queryFn: () => patientRecordService.getLabs(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  radiology: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.radiology(patientId),
    queryFn: () => patientRecordService.getRadiology(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  documents: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.documents(patientId),
    queryFn: () => patientRecordService.getDocuments(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  medications: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.medications(patientId),
    queryFn: () => patientRecordService.getMedications(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  allergies: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.allergies(patientId),
    queryFn: () => patientRecordService.getAllergies(patientId),
    staleTime: CACHE_TIMES.reference,
  }),
  procedures: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.procedures(patientId),
    queryFn: () => patientRecordService.getProcedures(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  immunizations: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.immunizations(patientId),
    queryFn: () => patientRecordService.getImmunizations(patientId),
    staleTime: CACHE_TIMES.reference,
  }),
  encounters: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.encounters(patientId),
    queryFn: () => patientRecordService.getEncounters(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  carePlans: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.carePlans(patientId),
    queryFn: () => patientRecordService.getCarePlans(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  notes: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.notes(patientId),
    queryFn: () => patientRecordService.getNotes(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  emergency: (patientId: string) => ({
    queryKey: queryKeys.patientRecords.emergency(patientId),
    queryFn: () => patientRecordService.getEmergencySummary(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  stats: () => ({
    queryKey: queryKeys.patientRecords.stats(),
    queryFn: () => patientRecordService.getStats(),
    staleTime: CACHE_TIMES.dashboard,
  }),
};
