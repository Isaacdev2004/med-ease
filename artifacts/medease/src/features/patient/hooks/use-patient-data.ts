import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/services/auth/auth-context';
import { useApiQueryReady } from '@/services/api/use-api-query-ready';
import { patientQueries } from '@/features/patient/queries/patient.queries';

/** Patient dashboard server state — pages consume this, never call services directly. */
export function usePatientDashboard(patientId?: string) {
  const { user } = useAuth();
  const apiReady = useApiQueryReady();
  const id = patientId ?? user?.id;

  return useQuery({
    ...patientQueries.dashboard(id ?? ''),
    enabled: apiReady && Boolean(id),
  });
}

/** Patient appointments list. */
export function useAppointments(patientId?: string) {
  const { user } = useAuth();
  const apiReady = useApiQueryReady();
  const id = patientId ?? user?.id;

  return useQuery({
    ...patientQueries.appointments(id ?? ''),
    enabled: apiReady && Boolean(id),
  });
}

export { useRescheduleAppointmentMutation } from '@/features/patient/mutations/appointment.mutations';
