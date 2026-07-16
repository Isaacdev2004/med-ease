import { CACHE_TIMES, REFETCH_INTERVALS } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { patientService } from '@/features/patient/services/patient.service';

export const patientQueries = {
  dashboard: (patientId: string) => ({
    queryKey: queryKeys.patients.dashboard(patientId),
    queryFn: () => patientService.getDashboard(patientId),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
  appointments: (patientId: string) => ({
    queryKey: queryKeys.appointments.list({ patientId }),
    queryFn: () => patientService.getAppointments(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  appointmentToday: (patientId: string) => ({
    queryKey: queryKeys.appointments.today(patientId),
    queryFn: () => patientService.getAppointments(patientId),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
};
