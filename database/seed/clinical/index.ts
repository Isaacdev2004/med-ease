import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_PATIENT_USER_ID = '01930000-0000-7000-8000-000000000106';

type PatientSeed = {
  id: string;
  mrn: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  status: 'active' | 'inactive' | 'observation';
  userId?: string;
  primaryProviderId?: string;
  nationalId: string;
  email: string;
  phone: string;
};

const DEMO_PATIENTS: PatientSeed[] = [
  {
    id: '01930000-0000-7000-8000-000000000301',
    mrn: 'MRN-10293',
    fullName: 'Sarah Jenkins',
    dateOfBirth: '1985-03-14',
    gender: 'female',
    status: 'active',
    userId: DEMO_PATIENT_USER_ID,
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-882910384',
    email: 'patient@medease.health',
    phone: '+1-555-0106',
  },
  {
    id: '01930000-0000-7000-8000-000000000302',
    mrn: 'MRN-20481',
    fullName: 'James Wilson',
    dateOfBirth: '1978-11-02',
    gender: 'male',
    status: 'active',
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-441029183',
    email: 'james.wilson@example.com',
    phone: '+1-555-0201',
  },
  {
    id: '01930000-0000-7000-8000-000000000303',
    mrn: 'MRN-33012',
    fullName: 'Maria Lopez',
    dateOfBirth: '1992-07-21',
    gender: 'female',
    status: 'observation',
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-330129847',
    email: 'maria.lopez@example.com',
    phone: '+1-555-0202',
  },
  {
    id: '01930000-0000-7000-8000-000000000304',
    mrn: 'MRN-44102',
    fullName: 'David Chen',
    dateOfBirth: '1965-01-09',
    gender: 'male',
    status: 'active',
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-229103847',
    email: 'david.chen@example.com',
    phone: '+1-555-0203',
  },
  {
    id: '01930000-0000-7000-8000-000000000305',
    mrn: 'MRN-55291',
    fullName: 'Emily Rodriguez',
    dateOfBirth: '2010-05-30',
    gender: 'female',
    status: 'inactive',
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-552910384',
    email: 'emily.rodriguez@example.com',
    phone: '+1-555-0204',
  },
  {
    id: '01930000-0000-7000-8000-000000000306',
    mrn: 'MRN-66102',
    fullName: 'Michael Brown',
    dateOfBirth: '1988-09-17',
    gender: 'male',
    status: 'active',
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-661029384',
    email: 'michael.brown@example.com',
    phone: '+1-555-0205',
  },
  {
    id: '01930000-0000-7000-8000-000000000307',
    mrn: 'MRN-77201',
    fullName: 'Aisha Patel',
    dateOfBirth: '1974-12-03',
    gender: 'female',
    status: 'active',
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-772019384',
    email: 'aisha.patel@example.com',
    phone: '+1-555-0206',
  },
  {
    id: '01930000-0000-7000-8000-000000000308',
    mrn: 'MRN-88312',
    fullName: 'Robert Taylor',
    dateOfBirth: '1959-04-22',
    gender: 'male',
    status: 'observation',
    primaryProviderId: DEMO_PHYSICIAN_ID,
    nationalId: 'US-883012947',
    email: 'robert.taylor@example.com',
    phone: '+1-555-0207',
  },
];

const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';
const DEMO_FACILITY_LYON = '01930000-0000-7000-8000-000000000202';
const DEMO_FACILITY_TOUR = '01930000-0000-7000-8000-000000000203';

const DEMO_PROVIDER_MARTIN = '01930000-0000-7000-8000-000000000501';
const DEMO_PROVIDER_BERNARD = '01930000-0000-7000-8000-000000000502';

function scheduleDaysFromNow(days: number, hour = 9, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function patientRef(patientId: string) {
  const patient = DEMO_PATIENTS.find((p) => p.id === patientId);
  if (!patient) {
    throw new Error(`Unknown demo patient: ${patientId}`);
  }
  return patient;
}

type AppointmentSeed = {
  id: string;
  patientId: string;
  providerId: string;
  providerFullName: string;
  providerSpecialty: string;
  providerDepartment: string;
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  scheduledAt: Date;
  durationMinutes: number;
  status:
    | 'scheduled'
    | 'confirmed'
    | 'checked_in'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';
  visitType: string;
  specialty: string;
  department: string;
  room: string;
  reason: string;
  insurance: string;
  priority: 'routine' | 'urgent' | 'emergency';
  checkInStatus: string;
  queuePosition?: number;
  telehealthLink?: string;
  notes?: string;
};

/** Demo schedule — today, upcoming, and past appointments for buyer walkthrough. */
function buildDemoAppointments() {
  return ([
    {
      id: '01930000-0000-7000-8000-000000000601',
      patientId: DEMO_PATIENTS[0]!.id,
      providerId: DEMO_PHYSICIAN_ID,
      providerFullName: 'Dr. Emily Chen',
      providerSpecialty: 'Cardiology',
      providerDepartment: 'Cardiology',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      facilityAddress: "47 Blvd de l'Hôpital, Paris",
      scheduledAt: scheduleDaysFromNow(0, 9, 0),
      durationMinutes: 30,
      status: 'checked_in',
      visitType: 'in_person',
      specialty: 'Cardiology',
      department: 'Cardiology',
      room: 'Room 104',
      reason: 'Follow-up visit',
      insurance: 'AXA Santé',
      priority: 'routine',
      checkInStatus: 'checked_in',
      queuePosition: 1,
    },
    {
      id: '01930000-0000-7000-8000-000000000602',
      patientId: DEMO_PATIENTS[1]!.id,
      providerId: DEMO_PROVIDER_MARTIN,
      providerFullName: 'Dr. Jean-Luc Martin',
      providerSpecialty: 'General Practice',
      providerDepartment: 'Internal Medicine',
      facilityId: DEMO_FACILITY_LYON,
      facilityName: 'Hôpital Édouard Herriot',
      facilityAddress: "5 Place d'Arsonval, Lyon",
      scheduledAt: scheduleDaysFromNow(0, 10, 30),
      durationMinutes: 20,
      status: 'confirmed',
      visitType: 'in_person',
      specialty: 'General Practice',
      department: 'Internal Medicine',
      room: 'Room 210',
      reason: 'Annual check-up',
      insurance: 'Mutuelle Générale',
      priority: 'routine',
      checkInStatus: 'not_checked_in',
    },
    {
      id: '01930000-0000-7000-8000-000000000603',
      patientId: DEMO_PATIENTS[2]!.id,
      providerId: DEMO_PROVIDER_BERNARD,
      providerFullName: 'Dr. Sophie Bernard',
      providerSpecialty: 'Neurology',
      providerDepartment: 'Neurology',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      facilityAddress: "47 Blvd de l'Hôpital, Paris",
      scheduledAt: scheduleDaysFromNow(0, 14, 0),
      durationMinutes: 45,
      status: 'in_progress',
      visitType: 'in_person',
      specialty: 'Neurology',
      department: 'Neurology',
      room: 'Room 318',
      reason: 'Specialist consultation',
      insurance: 'Harmonie Mutuelle',
      priority: 'urgent',
      checkInStatus: 'with_provider',
      queuePosition: 2,
    },
    {
      id: '01930000-0000-7000-8000-000000000604',
      patientId: DEMO_PATIENTS[3]!.id,
      providerId: DEMO_PHYSICIAN_ID,
      providerFullName: 'Dr. Emily Chen',
      providerSpecialty: 'Cardiology',
      providerDepartment: 'Cardiology',
      facilityId: DEMO_FACILITY_TOUR,
      facilityName: 'Clinique Pasteur',
      facilityAddress: '45 Avenue de Lombez, Toulouse',
      scheduledAt: scheduleDaysFromNow(0, 16, 0),
      durationMinutes: 30,
      status: 'scheduled',
      visitType: 'telemedicine',
      specialty: 'Telemedicine',
      department: 'Virtual Care',
      room: 'Virtual',
      reason: 'Telehealth consult',
      insurance: 'CNAM',
      priority: 'routine',
      checkInStatus: 'not_checked_in',
      telehealthLink: 'https://telehealth.medease.health/session/demo-604',
    },
    {
      id: '01930000-0000-7000-8000-000000000605',
      patientId: DEMO_PATIENTS[4]!.id,
      providerId: DEMO_PROVIDER_MARTIN,
      providerFullName: 'Dr. Jean-Luc Martin',
      providerSpecialty: 'General Practice',
      providerDepartment: 'Internal Medicine',
      facilityId: DEMO_FACILITY_LYON,
      facilityName: 'Hôpital Édouard Herriot',
      facilityAddress: "5 Place d'Arsonval, Lyon",
      scheduledAt: scheduleDaysFromNow(1, 9, 30),
      durationMinutes: 30,
      status: 'scheduled',
      visitType: 'in_person',
      specialty: 'General Practice',
      department: 'Internal Medicine',
      room: 'Room 112',
      reason: 'Medication review',
      insurance: 'AXA Santé',
      priority: 'routine',
      checkInStatus: 'not_checked_in',
    },
    {
      id: '01930000-0000-7000-8000-000000000606',
      patientId: DEMO_PATIENTS[5]!.id,
      providerId: DEMO_PHYSICIAN_ID,
      providerFullName: 'Dr. Emily Chen',
      providerSpecialty: 'Cardiology',
      providerDepartment: 'Cardiology',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      facilityAddress: "47 Blvd de l'Hôpital, Paris",
      scheduledAt: scheduleDaysFromNow(2, 11, 0),
      durationMinutes: 45,
      status: 'confirmed',
      visitType: 'in_person',
      specialty: 'Cardiology',
      department: 'Cardiology',
      room: 'Room 105',
      reason: 'Chest pain evaluation',
      insurance: 'Mutuelle Générale',
      priority: 'urgent',
      checkInStatus: 'not_checked_in',
    },
    {
      id: '01930000-0000-7000-8000-000000000607',
      patientId: DEMO_PATIENTS[6]!.id,
      providerId: DEMO_PROVIDER_BERNARD,
      providerFullName: 'Dr. Sophie Bernard',
      providerSpecialty: 'Neurology',
      providerDepartment: 'Neurology',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      facilityAddress: "47 Blvd de l'Hôpital, Paris",
      scheduledAt: scheduleDaysFromNow(3, 15, 0),
      durationMinutes: 30,
      status: 'scheduled',
      visitType: 'in_person',
      specialty: 'Neurology',
      department: 'Neurology',
      room: 'Room 320',
      reason: 'Chronic disease management',
      insurance: 'Harmonie Mutuelle',
      priority: 'routine',
      checkInStatus: 'not_checked_in',
    },
    {
      id: '01930000-0000-7000-8000-000000000608',
      patientId: DEMO_PATIENTS[7]!.id,
      providerId: DEMO_PROVIDER_MARTIN,
      providerFullName: 'Dr. Jean-Luc Martin',
      providerSpecialty: 'General Practice',
      providerDepartment: 'Internal Medicine',
      facilityId: DEMO_FACILITY_TOUR,
      facilityName: 'Clinique Pasteur',
      facilityAddress: '45 Avenue de Lombez, Toulouse',
      scheduledAt: scheduleDaysFromNow(5, 10, 0),
      durationMinutes: 30,
      status: 'confirmed',
      visitType: 'telemedicine',
      specialty: 'Telemedicine',
      department: 'Virtual Care',
      room: 'Virtual',
      reason: 'Post-operative review',
      insurance: 'CNAM',
      priority: 'routine',
      checkInStatus: 'not_checked_in',
      telehealthLink: 'https://telehealth.medease.health/session/demo-608',
    },
    {
      id: '01930000-0000-7000-8000-000000000609',
      patientId: DEMO_PATIENTS[0]!.id,
      providerId: DEMO_PHYSICIAN_ID,
      providerFullName: 'Dr. Emily Chen',
      providerSpecialty: 'Cardiology',
      providerDepartment: 'Cardiology',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      facilityAddress: "47 Blvd de l'Hôpital, Paris",
      scheduledAt: scheduleDaysFromNow(-1, 9, 0),
      durationMinutes: 30,
      status: 'completed',
      visitType: 'in_person',
      specialty: 'Cardiology',
      department: 'Cardiology',
      room: 'Room 104',
      reason: 'Follow-up visit',
      insurance: 'AXA Santé',
      priority: 'routine',
      checkInStatus: 'with_provider',
      notes: 'Patient stable. Continue current regimen.',
    },
    {
      id: '01930000-0000-7000-8000-000000000610',
      patientId: DEMO_PATIENTS[1]!.id,
      providerId: DEMO_PROVIDER_MARTIN,
      providerFullName: 'Dr. Jean-Luc Martin',
      providerSpecialty: 'General Practice',
      providerDepartment: 'Internal Medicine',
      facilityId: DEMO_FACILITY_LYON,
      facilityName: 'Hôpital Édouard Herriot',
      facilityAddress: "5 Place d'Arsonval, Lyon",
      scheduledAt: scheduleDaysFromNow(-3, 14, 0),
      durationMinutes: 20,
      status: 'completed',
      visitType: 'in_person',
      specialty: 'General Practice',
      department: 'Internal Medicine',
      room: 'Room 208',
      reason: 'Lab work review',
      insurance: 'Mutuelle Générale',
      priority: 'routine',
      checkInStatus: 'with_provider',
    },
    {
      id: '01930000-0000-7000-8000-000000000611',
      patientId: DEMO_PATIENTS[2]!.id,
      providerId: DEMO_PROVIDER_BERNARD,
      providerFullName: 'Dr. Sophie Bernard',
      providerSpecialty: 'Neurology',
      providerDepartment: 'Neurology',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      facilityAddress: "47 Blvd de l'Hôpital, Paris",
      scheduledAt: scheduleDaysFromNow(-5, 11, 30),
      durationMinutes: 45,
      status: 'cancelled',
      visitType: 'in_person',
      specialty: 'Neurology',
      department: 'Neurology',
      room: 'Room 315',
      reason: 'Specialist consultation',
      insurance: 'Harmonie Mutuelle',
      priority: 'routine',
      checkInStatus: 'not_checked_in',
      notes: 'Cancelled by patient — rescheduled for next week.',
    },
    {
      id: '01930000-0000-7000-8000-000000000612',
      patientId: DEMO_PATIENTS[3]!.id,
      providerId: DEMO_PHYSICIAN_ID,
      providerFullName: 'Dr. Emily Chen',
      providerSpecialty: 'Cardiology',
      providerDepartment: 'Cardiology',
      facilityId: DEMO_FACILITY_TOUR,
      facilityName: 'Clinique Pasteur',
      facilityAddress: '45 Avenue de Lombez, Toulouse',
      scheduledAt: scheduleDaysFromNow(-7, 8, 30),
      durationMinutes: 30,
      status: 'no_show',
      visitType: 'in_person',
      specialty: 'Cardiology',
      department: 'Cardiology',
      room: 'Room 101',
      reason: 'Routine ECG',
      insurance: 'CNAM',
      priority: 'routine',
      checkInStatus: 'not_checked_in',
    },
  ] as AppointmentSeed[]).map((row): AppointmentSeed & { patientFullName: string; patientMrn: string } => {
    const patient = patientRef(row.patientId);
    return {
      ...row,
      patientFullName: patient.fullName,
      patientMrn: patient.mrn,
    };
  });
}

/** Clinical seeds — demo patients aligned with professional portal mock panel. */
export const clinicalSeed: SeedModule = {
  name: 'clinical',
  async run(ctx) {
    if (ctx.dryRun) {
      return;
    }

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        for (const patient of DEMO_PATIENTS) {
          const patientNum = patient.id.slice(-3);
          const childId = (slot: number) =>
            `01930000-0000-7000-8000-00000000${patientNum}${slot}`;

          await tx.patient.upsert({
            where: { id: patient.id },
            create: {
              id: patient.id,
              tenantId: DEMO_TENANT_ID,
              mrn: patient.mrn,
              fullName: patient.fullName,
              dateOfBirth: new Date(patient.dateOfBirth),
              gender: patient.gender,
              status: patient.status,
              userId: patient.userId,
              primaryProviderId: patient.primaryProviderId,
              fhirResourceId: patient.id,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              mrn: patient.mrn,
              fullName: patient.fullName,
              dateOfBirth: new Date(patient.dateOfBirth),
              gender: patient.gender,
              status: patient.status,
              userId: patient.userId,
              primaryProviderId: patient.primaryProviderId,
            },
          });

          await tx.patientIdentifier.upsert({
            where: {
              tenantId_type_value: {
                tenantId: DEMO_TENANT_ID,
                type: 'mrn',
                value: patient.mrn,
              },
            },
            create: {
              id: childId(1),
              tenantId: DEMO_TENANT_ID,
              patientId: patient.id,
              type: 'mrn',
              value: patient.mrn,
              isPrimary: true,
            },
            update: {
              patientId: patient.id,
              isPrimary: true,
            },
          });

          await tx.patientIdentifier.upsert({
            where: {
              tenantId_type_value: {
                tenantId: DEMO_TENANT_ID,
                type: 'national_id',
                value: patient.nationalId,
              },
            },
            create: {
              id: childId(2),
              tenantId: DEMO_TENANT_ID,
              patientId: patient.id,
              type: 'national_id',
              value: patient.nationalId,
              isPrimary: false,
            },
            update: {
              patientId: patient.id,
            },
          });

          await tx.patientContact.upsert({
            where: { id: childId(3) },
            create: {
              id: childId(3),
              tenantId: DEMO_TENANT_ID,
              patientId: patient.id,
              type: 'email',
              value: patient.email,
              isPrimary: true,
            },
            update: {
              value: patient.email,
            },
          });

          await tx.patientContact.upsert({
            where: { id: childId(4) },
            create: {
              id: childId(4),
              tenantId: DEMO_TENANT_ID,
              patientId: patient.id,
              type: 'phone',
              value: patient.phone,
              isPrimary: true,
            },
            update: {
              value: patient.phone,
            },
          });

          await tx.patientAddress.upsert({
            where: { id: childId(5) },
            create: {
              id: childId(5),
              tenantId: DEMO_TENANT_ID,
              patientId: patient.id,
              type: 'home',
              street: `${100 + Number(patientNum)} Main Street`,
              city: 'Boston',
              state: 'MA',
              postalCode: '02108',
              country: 'US',
              isPrimary: true,
            },
            update: {},
          });

          await tx.patientEmergencyContact.upsert({
            where: { id: childId(6) },
            create: {
              id: childId(6),
              tenantId: DEMO_TENANT_ID,
              patientId: patient.id,
              name: 'Emergency Contact',
              relationship: 'Spouse',
              phone: '+1-555-9999',
              email: `emergency.${patient.email}`,
              isPrimary: true,
            },
            update: {},
          });

          await tx.patientPreference.upsert({
            where: { patientId: patient.id },
            create: {
              id: childId(7),
              tenantId: DEMO_TENANT_ID,
              patientId: patient.id,
              language: 'en-US',
              maritalStatus: 'married',
              occupation: 'Professional',
              nationality: 'US',
              smoking: 'never',
            },
            update: {},
          });
        }

        // Sarah Jenkins — penicillin allergy (matches PHR mock)
        await tx.patientAllergy.upsert({
          where: { id: '01930000-0000-7000-8000-000000000401' },
          create: {
            id: '01930000-0000-7000-8000-000000000401',
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENTS[0]!.id,
            allergen: 'Penicillin',
            type: 'drug',
            severity: 'severe',
            reaction: 'Anaphylaxis',
          },
          update: {},
        });

        for (const appointment of buildDemoAppointments()) {
          await tx.appointment.upsert({
            where: { id: appointment.id },
            create: {
              id: appointment.id,
              tenantId: DEMO_TENANT_ID,
              facilityId: appointment.facilityId,
              patientId: appointment.patientId,
              providerId: appointment.providerId,
              scheduledAt: appointment.scheduledAt,
              durationMinutes: appointment.durationMinutes,
              status: appointment.status,
              visitType: appointment.visitType,
              referralId: null,
              telehealthLink: appointment.telehealthLink,
              notes: appointment.notes,
              fhirResourceId: appointment.id,
              specialty: appointment.specialty,
              department: appointment.department,
              room: appointment.room,
              reason: appointment.reason,
              insurance: appointment.insurance,
              priority: appointment.priority,
              checkInStatus: appointment.checkInStatus,
              queuePosition: appointment.queuePosition,
              followUpRequired: false,
              isRecurring: false,
              patientFullName: appointment.patientFullName,
              patientMrn: appointment.patientMrn,
              providerFullName: appointment.providerFullName,
              providerSpecialty: appointment.providerSpecialty,
              providerDepartment: appointment.providerDepartment,
              facilityName: appointment.facilityName,
              facilityAddress: appointment.facilityAddress,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              scheduledAt: appointment.scheduledAt,
              durationMinutes: appointment.durationMinutes,
              status: appointment.status,
              visitType: appointment.visitType,
              telehealthLink: appointment.telehealthLink,
              notes: appointment.notes,
              specialty: appointment.specialty,
              department: appointment.department,
              room: appointment.room,
              reason: appointment.reason,
              insurance: appointment.insurance,
              priority: appointment.priority,
              checkInStatus: appointment.checkInStatus,
              queuePosition: appointment.queuePosition,
              patientFullName: appointment.patientFullName,
              patientMrn: appointment.patientMrn,
              providerFullName: appointment.providerFullName,
              providerSpecialty: appointment.providerSpecialty,
              providerDepartment: appointment.providerDepartment,
              facilityName: appointment.facilityName,
              facilityAddress: appointment.facilityAddress,
              updatedBy: DEMO_ADMIN_ID,
            },
          });
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
