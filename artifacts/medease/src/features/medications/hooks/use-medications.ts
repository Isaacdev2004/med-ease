import { useQuery } from '@tanstack/react-query';

import { medicationQueries } from '@/features/medications/queries/medications.queries';
import { queryKeys } from '@/services/api/query-keys';
import type { MedicationFilters } from '@/services/medications/types';
import { medicationService } from '@/services/medications/medication.service';
import { useAuth } from '@/services/auth/auth-context';

export function useMedications(filters?: MedicationFilters) {
  return useQuery(medicationQueries.list(filters));
}

export function useMedication(id: string | undefined) {
  return useQuery({ ...medicationQueries.detail(id ?? ''), enabled: Boolean(id) });
}

export function useTodaysMedications(patientId: string | undefined) {
  return useQuery({ ...medicationQueries.today(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useMedicationSchedule(patientId?: string) {
  return useQuery(medicationQueries.schedule(patientId));
}

export function useMedicationHistory(patientId: string | undefined) {
  return useQuery({ ...medicationQueries.history(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useMedicationTimeline(patientId: string | undefined) {
  return useQuery({ ...medicationQueries.timeline(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useMedicationReminders(patientId?: string) {
  return useQuery(medicationQueries.reminders(patientId));
}

export function useMedicationLogs(patientId?: string) {
  return useQuery(medicationQueries.history(patientId ?? ''));
}

export function useMedicationDashboard(patientId: string | undefined) {
  return useQuery({ ...medicationQueries.dashboard(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useMedicationAdherence(patientId: string | undefined) {
  return useQuery({ ...medicationQueries.adherence(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useMedicationInteractions(patientId: string | undefined) {
  return useQuery({ ...medicationQueries.interactions(patientId ?? ''), enabled: Boolean(patientId) });
}

export function usePrescription(id: string | undefined) {
  return useQuery({ ...medicationQueries.prescription(id ?? ''), enabled: Boolean(id) });
}

export function usePrescriptions(filters?: MedicationFilters) {
  return useQuery(medicationQueries.prescriptions(filters));
}

export function useRefills(patientId?: string) {
  return useQuery(medicationQueries.refills(patientId));
}

export function useMedicationAnalytics(filters?: MedicationFilters) {
  return useQuery(medicationQueries.analytics(filters));
}

export function useMedicationSearch(query: string, patientId?: string) {
  return useQuery({ ...medicationQueries.search(query, patientId), enabled: query.length >= 2 });
}

export function usePatientMedications(patientId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.medications.list({ patientId }),
    queryFn: () => medicationService.getMedications({ patientId }),
    enabled: Boolean(patientId),
  });
}

export function useMedicationAdministration(patientId?: string) {
  return useQuery(medicationQueries.administration(patientId));
}

export function useMedicationEducation(medicationId: string | undefined) {
  return useQuery({ ...medicationQueries.education(medicationId ?? ''), enabled: Boolean(medicationId) });
}

export function useMedicationRefills(patientId?: string) {
  return useRefills(patientId);
}

export function useMedicationCalendar(patientId: string | undefined, referenceDate?: Date) {
  return useQuery({
    ...medicationQueries.calendar(patientId ?? '', referenceDate),
    enabled: Boolean(patientId),
  });
}

export function usePharmacyQueue(pharmacyId?: string) {
  return useQuery(medicationQueries.pharmacyQueue(pharmacyId));
}

export function useFavorites(patientId?: string) {
  return useQuery(medicationQueries.favorites(patientId));
}

export function usePatientMedicationContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['medications', 'resolve-patient', user?.id ?? ''],
    queryFn: () => medicationService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}
