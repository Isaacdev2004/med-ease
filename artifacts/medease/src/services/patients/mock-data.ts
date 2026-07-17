import type { Patient } from '@medease/patients-contract';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_PATIENT_USER_ID = '01930000-0000-7000-8000-000000000106';

const BASE_TS = '2026-07-01T12:00:00.000Z';

function patient(
  patientId: string,
  mrn: string,
  fullName: string,
  dateOfBirth: string,
  gender: Patient['gender'],
  status: Patient['status'],
  options: { userId?: string; fhirSuffix?: string } = {},
): Patient {
  const suffix = options.fhirSuffix ?? patientId.slice(-3);
  return {
    patientId,
    tenantId: DEMO_TENANT_ID,
    userId: options.userId,
    mrn,
    fullName,
    dateOfBirth,
    gender,
    status,
    primaryProviderId: DEMO_PHYSICIAN_ID,
    fhirResourceId: `01930000-0000-7000-8000-00000000f${suffix}`,
    createdBy: DEMO_ADMIN_ID,
    createdAt: BASE_TS,
    updatedAt: BASE_TS,
    version: 1,
  };
}

/** Demo patients aligned with database clinical seed and professional portal panel. */
export const MOCK_PATIENTS: Patient[] = [
  patient(
    '01930000-0000-7000-8000-000000000301',
    'MRN-10293',
    'Sarah Jenkins',
    '1985-03-14',
    'female',
    'active',
    { userId: DEMO_PATIENT_USER_ID, fhirSuffix: '301' },
  ),
  patient(
    '01930000-0000-7000-8000-000000000302',
    'MRN-20481',
    'James Wilson',
    '1978-11-02',
    'male',
    'active',
    {
      fhirSuffix: '302',
    },
  ),
  patient(
    '01930000-0000-7000-8000-000000000303',
    'MRN-33012',
    'Maria Lopez',
    '1992-07-21',
    'female',
    'observation',
    {
      fhirSuffix: '303',
    },
  ),
  patient(
    '01930000-0000-7000-8000-000000000304',
    'MRN-44102',
    'David Chen',
    '1965-01-09',
    'male',
    'active',
    {
      fhirSuffix: '304',
    },
  ),
  patient(
    '01930000-0000-7000-8000-000000000305',
    'MRN-55291',
    'Emily Rodriguez',
    '2010-05-30',
    'female',
    'inactive',
    {
      fhirSuffix: '305',
    },
  ),
  patient(
    '01930000-0000-7000-8000-000000000306',
    'MRN-66102',
    'Michael Brown',
    '1988-09-17',
    'male',
    'active',
    {
      fhirSuffix: '306',
    },
  ),
  patient(
    '01930000-0000-7000-8000-000000000307',
    'MRN-77201',
    'Aisha Patel',
    '1974-12-03',
    'female',
    'active',
    {
      fhirSuffix: '307',
    },
  ),
  patient(
    '01930000-0000-7000-8000-000000000308',
    'MRN-88312',
    'Robert Taylor',
    '1959-04-22',
    'male',
    'observation',
    {
      fhirSuffix: '308',
    },
  ),
];
