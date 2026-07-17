import type { Appointment } from '@/services/appointments/types';

export function buildAppointmentReminder(appointment: Appointment) {
  return {
    id: `rem-${appointment.id}`,
    title: 'Appointment reminder',
    message: `${appointment.specialty} with ${appointment.provider.fullName} at ${new Date(appointment.scheduledAt).toLocaleString()}`,
    dueAt: new Date(
      new Date(appointment.scheduledAt).getTime() - 24 * 60 * 60 * 1000,
    ).toISOString(),
    appointmentId: appointment.id,
    type: 'appointment' as const,
    priority:
      appointment.priority === 'urgent'
        ? ('high' as const)
        : ('normal' as const),
  };
}

export function buildCheckInNotification(appointment: Appointment) {
  return {
    id: `checkin-${appointment.id}`,
    title: 'Check-in confirmed',
    message: `${appointment.patient.fullName} checked in for ${appointment.specialty}. Queue position ${appointment.queuePosition ?? 1}.`,
    appointmentId: appointment.id,
    type: 'appointment' as const,
  };
}

export function buildCancellationNotification(appointment: Appointment) {
  return {
    id: `cancel-${appointment.id}`,
    title: 'Appointment cancelled',
    message: `Appointment ${appointment.id} on ${new Date(appointment.scheduledAt).toLocaleDateString()} has been cancelled.`,
    appointmentId: appointment.id,
    type: 'appointment' as const,
  };
}
