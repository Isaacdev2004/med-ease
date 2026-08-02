import type {
  Appointment as ContractAppointment,
  AppointmentFilters as ContractAppointmentFilters,
  AppointmentPatient,
  AppointmentProvider,
  AppointmentFacility,
  AppointmentPriority,
  BookAppointmentInput,
  CancelAppointmentInput,
  CheckInStatus,
  QueueEntry,
  RescheduleAppointmentInput,
  VisitType,
  WaitlistEntry,
} from '@medease/appointments-contract';

export type {
  AppointmentPatient,
  AppointmentProvider,
  AppointmentFacility,
  AppointmentPriority,
  BookAppointmentInput,
  CancelAppointmentInput,
  CheckInStatus,
  QueueEntry,
  RescheduleAppointmentInput,
  VisitType,
  WaitlistEntry,
};

/** API-backed statuses plus legacy mock/UI-only values. */
export type AppointmentStatus =
  | ContractAppointment['status']
  | 'rescheduled'
  | 'waiting'
  | 'delayed';

export interface Appointment extends Omit<ContractAppointment, 'status'> {
  status: AppointmentStatus;
}

export interface AppointmentFilters extends Omit<ContractAppointmentFilters, 'status'> {
  status?: AppointmentStatus;
}

export interface AppointmentListResult {
  items: Appointment[];
  total: number;
  page: number;
  pageSize: number;
}

export type CancelAppointmentMutationInput = CancelAppointmentInput & {
  appointmentId: string;
};

export type RescheduleAppointmentMutationInput = RescheduleAppointmentInput & {
  appointmentId: string;
};

export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda' | 'timeline';

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
  providerId: string;
  facilityId: string;
}

export interface ProviderAvailability {
  providerId: string;
  providerName: string;
  specialty: string;
  facilityId: string;
  date: string;
  slots: TimeSlot[];
  blockedSlots: string[];
}

export interface CalendarEvent {
  id: string;
  appointmentId: string;
  title: string;
  start: string;
  end: string;
  status: AppointmentStatus;
  visitType: VisitType;
  color: string;
  providerId: string;
  patientId: string;
  facilityId: string;
}

export interface AppointmentAnalytics {
  todayCount: number;
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
  noShowCount: number;
  averageWaitMinutes: number;
  utilizationPercent: number;
  bookingRatePercent: number;
  queueLength: number;
  telemedicineCount: number;
  dailyAppointments: { label: string; value: number }[];
  weeklyTrend: { label: string; value: number }[];
  monthlyUtilization: { label: string; value: number }[];
  providerWorkload: { label: string; value: number }[];
  facilityOccupancy: { label: string; value: number }[];
}

export interface CheckInInput {
  appointmentId: string;
}

export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};

export const SPECIALTIES = [
  'General Practice',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Physiotherapy',
  'Laboratory',
  'Radiology',
  'Pharmacy Consultation',
  'Home Care',
  'Telemedicine',
] as const;

export type Specialty = (typeof SPECIALTIES)[number];

/** Narrow filters for live API calls. */
export type ApiAppointmentFilters = ContractAppointmentFilters;
