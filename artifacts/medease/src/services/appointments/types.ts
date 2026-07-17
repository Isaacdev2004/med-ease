export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled'
  | 'waiting'
  | 'delayed';

export type VisitType =
  | 'in_person'
  | 'telemedicine'
  | 'home_care'
  | 'laboratory'
  | 'radiology'
  | 'pharmacy'
  | 'follow_up';

export type AppointmentPriority = 'routine' | 'urgent' | 'emergency';

export type CheckInStatus =
  'not_checked_in' | 'checked_in' | 'in_waiting_room' | 'with_provider';

export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda' | 'timeline';

export interface AppointmentPatient {
  id: string;
  fullName: string;
  mrn: string;
}

export interface AppointmentProvider {
  id: string;
  fullName: string;
  specialty: string;
  department: string;
}

export interface AppointmentFacility {
  id: string;
  name: string;
  address: string;
}

export interface Appointment {
  id: string;
  patient: AppointmentPatient;
  provider: AppointmentProvider;
  facility: AppointmentFacility;
  department: string;
  specialty: string;
  room: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  visitType: VisitType;
  priority: AppointmentPriority;
  insurance: string;
  reason: string;
  clinicalNotes?: string;
  followUpRequired: boolean;
  referralId?: string;
  checkInStatus: CheckInStatus;
  queuePosition?: number;
  telehealthLink?: string;
  isRecurring: boolean;
  recurringPattern?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface WaitlistEntry {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  specialty: string;
  requestedDate: string;
  priority: AppointmentPriority;
  addedAt: string;
  position: number;
}

export interface QueueEntry {
  id: string;
  appointmentId: string;
  patientName: string;
  providerName: string;
  position: number;
  estimatedWaitMinutes: number;
  checkInStatus: CheckInStatus;
  checkedInAt?: string;
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

export interface AppointmentFilters {
  q?: string;
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  department?: string;
  specialty?: string;
  status?: AppointmentStatus;
  visitType?: VisitType;
  priority?: AppointmentPriority;
  telemedicine?: boolean;
  checkedIn?: boolean;
  followUp?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface AppointmentListResult {
  items: Appointment[];
  total: number;
  page: number;
  pageSize: number;
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

export interface BookAppointmentInput {
  patientId: string;
  providerId: string;
  facilityId: string;
  specialty: string;
  serviceType: string;
  scheduledAt: string;
  durationMinutes?: number;
  visitType: VisitType;
  reason: string;
  insurance?: string;
  notes?: string;
}

export interface RescheduleAppointmentInput {
  appointmentId: string;
  scheduledAt: string;
  reason?: string;
}

export interface CancelAppointmentInput {
  appointmentId: string;
  reason?: string;
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
