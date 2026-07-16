import type {
  Appointment,
  AppointmentProvider,
  AppointmentStatus,
  QueueEntry,
  Specialty,
  VisitType,
  WaitlistEntry,
} from '@/services/appointments/types';
import { AUTH_USER_PATIENT_MAP, SPECIALTIES } from '@/services/appointments/types';

const FIRST_NAMES = [
  'Sarah', 'James', 'Maria', 'David', 'Emily', 'Michael', 'Aisha', 'Robert',
  'Sophie', 'Jean', 'Amélie', 'Pierre', 'Fatima', 'Lucas', 'Chloé', 'Thomas',
];

const LAST_NAMES = [
  'Jenkins', 'Wilson', 'Lopez', 'Chen', 'Rodriguez', 'Brown', 'Patel', 'Taylor',
  'Martin', 'Dubois', 'Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon',
];

const PROVIDERS: AppointmentProvider[] = [
  { id: 'prov-001', fullName: 'Dr. Emily Chen', specialty: 'Cardiology', department: 'Cardiology' },
  { id: 'prov-002', fullName: 'Dr. Jean-Luc Martin', specialty: 'General Practice', department: 'Internal Medicine' },
  { id: 'prov-003', fullName: 'Dr. Sophie Bernard', specialty: 'Neurology', department: 'Neurology' },
  { id: 'prov-004', fullName: 'Dr. Marie Dupont', specialty: 'Pediatrics', department: 'Pediatrics' },
  { id: 'prov-005', fullName: 'Dr. Antoine Leroy', specialty: 'Orthopedics', department: 'Orthopedics' },
  { id: 'prov-006', fullName: 'Dr. James Wilson', specialty: 'Oncology', department: 'Oncology' },
  { id: 'prov-007', fullName: 'Dr. Aisha Patel', specialty: 'Physiotherapy', department: 'Rehabilitation' },
  { id: 'prov-008', fullName: 'Dr. Nicolas Girard', specialty: 'Radiology', department: 'Imaging' },
  { id: 'prov-009', fullName: 'Pharm. Claire Lambert', specialty: 'Pharmacy Consultation', department: 'Pharmacy' },
  { id: 'prov-010', fullName: 'Dr. Camille Moreau', specialty: 'Telemedicine', department: 'Virtual Care' },
];

const FACILITIES = [
  { id: 'fac-001', name: 'Pitié-Salpêtrière', address: '47 Blvd de l\'Hôpital, Paris' },
  { id: 'fac-002', name: 'Hôpital Édouard Herriot', address: '5 Place d\'Arsonval, Lyon' },
  { id: 'fac-003', name: 'Clinique Pasteur', address: '45 Avenue de Lombez, Toulouse' },
  { id: 'fac-004', name: 'Centre Médical La Défense', address: '15 Parvis de la Défense, Paris' },
];

const REASONS = [
  'Annual check-up', 'Follow-up visit', 'Chest pain evaluation', 'Medication review',
  'Lab work', 'Physical therapy session', 'Post-operative review', 'Vaccination',
  'Chronic disease management', 'Specialist consultation', 'Imaging study', 'Telehealth consult',
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function daysOffset(days: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function mapSpecialtyToVisitType(specialty: Specialty): VisitType {
  if (specialty === 'Telemedicine') return 'telemedicine';
  if (specialty === 'Laboratory') return 'laboratory';
  if (specialty === 'Radiology') return 'radiology';
  if (specialty === 'Pharmacy Consultation') return 'pharmacy';
  if (specialty === 'Home Care') return 'home_care';
  return 'in_person';
}

export function generateAppointment(index: number): Appointment {
  const rand = seededRandom(index + 1000);
  const patientIdx = index % 40;
  const provider = pick(PROVIDERS, rand);
  const facility = pick(FACILITIES, rand);
  const specialty = pick([...SPECIALTIES], rand);
  const dayOffset = Math.floor(index / 3) - 60 + (index % 7);
  const hour = 8 + (index % 9);
  const minute = (index % 4) * 15;
  const scheduledAt = daysOffset(dayOffset, hour, minute);
  const isPast = dayOffset < 0;
  const isToday = dayOffset === 0;
  const statusPool = isPast
    ? ['completed', 'completed', 'cancelled', 'no_show', 'completed'] as AppointmentStatus[]
    : isToday
      ? ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'waiting', 'delayed'] as AppointmentStatus[]
      : ['scheduled', 'confirmed', 'scheduled', 'confirmed'] as AppointmentStatus[];
  const status = pick(statusPool, rand);
  const visitType = specialty === 'Telemedicine' ? 'telemedicine' : mapSpecialtyToVisitType(specialty);
  const checkInStatus = status === 'checked_in' || status === 'in_progress'
    ? 'checked_in' as const
    : status === 'waiting' || status === 'delayed'
      ? 'in_waiting_room' as const
      : 'not_checked_in' as const;

  const firstName = FIRST_NAMES[patientIdx % FIRST_NAMES.length]!;
  const lastName = LAST_NAMES[patientIdx % LAST_NAMES.length]!;

  return {
    id: `apt-${String(index + 1).padStart(4, '0')}`,
    patient: {
      id: `phr-${String(patientIdx + 1).padStart(3, '0')}`,
      fullName: `${firstName} ${lastName}`,
      mrn: `MRN-${10000 + patientIdx}`,
    },
    provider,
    facility,
    department: provider.department,
    specialty,
    room: `Room ${100 + (index % 20)}`,
    scheduledAt,
    durationMinutes: [15, 20, 30, 45, 60][index % 5]!,
    status,
    visitType,
    priority: index % 15 === 0 ? 'urgent' : index % 30 === 0 ? 'emergency' : 'routine',
    insurance: pick(['AXA Santé', 'Mutuelle Générale', 'Harmonie Mutuelle', 'CNAM'], rand),
    reason: pick(REASONS, rand),
    clinicalNotes: index % 4 === 0 ? 'Patient reports mild symptoms. Vitals stable.' : undefined,
    followUpRequired: index % 6 === 0,
    referralId: index % 10 === 0 ? `ref-${index}` : undefined,
    checkInStatus,
    queuePosition: checkInStatus !== 'not_checked_in' ? (index % 8) + 1 : undefined,
    telehealthLink: visitType === 'telemedicine' ? `https://telehealth.medease.health/session/apt-${index + 1}` : undefined,
    isRecurring: index % 12 === 0,
    recurringPattern: index % 12 === 0 ? 'weekly' : undefined,
    createdAt: daysOffset(dayOffset - 14, 10, 0),
    updatedAt: scheduledAt,
  };
}

export const MOCK_APPOINTMENTS: Appointment[] = Array.from({ length: 500 }, (_, i) =>
  generateAppointment(i),
);

export const MOCK_WAITLIST: WaitlistEntry[] = Array.from({ length: 24 }, (_, i) => {
  const provider = PROVIDERS[i % PROVIDERS.length]!;
  return {
    id: `wl-${i + 1}`,
    patientId: `phr-${String((i % 40) + 1).padStart(3, '0')}`,
    patientName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    providerId: provider.id,
    providerName: provider.fullName,
    specialty: provider.specialty,
    requestedDate: daysOffset(3 + (i % 14), 9, 0),
    priority: i % 5 === 0 ? 'urgent' : 'routine',
    addedAt: daysOffset(-(i % 7), 14, 0),
    position: i + 1,
  };
});

export function buildQueueFromAppointments(appointments: Appointment[]): QueueEntry[] {
  return appointments
    .filter((a) => ['checked_in', 'waiting', 'in_progress', 'delayed'].includes(a.status))
    .sort((a, b) => (a.queuePosition ?? 99) - (b.queuePosition ?? 99))
    .map((a, idx) => ({
      id: `q-${a.id}`,
      appointmentId: a.id,
      patientName: a.patient.fullName,
      providerName: a.provider.fullName,
      position: idx + 1,
      estimatedWaitMinutes: 10 + idx * 8,
      checkInStatus: a.checkInStatus,
      checkedInAt: a.checkInStatus !== 'not_checked_in' ? a.scheduledAt : undefined,
    }));
}

export function getPatientIdForUser(userId: string): string | null {
  return AUTH_USER_PATIENT_MAP[userId] ?? null;
}

export { PROVIDERS, FACILITIES };
