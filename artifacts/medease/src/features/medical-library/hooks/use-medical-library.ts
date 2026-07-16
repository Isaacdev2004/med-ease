import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { medicalLibraryQueries } from '@/features/medical-library/queries/medical-library.queries';
import type { MedicationFilters } from '@/services/medical-library/medical-library.types';
import { useAuth } from '@/services/auth/auth-context';

export function useMedicalLibrary(filters?: MedicationFilters) {
  return useQuery(medicalLibraryQueries.search(filters));
}

export function useMedicationSearch(filters?: MedicationFilters) {
  return useMedicalLibrary(filters);
}

export function useMedication(medicationId: string) {
  return useQuery({
    ...medicalLibraryQueries.detail(medicationId),
    enabled: Boolean(medicationId),
  });
}

export function useRelatedMedications(medicationId: string) {
  return useQuery({
    ...medicalLibraryQueries.related(medicationId),
    enabled: Boolean(medicationId),
  });
}

export function useMedicationCategories() {
  return useQuery(medicalLibraryQueries.categories());
}

export function useMedicalLibraryStats() {
  const { user } = useAuth();
  return useQuery({
    ...medicalLibraryQueries.stats(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}

export function useMedicationFavorites() {
  const { user } = useAuth();
  return useQuery({
    ...medicalLibraryQueries.favorites(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}

export function useMedicationComparison(medicationIds: string[]) {
  const queries = medicationIds.map((id) => medicalLibraryQueries.detail(id));
  // For placeholder — consumers can use individual useMedication hooks
  return useMemo(() => ({ medicationIds, queries }), [medicationIds, queries]);
}
