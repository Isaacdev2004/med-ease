import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { appToast } from '@/services/api/toast';
import { appointmentOfflineQueue } from '@/services/appointments/offline-sync';
import { appointmentService } from '@/services/appointments/appointment.service';
import type {
  BookAppointmentInput,
  CancelAppointmentInput,
  CheckInInput,
  RescheduleAppointmentInput,
} from '@/services/appointments/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (!navigator.onLine) {
    appointmentOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Appointment update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.appointments.all });
}

export function useAppointmentMutations() {
  const client = useQueryClient();

  const book = useMutation({
    mutationFn: (input: BookAppointmentInput) =>
      runOrQueue('Book appointment', () => appointmentService.book(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Appointment booked', description: 'Your appointment has been scheduled.' });
    },
    onError: (err: Error) => {
      appToast.error({ title: 'Booking failed', description: err.message });
    },
  });

  const cancel = useMutation({
    mutationFn: (input: CancelAppointmentInput) =>
      runOrQueue('Cancel appointment', () => appointmentService.cancel(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Appointment cancelled' });
    },
  });

  const reschedule = useMutation({
    mutationFn: (input: RescheduleAppointmentInput) =>
      runOrQueue('Reschedule appointment', () => appointmentService.reschedule(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Appointment rescheduled' });
    },
  });

  const checkIn = useMutation({
    mutationFn: (input: CheckInInput) =>
      runOrQueue('Check in', () => appointmentService.checkIn(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Patient checked in' });
    },
  });

  return { book, cancel, reschedule, checkIn };
}

export function useBookAppointment() {
  return useAppointmentMutations().book;
}

export function useCancelAppointment() {
  return useAppointmentMutations().cancel;
}

export function useRescheduleAppointment() {
  return useAppointmentMutations().reschedule;
}

export function useCheckIn() {
  return useAppointmentMutations().checkIn;
}
