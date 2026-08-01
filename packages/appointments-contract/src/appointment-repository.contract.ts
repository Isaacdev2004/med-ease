import type {
  Appointment,
  AppointmentFilters,
  AppointmentListResult,
  BookAppointmentInput,
  CancelAppointmentInput,
  QueueEntry,
  RescheduleAppointmentInput,
  WaitlistEntry,
} from './appointment.types';

/**
 * Canonical Appointments repository contract — single source of truth for mock and HTTP adapters.
 */
export interface AppointmentsRepositoryContract {
  search(filters?: AppointmentFilters): Promise<AppointmentListResult>;
  getAll(filters?: AppointmentFilters): Promise<Appointment[]>;
  getById(id: string): Promise<Appointment>;
  getUpcoming(filters?: AppointmentFilters): Promise<Appointment[]>;
  getPast(filters?: AppointmentFilters): Promise<Appointment[]>;
  getToday(filters?: AppointmentFilters): Promise<Appointment[]>;
  getTelemedicine(filters?: AppointmentFilters): Promise<Appointment[]>;
  book(input: BookAppointmentInput): Promise<Appointment>;
  reschedule(
    appointmentId: string,
    input: RescheduleAppointmentInput,
  ): Promise<Appointment>;
  cancel(
    appointmentId: string,
    input?: CancelAppointmentInput,
  ): Promise<Appointment>;
  checkIn(appointmentId: string): Promise<Appointment>;
  getWaitlist(): Promise<WaitlistEntry[]>;
  getQueue(filters?: AppointmentFilters): Promise<QueueEntry[]>;
}
