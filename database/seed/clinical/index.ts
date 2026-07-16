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

/** Clinical seeds — demo patients aligned with professional portal mock panel. */
export const clinicalSeed: SeedModule = {
  name: 'clinical',
  async run(ctx) {
    if (ctx.dryRun) {
      return;
    }

    const { PrismaClient, runInSystemTransaction } = await import('@medease/prisma');
    type TransactionClient = Parameters<Parameters<typeof runInSystemTransaction>[1]>[0];
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
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
