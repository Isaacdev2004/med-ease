import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOptimisticMutationOptions, queryKeys } from '@/services/api';
import { patientService } from '@/features/patient/services/patient.service';
import type { PatientDashboardData } from '@/features/patient/types';

export function useRescheduleAppointmentMutation(patientId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      scheduledAt,
    }: {
      appointmentId: string;
      scheduledAt: string;
    }) => {
      await patientService.rescheduleAppointment(appointmentId, scheduledAt);
      return patientService.getDashboard(patientId);
    },
    ...createOptimisticMutationOptions<
      PatientDashboardData,
      { appointmentId: string; scheduledAt: string }
    >({
      queryClient: client,
      queryKey: queryKeys.patients.dashboard(patientId),
      entityLabel: 'Appointment',
      invalidateKeys: [
        queryKeys.appointments.list({ patientId }),
        queryKeys.appointments.today(patientId),
      ],
      optimisticUpdate: (current, variables) => ({
        ...current,
        nextAppointment: current.nextAppointment
          ? {
              ...current.nextAppointment,
              scheduledAt: variables.scheduledAt,
            }
          : null,
      }),
    }),
  });
}
