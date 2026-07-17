import { useQuery } from '@tanstack/react-query';

import { appointmentQueries } from '@/features/appointments/queries/appointments.queries';
import type {
  AppointmentFilters,
  CalendarViewMode,
} from '@/services/appointments/types';
import { appointmentService } from '@/services/appointments/appointment.service';
import { useAuth } from '@/services/auth/auth-context';

export function useAppointments(filters?: AppointmentFilters) {
  return useQuery(appointmentQueries.list(filters));
}

export function useAppointment(id: string | undefined) {
  return useQuery({
    ...appointmentQueries.detail(id ?? ''),
    enabled: Boolean(id),
  });
}

export function useUpcomingAppointments(filters?: AppointmentFilters) {
  return useQuery(appointmentQueries.upcoming(filters));
}

export function usePastAppointments(filters?: AppointmentFilters) {
  return useQuery(appointmentQueries.past(filters));
}

export function useAppointmentCalendar(
  filters?: AppointmentFilters,
  referenceDate?: Date,
  mode: CalendarViewMode = 'month',
) {
  return useQuery(appointmentQueries.calendar(filters, referenceDate, mode));
}

export function useProviderAvailability(
  providerId: string,
  facilityId: string,
  date: string,
) {
  return useQuery(
    appointmentQueries.availability(providerId, facilityId, date),
  );
}

export function useFacilitySchedule(facilityId: string, date: string) {
  return useQuery(appointmentQueries.facilitySchedule(facilityId, date));
}

export function useWaitlist() {
  return useQuery(appointmentQueries.waitlist());
}

export function useQueue(filters?: AppointmentFilters) {
  return useQuery(appointmentQueries.queue(filters));
}

export function useTelemedicineAppointments(filters?: AppointmentFilters) {
  return useQuery(appointmentQueries.telemedicine(filters));
}

export function useAppointmentAnalytics(filters?: AppointmentFilters) {
  return useQuery(appointmentQueries.analytics(filters));
}

export function useAvailableSlots(
  providerId: string,
  facilityId: string,
  date: string,
) {
  return useQuery(appointmentQueries.slots(providerId, facilityId, date));
}

export function usePatientAppointmentFilters() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['appointments', 'resolve-patient', user?.id ?? ''],
    queryFn: () => appointmentService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}

export function usePatientAppointments(
  patientId?: string,
  extra?: AppointmentFilters,
) {
  const filters: AppointmentFilters = { ...extra, patientId };
  return useAppointments(patientId ? filters : undefined);
}
