import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { patientsService } from '@/services/patients';
import type {
  PatientFilters,
  PatientSearchFilters,
} from '@medease/patients-contract';

export const patientsQueries = {
  list: (filters?: PatientFilters) => ({
    queryKey: queryKeys.patients.list(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => patientsService.listPatients(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (filters: PatientSearchFilters) => ({
    queryKey: queryKeys.patients.list({
      ...filters,
      mode: 'search',
    } as Record<string, unknown>),
    queryFn: () => patientsService.searchPatients(filters),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(filters.q?.trim()),
  }),
  detail: (patientId: string) => ({
    queryKey: queryKeys.patients.detail(patientId),
    queryFn: () => patientsService.getPatient(patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(patientId),
  }),
  identifiers: (patientId: string) => ({
    queryKey: [...queryKeys.patients.detail(patientId), 'identifiers'] as const,
    queryFn: () => patientsService.getIdentifiers(patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(patientId),
  }),
  allergies: (patientId: string) => ({
    queryKey: [...queryKeys.patients.detail(patientId), 'allergies'] as const,
    queryFn: () => patientsService.getAllergies(patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(patientId),
  }),
};
