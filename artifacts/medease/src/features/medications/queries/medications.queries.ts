import { CACHE_TIMES, REFETCH_INTERVALS } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { MedicationFilters } from '@/services/medications/types';
import { medicationService } from '@/services/medications/medication.service';

export const medicationQueries = {
  list: (filters?: MedicationFilters) => ({
    queryKey: queryKeys.medications.list(filters as Record<string, unknown>),
    queryFn: () => medicationService.searchMedications(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  detail: (id: string) => ({
    queryKey: queryKeys.medications.detail(id),
    queryFn: () => medicationService.getMedication(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  today: (patientId: string) => ({
    queryKey: queryKeys.medications.today(patientId),
    queryFn: () => medicationService.getTodayMedications(patientId),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
  schedule: (patientId?: string) => ({
    queryKey: queryKeys.medications.schedule(patientId),
    queryFn: () => medicationService.getSchedule(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  history: (patientId: string) => ({
    queryKey: queryKeys.medications.history(patientId),
    queryFn: () => medicationService.getHistory(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  timeline: (patientId: string) => ({
    queryKey: queryKeys.medications.timeline(patientId),
    queryFn: () => medicationService.getTimeline(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  reminders: (patientId?: string) => ({
    queryKey: queryKeys.medications.reminders(patientId),
    queryFn: () => medicationService.getReminders(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  dashboard: (patientId: string) => ({
    queryKey: queryKeys.medications.dashboard(patientId),
    queryFn: () => medicationService.getDashboard(patientId),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
  adherence: (patientId: string) => ({
    queryKey: queryKeys.medications.adherence(patientId),
    queryFn: () => medicationService.getAdherence(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  interactions: (patientId: string) => ({
    queryKey: queryKeys.medications.interactions(patientId),
    queryFn: () => medicationService.getInteractions(patientId),
    staleTime: CACHE_TIMES.reference,
  }),
  prescriptions: (filters?: MedicationFilters) => ({
    queryKey: queryKeys.medications.prescriptions(filters as Record<string, unknown>),
    queryFn: () => medicationService.getPrescriptions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  prescription: (id: string) => ({
    queryKey: queryKeys.medications.prescription(id),
    queryFn: () => medicationService.getPrescription(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  refills: (patientId?: string) => ({
    queryKey: queryKeys.medications.refills(patientId),
    queryFn: () => medicationService.getRefills(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (filters?: MedicationFilters) => ({
    queryKey: queryKeys.medications.analytics(filters as Record<string, unknown>),
    queryFn: () => medicationService.getAnalytics(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  calendar: (patientId: string, referenceDate?: Date) => ({
    queryKey: queryKeys.medications.calendar(patientId, referenceDate?.toISOString()),
    queryFn: () => medicationService.getCalendar(patientId, referenceDate),
    staleTime: CACHE_TIMES.dashboard,
  }),
  pharmacyQueue: (pharmacyId?: string) => ({
    queryKey: queryKeys.medications.pharmacyQueue(pharmacyId),
    queryFn: () => medicationService.getPharmacyQueue(pharmacyId),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
  administration: (patientId?: string) => ({
    queryKey: queryKeys.medications.administration(patientId),
    queryFn: () => medicationService.getAdministrations(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  education: (medicationId: string) => ({
    queryKey: queryKeys.medications.education(medicationId),
    queryFn: () => medicationService.getEducation(medicationId),
    staleTime: CACHE_TIMES.reference,
    enabled: Boolean(medicationId),
  }),
  favorites: (patientId?: string) => ({
    queryKey: queryKeys.medications.favorites(patientId),
    queryFn: () => medicationService.getFavorites(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, patientId?: string) => ({
    queryKey: queryKeys.medications.search(query, patientId),
    queryFn: () => medicationService.searchMedicationsQuery(query, patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
