import { CACHE_TIMES, REFETCH_INTERVALS } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { AppointmentFilters, CalendarViewMode } from '@/services/appointments/types';
import { appointmentService } from '@/services/appointments/appointment.service';

export const appointmentQueries = {
  list: (filters?: AppointmentFilters) => ({
    queryKey: queryKeys.appointments.list(filters as Record<string, unknown> | undefined),
    queryFn: () => appointmentService.search(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  detail: (id: string) => ({
    queryKey: queryKeys.appointments.detail(id),
    queryFn: () => appointmentService.getById(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  upcoming: (filters?: AppointmentFilters) => ({
    queryKey: queryKeys.appointments.upcoming(filters as Record<string, unknown> | undefined),
    queryFn: () => appointmentService.getUpcoming(filters),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
  past: (filters?: AppointmentFilters) => ({
    queryKey: queryKeys.appointments.past(filters as Record<string, unknown> | undefined),
    queryFn: () => appointmentService.getPast(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  today: (filters?: AppointmentFilters) => ({
    queryKey: queryKeys.appointments.today(filters?.patientId),
    queryFn: () => appointmentService.getToday(filters),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
  calendar: (filters?: AppointmentFilters, referenceDate?: Date, mode: CalendarViewMode = 'month') => ({
    queryKey: queryKeys.appointments.calendar(
      { ...filters, referenceDate: referenceDate?.toISOString() } as Record<string, unknown>,
      mode,
    ),
    queryFn: () => appointmentService.getCalendar(filters, referenceDate, mode),
    staleTime: CACHE_TIMES.dashboard,
  }),
  availability: (providerId: string, facilityId: string, date: string) => ({
    queryKey: queryKeys.appointments.availability(providerId, facilityId, date),
    queryFn: () => appointmentService.getProviderAvailability(providerId, facilityId, date),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(providerId && facilityId && date),
  }),
  facilitySchedule: (facilityId: string, date: string) => ({
    queryKey: queryKeys.appointments.facilitySchedule(facilityId, date),
    queryFn: () => appointmentService.getFacilitySchedule(facilityId, date),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(facilityId && date),
  }),
  slots: (providerId: string, facilityId: string, date: string) => ({
    queryKey: queryKeys.appointments.slots(providerId, facilityId, date),
    queryFn: () => appointmentService.getAvailableSlots(providerId, facilityId, date),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(providerId && facilityId && date),
  }),
  waitlist: () => ({
    queryKey: queryKeys.appointments.waitlist(),
    queryFn: () => appointmentService.getWaitlist(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  queue: (filters?: AppointmentFilters) => ({
    queryKey: queryKeys.appointments.queue(filters as Record<string, unknown> | undefined),
    queryFn: () => appointmentService.getQueue(filters),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
  telemedicine: (filters?: AppointmentFilters) => ({
    queryKey: queryKeys.appointments.telemedicine(filters as Record<string, unknown> | undefined),
    queryFn: () => appointmentService.getTelemedicine(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  analytics: (filters?: AppointmentFilters) => ({
    queryKey: queryKeys.appointments.analytics(filters as Record<string, unknown> | undefined),
    queryFn: () => appointmentService.getAnalytics(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
};
