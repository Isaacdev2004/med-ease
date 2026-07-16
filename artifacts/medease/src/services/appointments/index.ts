export { appointmentService } from '@/services/appointments/appointment.service';
export { appointmentOfflineQueue } from '@/services/appointments/offline-sync';
export {
  appointmentToCalendarEvent,
  mapAppointmentsToCalendarEvents,
  toFhirAppointmentReference,
  toFhirScheduleReference,
  toFhirSlotReference,
} from '@/services/appointments/mapper';
export {
  getAvailableSlots,
  getAllProviderAvailability,
  getProviderAvailability,
} from '@/services/appointments/availability';
export {
  appointmentsToEvents,
  buildMonthGrid,
  buildWeekDays,
  buildDayEvents,
  buildAgendaEvents,
  BLOCKED_HOLIDAYS,
} from '@/services/appointments/calendar';
export { validateBookingSlot, suggestNextAvailableSlot } from '@/services/appointments/scheduler';
export {
  buildAppointmentReminder,
  buildCheckInNotification,
  buildCancellationNotification,
} from '@/services/appointments/notifications';
export { appointmentRepository } from '@/services/appointments/repository';
export { MOCK_APPOINTMENTS, MOCK_WAITLIST, PROVIDERS, FACILITIES, buildQueueFromAppointments } from '@/services/appointments/mock-data';
export type {
  Appointment,
  AppointmentAnalytics,
  AppointmentFilters,
  AppointmentListResult,
  AppointmentPriority,
  AppointmentProvider,
  AppointmentStatus,
  BookAppointmentInput,
  CalendarEvent,
  CalendarViewMode,
  CancelAppointmentInput,
  CheckInInput,
  CheckInStatus,
  ProviderAvailability,
  QueueEntry,
  RescheduleAppointmentInput,
  TimeSlot,
  VisitType,
  WaitlistEntry,
} from '@/services/appointments/types';
export { AUTH_USER_PATIENT_MAP, SPECIALTIES } from '@/services/appointments/types';
