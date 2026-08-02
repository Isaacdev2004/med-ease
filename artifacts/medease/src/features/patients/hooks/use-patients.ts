import { useQuery } from '@tanstack/react-query';

import { patientsQueries } from '@/features/patients/queries/patients.queries';
import type {
  PatientFilters,
  PatientSearchFilters,
} from '@medease/patients-contract';

export function usePatients(filters?: PatientFilters) {
  return useQuery(patientsQueries.list(filters));
}

export function usePatientSearch(filters: PatientSearchFilters) {
  return useQuery(patientsQueries.search(filters));
}

export function usePatient(patientId: string | undefined) {
  return useQuery({
    ...patientsQueries.detail(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function usePatientIdentifiers(patientId: string | undefined) {
  return useQuery({
    ...patientsQueries.identifiers(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}

export function usePatientAllergies(patientId: string | undefined) {
  return useQuery({
    ...patientsQueries.allergies(patientId ?? ''),
    enabled: Boolean(patientId),
  });
}
