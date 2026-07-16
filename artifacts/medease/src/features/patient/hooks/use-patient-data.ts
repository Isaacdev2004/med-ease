import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/services/auth/auth-context';
import { patientQueries } from '@/features/patient/queries/patient.queries';

/** Patient dashboard server state — pages consume this, never call services directly. */
export function usePatientDashboard(patientId?: string) {
  const { user } = useAuth();
  const id = patientId ?? user?.id ?? 'user-patient';

  return useQuery({
    ...patientQueries.dashboard(id),
    enabled: Boolean(id),
  });
}

/** Patient appointments list. */
export function useAppointments(patientId?: string) {
  const { user } = useAuth();
  const id = patientId ?? user?.id ?? 'user-patient';

  return useQuery({
    ...patientQueries.appointments(id),
    enabled: Boolean(id),
  });
}

export { useRescheduleAppointmentMutation } from '@/features/patient/mutations/appointment.mutations';
