import type {
  Appointment,
  AppointmentListResult,
  AppointmentPriority,
  AppointmentStatus,
  CheckInStatus,
  QueueEntry,
  VisitType,
  WaitlistEntry,
} from '@/services/appointments/types';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asAppointmentStatus(value: unknown): AppointmentStatus {
  const status = asString(value, 'scheduled');
  const allowed: AppointmentStatus[] = [
    'scheduled',
    'confirmed',
    'checked_in',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
    'rescheduled',
    'waiting',
    'delayed',
  ];
  return allowed.includes(status as AppointmentStatus)
    ? (status as AppointmentStatus)
    : 'scheduled';
}

function asVisitType(value: unknown): VisitType {
  const visitType = asString(value, 'in_person');
  const allowed: VisitType[] = [
    'in_person',
    'telemedicine',
    'home_care',
    'laboratory',
    'radiology',
    'pharmacy',
    'follow_up',
  ];
  return allowed.includes(visitType as VisitType)
    ? (visitType as VisitType)
    : 'in_person';
}

function asPriority(value: unknown): AppointmentPriority {
  const priority = asString(value, 'routine');
  return priority === 'urgent' || priority === 'emergency' ? priority : 'routine';
}

function asCheckInStatus(value: unknown): CheckInStatus {
  const status = asString(value, 'not_checked_in');
  const allowed: CheckInStatus[] = [
    'not_checked_in',
    'checked_in',
    'in_waiting_room',
    'with_provider',
  ];
  return allowed.includes(status as CheckInStatus)
    ? (status as CheckInStatus)
    : 'not_checked_in';
}

export function mapAppointmentDto(dto: unknown): Appointment {
  const raw = asRecord(dto);
  const patient = asRecord(raw.patient);
  const provider = asRecord(raw.provider);
  const facility = asRecord(raw.facility);

  return {
    id: asString(raw.id),
    patient: {
      id: asString(patient.id),
      fullName: asString(patient.fullName),
      mrn: asString(patient.mrn),
    },
    provider: {
      id: asString(provider.id),
      fullName: asString(provider.fullName),
      specialty: asString(provider.specialty),
      department: asString(provider.department),
    },
    facility: {
      id: asString(facility.id),
      name: asString(facility.name),
      address: asString(facility.address),
    },
    department: asString(raw.department),
    specialty: asString(raw.specialty),
    room: asString(raw.room),
    scheduledAt: asString(raw.scheduledAt),
    durationMinutes: asNumber(raw.durationMinutes, 30),
    status: asAppointmentStatus(raw.status),
    visitType: asVisitType(raw.visitType),
    priority: asPriority(raw.priority),
    insurance: asString(raw.insurance),
    reason: asString(raw.reason),
    clinicalNotes: asOptionalString(raw.clinicalNotes),
    followUpRequired: asBoolean(raw.followUpRequired),
    referralId: asOptionalString(raw.referralId),
    checkInStatus: asCheckInStatus(raw.checkInStatus),
    queuePosition:
      raw.queuePosition == null ? undefined : asNumber(raw.queuePosition),
    telehealthLink: asOptionalString(raw.telehealthLink),
    isRecurring: asBoolean(raw.isRecurring),
    recurringPattern: asOptionalString(raw.recurringPattern),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
  };
}

export function mapQueueEntryDto(dto: unknown): QueueEntry {
  const raw = asRecord(dto);
  return {
    id: asString(raw.id),
    appointmentId: asString(raw.appointmentId),
    patientName: asString(raw.patientName),
    providerName: asString(raw.providerName),
    position: asNumber(raw.position),
    estimatedWaitMinutes: asNumber(raw.estimatedWaitMinutes),
    checkInStatus: asCheckInStatus(raw.checkInStatus),
    checkedInAt: asOptionalString(raw.checkedInAt),
  };
}

export function mapWaitlistEntryDto(dto: unknown): WaitlistEntry {
  const raw = asRecord(dto);
  return {
    id: asString(raw.id),
    patientId: asString(raw.patientId),
    patientName: asString(raw.patientName),
    providerId: asString(raw.providerId),
    providerName: asString(raw.providerName),
    specialty: asString(raw.specialty),
    requestedDate: asString(raw.requestedDate),
    priority: asPriority(raw.priority),
    addedAt: asString(raw.addedAt),
    position: asNumber(raw.position),
  };
}

export function mapPaginatedAppointmentsDto(dto: unknown): AppointmentListResult {
  const raw = asRecord(dto);
  const items = Array.isArray(raw.items) ? raw.items.map(mapAppointmentDto) : [];
  return {
    items,
    total: asNumber(raw.total, items.length),
    page: asNumber(raw.page, 1),
    pageSize: asNumber(raw.pageSize, items.length || 25),
  };
}

export function mapAppointmentArrayDto(dto: unknown): Appointment[] {
  return Array.isArray(dto) ? dto.map(mapAppointmentDto) : [];
}

export function mapQueueArrayDto(dto: unknown): QueueEntry[] {
  return Array.isArray(dto) ? dto.map(mapQueueEntryDto) : [];
}

export function mapWaitlistArrayDto(dto: unknown): WaitlistEntry[] {
  return Array.isArray(dto) ? dto.map(mapWaitlistEntryDto) : [];
}

export function filtersToQuery(filters?: import('@medease/appointments-contract').AppointmentFilters) {
  return filters as
    | Record<string, string | number | boolean | null | undefined>
    | undefined;
}
