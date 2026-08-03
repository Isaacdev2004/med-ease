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
const DEMO_PHARMACY_ID = '01930000-0000-7000-8000-000000000701';

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

type DemoMedicationSeed = {
  prescriptionId: string;
  medicationId: string;
  reminderId: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  name: string;
  genericName: string;
  brandName?: string;
  strength: string;
  medicationClass: string;
  medicationType: string;
  dose: string;
  frequency: string;
  route: 'oral' | 'inhalation' | 'injection';
  durationDays: number;
  startDate: Date;
  endDate: Date;
  expiresAt: Date;
  refillCount: number;
  refillsRemaining: number;
  remainingDays: number;
  adherencePercent: number;
  prescribingPhysician: string;
  dispensingPharmacy: string;
  instructions: string;
  warnings: string[];
  contraindications: string[];
  sideEffects: string[];
  storage: string;
  condition: string;
  doses: Array<{
    id: string;
    scheduledAt: Date;
    slot: 'morning' | 'afternoon' | 'evening' | 'night';
    status: 'pending' | 'taken' | 'missed' | 'late' | 'skipped';
  }>;
};

/** Demo admissions / transfers — request → triage → bed → admit flow. */
function buildDemoAdmissions() {
  const now = new Date();
  return [
    {
      id: '01930000-0000-7000-8000-000000000a01',
      patientId: DEMO_PATIENTS[2]!.id,
      patientName: DEMO_PATIENTS[2]!.fullName,
      patientMrn: DEMO_PATIENTS[2]!.mrn,
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'Emergency',
      status: 'requested' as const,
      priority: 'urgent' as const,
      reason: 'Chest pain workup',
      requestedAt: now,
    },
    {
      id: '01930000-0000-7000-8000-000000000a02',
      patientId: DEMO_PATIENTS[0]!.id,
      patientName: DEMO_PATIENTS[0]!.fullName,
      patientMrn: DEMO_PATIENTS[0]!.mrn,
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'ICU-3',
      bedId: '01930000-0000-7000-8000-000000000901',
      bedLabel: 'ICU-3-01',
      status: 'admitted' as const,
      priority: 'urgent' as const,
      reason: 'Post-op monitoring',
      requestedAt: now,
      admittedAt: now,
    },
    {
      id: '01930000-0000-7000-8000-000000000a03',
      patientId: DEMO_PATIENTS[1]!.id,
      patientName: DEMO_PATIENTS[1]!.fullName,
      patientMrn: DEMO_PATIENTS[1]!.mrn,
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'Med-Surg 2B',
      status: 'triaged' as const,
      priority: 'routine' as const,
      reason: 'Elective admission',
      requestedAt: now,
      triagedAt: now,
    },
    {
      id: '01930000-0000-7000-8000-000000000a04',
      patientId: DEMO_PATIENTS[4]!.id,
      patientName: DEMO_PATIENTS[4]!.fullName,
      patientMrn: DEMO_PATIENTS[4]!.mrn,
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'Pediatrics',
      status: 'discharged' as const,
      priority: 'routine' as const,
      reason: 'Observation complete',
      requestedAt: now,
      admittedAt: now,
      dischargedAt: now,
    },
  ];
}

function buildDemoTransfers() {
  const now = new Date();
  return [
    {
      id: '01930000-0000-7000-8000-000000000b01',
      admissionId: '01930000-0000-7000-8000-000000000a02',
      patientId: DEMO_PATIENTS[0]!.id,
      patientName: DEMO_PATIENTS[0]!.fullName,
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Pitié-Salpêtrière',
      fromWard: 'Emergency',
      toFacilityId: DEMO_FACILITY_PARIS,
      toFacilityName: 'Pitié-Salpêtrière',
      toWard: 'ICU-3',
      toBedId: '01930000-0000-7000-8000-000000000901',
      status: 'in_transit' as const,
      reason: 'Step-up care',
      requestedAt: now,
      startedAt: now,
    },
    {
      id: '01930000-0000-7000-8000-000000000b02',
      patientId: DEMO_PATIENTS[1]!.id,
      patientName: DEMO_PATIENTS[1]!.fullName,
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Pitié-Salpêtrière',
      fromWard: 'Med-Surg 2B',
      fromBedId: '01930000-0000-7000-8000-000000000903',
      toFacilityId: DEMO_FACILITY_PARIS,
      toFacilityName: 'Pitié-Salpêtrière',
      toWard: 'Rehab',
      status: 'requested' as const,
      reason: 'Rehab placement',
      requestedAt: now,
    },
    {
      id: '01930000-0000-7000-8000-000000000b03',
      patientId: DEMO_PATIENTS[4]!.id,
      patientName: DEMO_PATIENTS[4]!.fullName,
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Pitié-Salpêtrière',
      fromWard: 'Pediatrics',
      toFacilityId: DEMO_FACILITY_PARIS,
      toFacilityName: 'Pitié-Salpêtrière',
      toWard: 'Observation',
      status: 'completed' as const,
      reason: 'Step-down',
      requestedAt: now,
      completedAt: now,
    },
  ];
}

/** Demo care pathway definitions + Sarah Jenkins diabetes enrollment. */
function buildDemoCarePathways() {
  return [
    {
      id: '01930000-0000-7000-8000-000000000c01',
      code: 'diabetes',
      name: 'Diabetes Management',
      description:
        'Evidence-based diabetes care pathway with HbA1c targets and medication titration.',
      completionCriteria: 'HbA1c < 7% for 2 consecutive readings',
      requiredAppointments: 4,
      requiredLabs: 3,
      medicationProtocols: ['Metformin first-line', 'GLP-1 if indicated'],
      mandatoryTasks: ['HbA1c test', 'Foot exam', 'Nutrition consult'],
      steps: [
        { id: '01930000-0000-7000-8000-000000000c11', title: 'Baseline labs', sortOrder: 0 },
        {
          id: '01930000-0000-7000-8000-000000000c12',
          title: 'Medication optimization',
          sortOrder: 1,
        },
        {
          id: '01930000-0000-7000-8000-000000000c13',
          title: '3-month review',
          sortOrder: 2,
        },
      ],
    },
    {
      id: '01930000-0000-7000-8000-000000000c02',
      code: 'hypertension',
      name: 'Hypertension Control',
      description:
        'Blood pressure management with lifestyle and pharmacologic interventions.',
      completionCriteria: 'BP < 130/80 for 3 months',
      requiredAppointments: 3,
      requiredLabs: 2,
      medicationProtocols: ['ACE inhibitor or ARB first-line'],
      mandatoryTasks: ['Daily BP log', 'Sodium reduction education'],
      steps: [
        { id: '01930000-0000-7000-8000-000000000c21', title: 'BP baseline', sortOrder: 0 },
        {
          id: '01930000-0000-7000-8000-000000000c22',
          title: 'Home monitoring setup',
          sortOrder: 1,
        },
      ],
    },
    {
      id: '01930000-0000-7000-8000-000000000c03',
      code: 'heart_failure',
      name: 'Heart Failure Care',
      description:
        'Comprehensive heart failure management and readmission prevention.',
      completionCriteria: 'Stable weight, no hospitalization 90 days',
      requiredAppointments: 5,
      requiredLabs: 4,
      medicationProtocols: ['Beta-blocker', 'ACE inhibitor', 'Diuretic'],
      mandatoryTasks: ['Daily weight', 'Fluid restriction education'],
      steps: [
        { id: '01930000-0000-7000-8000-000000000c31', title: 'Echo baseline', sortOrder: 0 },
        {
          id: '01930000-0000-7000-8000-000000000c32',
          title: 'Medication titration',
          sortOrder: 1,
        },
      ],
    },
    {
      id: '01930000-0000-7000-8000-000000000c04',
      code: 'post_surgery',
      name: 'Post-Operative Recovery',
      description: 'Structured recovery after surgical procedures.',
      completionCriteria: 'Full mobility restored, wound healed',
      requiredAppointments: 2,
      requiredLabs: 1,
      medicationProtocols: ['Analgesia protocol', 'DVT prophylaxis'],
      mandatoryTasks: ['Pain management', 'Mobility exercises'],
      steps: [
        {
          id: '01930000-0000-7000-8000-000000000c41',
          title: 'Discharge planning',
          sortOrder: 0,
        },
        { id: '01930000-0000-7000-8000-000000000c42', title: 'Wound check', sortOrder: 1 },
      ],
    },
    {
      id: '01930000-0000-7000-8000-000000000c05',
      code: 'copd',
      name: 'COPD Management',
      description: 'Chronic obstructive pulmonary disease care pathway.',
      completionCriteria: 'Stable FEV1, reduced exacerbations',
      requiredAppointments: 3,
      requiredLabs: 1,
      medicationProtocols: [
        'Bronchodilator',
        'Inhaled corticosteroid if indicated',
      ],
      mandatoryTasks: ['Inhaler technique', 'Smoking cessation'],
      steps: [
        { id: '01930000-0000-7000-8000-000000000c51', title: 'Spirometry', sortOrder: 0 },
      ],
    },
  ];
}

function buildDemoCarePlanEnrollment() {
  const now = new Date();
  const review = new Date(now);
  review.setDate(review.getDate() + 30);
  const patient = DEMO_PATIENTS[0]!;
  return {
    plan: {
      id: '01930000-0000-7000-8000-000000000d01',
      patientId: patient.id,
      patientName: patient.fullName,
      pathwayId: '01930000-0000-7000-8000-000000000c01',
      pathwayCode: 'diabetes',
      admissionId: '01930000-0000-7000-8000-000000000a02',
      title: 'Type 2 Diabetes Care Plan',
      description:
        'Evidence-based diabetes care pathway with HbA1c targets and medication titration.',
      type: 'chronic_disease' as const,
      status: 'active' as const,
      primaryDiagnosis: 'Type 2 Diabetes',
      diagnosisCode: 'ICD-E11.9',
      startDate: now,
      reviewDate: review,
      completionPercent: 33,
      progressPercent: 33,
      healthScore: 72,
      riskLevel: 'moderate',
      assignedPhysician: 'Dr. Jean-Luc Martin',
      assignedPhysicianId: DEMO_PHYSICIAN_ID,
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
    },
    steps: [
      {
        id: '01930000-0000-7000-8000-000000000d11',
        title: 'Baseline labs',
        sortOrder: 0,
        status: 'completed' as const,
        completedAt: now,
      },
      {
        id: '01930000-0000-7000-8000-000000000d12',
        title: 'Medication optimization',
        sortOrder: 1,
        status: 'in_progress' as const,
      },
      {
        id: '01930000-0000-7000-8000-000000000d13',
        title: '3-month review',
        sortOrder: 2,
        status: 'pending' as const,
      },
    ],
    tasks: [
      {
        id: '01930000-0000-7000-8000-000000000d21',
        title: 'HbA1c test',
        type: 'lab',
        priority: 'high',
        dueOffsetDays: 7,
        status: 'completed' as const,
      },
      {
        id: '01930000-0000-7000-8000-000000000d22',
        title: 'Foot exam',
        type: 'appointment',
        priority: 'medium',
        dueOffsetDays: 14,
        status: 'pending' as const,
      },
      {
        id: '01930000-0000-7000-8000-000000000d23',
        title: 'Nutrition consult',
        type: 'education',
        priority: 'medium',
        dueOffsetDays: 21,
        status: 'pending' as const,
      },
    ],
  };
}

/** Demo beds — Paris facility board for buyer walkthrough. */
function buildDemoBeds() {
  return [
    {
      id: '01930000-0000-7000-8000-000000000901',
      assignmentId: '01930000-0000-7000-8000-000000000951',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'ICU-3-01',
      ward: 'ICU-3',
      roomLabel: 'ICU-3',
      bedType: 'Critical care',
      status: 'occupied' as const,
      patientId: DEMO_PATIENTS[0]!.id,
      patientName: DEMO_PATIENTS[0]!.fullName,
    },
    {
      id: '01930000-0000-7000-8000-000000000902',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'ICU-3-02',
      ward: 'ICU-3',
      roomLabel: 'ICU-3',
      bedType: 'Critical care',
      status: 'available' as const,
    },
    {
      id: '01930000-0000-7000-8000-000000000903',
      assignmentId: '01930000-0000-7000-8000-000000000952',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'MS2B-14',
      ward: 'Med-Surg 2B',
      roomLabel: '2B-14',
      bedType: 'Standard',
      status: 'occupied' as const,
      patientId: DEMO_PATIENTS[1]!.id,
      patientName: DEMO_PATIENTS[1]!.fullName,
    },
    {
      id: '01930000-0000-7000-8000-000000000904',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'MS2B-15',
      ward: 'Med-Surg 2B',
      roomLabel: '2B-15',
      bedType: 'Standard',
      status: 'cleaning' as const,
    },
    {
      id: '01930000-0000-7000-8000-000000000905',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'PED-08',
      ward: 'Pediatrics',
      roomLabel: 'PED-08',
      bedType: 'Pediatric',
      status: 'reserved' as const,
    },
    {
      id: '01930000-0000-7000-8000-000000000906',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'MAT-03',
      ward: 'Maternity',
      roomLabel: 'MAT-03',
      bedType: 'Maternity',
      status: 'available' as const,
    },
    {
      id: '01930000-0000-7000-8000-000000000907',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'SUR-11',
      ward: 'Surgical',
      roomLabel: 'SUR-11',
      bedType: 'Surgical',
      status: 'maintenance' as const,
    },
    {
      id: '01930000-0000-7000-8000-000000000908',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      label: 'ER-04',
      ward: 'Emergency',
      roomLabel: 'ER-04',
      bedType: 'Emergency',
      status: 'available' as const,
    },
  ];
}

/** Demo medications — Sarah Jenkins pill organizer for buyer walkthrough. */
function buildDemoMedications(): DemoMedicationSeed[] {
  const sarah = DEMO_PATIENTS[0]!;
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 90);
  const expiresAt = new Date(startDate);
  expiresAt.setDate(expiresAt.getDate() + 90);

  return [
    {
      prescriptionId: '01930000-0000-7000-8000-000000000801',
      medicationId: '01930000-0000-7000-8000-000000000811',
      reminderId: '01930000-0000-7000-8000-000000000821',
      prescriptionNumber: 'RX-DEMO-801',
      patientId: sarah.id,
      patientName: sarah.fullName,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      brandName: 'Zestril',
      strength: '10 mg',
      medicationClass: 'ACE inhibitor',
      medicationType: 'tablet',
      dose: '10 mg',
      frequency: 'Once daily',
      route: 'oral',
      durationDays: 90,
      startDate,
      endDate,
      expiresAt,
      refillCount: 3,
      refillsRemaining: 2,
      remainingDays: 45,
      adherencePercent: 92,
      prescribingPhysician: 'Dr. Emily Chen',
      dispensingPharmacy: 'MedEase Pharmacy Paris',
      instructions: 'Take in the morning with water.',
      warnings: ['May cause dizziness'],
      contraindications: ['Pregnancy'],
      sideEffects: ['Cough', 'Dizziness'],
      storage: 'Room temperature',
      condition: 'Hypertension',
      doses: [
        {
          id: '01930000-0000-7000-8000-000000000831',
          scheduledAt: scheduleDaysFromNow(0, 8, 0),
          slot: 'morning',
          status: 'pending',
        },
        {
          id: '01930000-0000-7000-8000-000000000832',
          scheduledAt: scheduleDaysFromNow(1, 8, 0),
          slot: 'morning',
          status: 'pending',
        },
      ],
    },
    {
      prescriptionId: '01930000-0000-7000-8000-000000000802',
      medicationId: '01930000-0000-7000-8000-000000000812',
      reminderId: '01930000-0000-7000-8000-000000000822',
      prescriptionNumber: 'RX-DEMO-802',
      patientId: sarah.id,
      patientName: sarah.fullName,
      name: 'Metformin',
      genericName: 'Metformin hydrochloride',
      brandName: 'Glucophage',
      strength: '500 mg',
      medicationClass: 'Biguanide',
      medicationType: 'tablet',
      dose: '500 mg',
      frequency: 'Twice daily',
      route: 'oral',
      durationDays: 90,
      startDate,
      endDate,
      expiresAt,
      refillCount: 5,
      refillsRemaining: 4,
      remainingDays: 60,
      adherencePercent: 88,
      prescribingPhysician: 'Dr. Emily Chen',
      dispensingPharmacy: 'MedEase Pharmacy Paris',
      instructions: 'Take with meals morning and evening.',
      warnings: ['Monitor kidney function'],
      contraindications: ['Severe renal impairment'],
      sideEffects: ['Nausea', 'GI upset'],
      storage: 'Room temperature',
      condition: 'Type 2 diabetes',
      doses: [
        {
          id: '01930000-0000-7000-8000-000000000833',
          scheduledAt: scheduleDaysFromNow(0, 8, 0),
          slot: 'morning',
          status: 'pending',
        },
        {
          id: '01930000-0000-7000-8000-000000000834',
          scheduledAt: scheduleDaysFromNow(0, 20, 0),
          slot: 'evening',
          status: 'pending',
        },
        {
          id: '01930000-0000-7000-8000-000000000835',
          scheduledAt: scheduleDaysFromNow(1, 8, 0),
          slot: 'morning',
          status: 'pending',
        },
        {
          id: '01930000-0000-7000-8000-000000000836',
          scheduledAt: scheduleDaysFromNow(1, 20, 0),
          slot: 'evening',
          status: 'pending',
        },
      ],
    },
    {
      prescriptionId: '01930000-0000-7000-8000-000000000803',
      medicationId: '01930000-0000-7000-8000-000000000813',
      reminderId: '01930000-0000-7000-8000-000000000823',
      prescriptionNumber: 'RX-DEMO-803',
      patientId: sarah.id,
      patientName: sarah.fullName,
      name: 'Atorvastatin',
      genericName: 'Atorvastatin',
      brandName: 'Lipitor',
      strength: '20 mg',
      medicationClass: 'Statin',
      medicationType: 'tablet',
      dose: '20 mg',
      frequency: 'Once daily at night',
      route: 'oral',
      durationDays: 90,
      startDate,
      endDate,
      expiresAt,
      refillCount: 3,
      refillsRemaining: 3,
      remainingDays: 70,
      adherencePercent: 95,
      prescribingPhysician: 'Dr. Emily Chen',
      dispensingPharmacy: 'MedEase Pharmacy Paris',
      instructions: 'Take at bedtime.',
      warnings: ['Report unexplained muscle pain'],
      contraindications: ['Active liver disease'],
      sideEffects: ['Muscle pain'],
      storage: 'Room temperature',
      condition: 'Hyperlipidemia',
      doses: [
        {
          id: '01930000-0000-7000-8000-000000000837',
          scheduledAt: scheduleDaysFromNow(0, 22, 0),
          slot: 'night',
          status: 'pending',
        },
        {
          id: '01930000-0000-7000-8000-000000000838',
          scheduledAt: scheduleDaysFromNow(1, 22, 0),
          slot: 'night',
          status: 'pending',
        },
      ],
    },
  ];
}

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

        // Sarah Jenkins — active meds + today's pill-organizer doses
        for (const med of buildDemoMedications()) {
          await tx.prescription.upsert({
            where: { id: med.prescriptionId },
            create: {
              id: med.prescriptionId,
              tenantId: DEMO_TENANT_ID,
              patientId: med.patientId,
              prescriptionNumber: med.prescriptionNumber,
              patientName: med.patientName,
              medicationName: med.name,
              genericName: med.genericName,
              brandName: med.brandName,
              strength: med.strength,
              medicationClass: med.medicationClass,
              medicationType: med.medicationType,
              controlledSubstance: false,
              dose: med.dose,
              frequency: med.frequency,
              route: med.route,
              durationDays: med.durationDays,
              startDate: med.startDate,
              endDate: med.endDate,
              expiresAt: med.expiresAt,
              status: 'active',
              refillCount: med.refillCount,
              refillsRemaining: med.refillsRemaining,
              prescribingPhysician: med.prescribingPhysician,
              prescribingPhysicianId: DEMO_PHYSICIAN_ID,
              dispensingPharmacy: med.dispensingPharmacy,
              dispensingPharmacyId: DEMO_PHARMACY_ID,
              instructions: med.instructions,
              warnings: med.warnings,
              contraindications: med.contraindications,
              fhirResourceId: med.prescriptionId,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              status: 'active',
              refillsRemaining: med.refillsRemaining,
              instructions: med.instructions,
              updatedBy: DEMO_ADMIN_ID,
            },
          });

          await tx.patientMedication.upsert({
            where: { id: med.medicationId },
            create: {
              id: med.medicationId,
              tenantId: DEMO_TENANT_ID,
              prescriptionId: med.prescriptionId,
              patientId: med.patientId,
              name: med.name,
              genericName: med.genericName,
              brandName: med.brandName,
              strength: med.strength,
              medicationClass: med.medicationClass,
              medicationType: med.medicationType,
              controlledSubstance: false,
              status: 'active',
              dose: med.dose,
              frequency: med.frequency,
              route: med.route,
              startDate: med.startDate,
              endDate: med.endDate,
              remainingDays: med.remainingDays,
              instructions: med.instructions,
              warnings: med.warnings,
              contraindications: med.contraindications,
              sideEffects: med.sideEffects,
              storage: med.storage,
              prescribingPhysician: med.prescribingPhysician,
              dispensingPharmacy: med.dispensingPharmacy,
              refillCount: med.refillCount,
              refillsRemaining: med.refillsRemaining,
              adherencePercent: med.adherencePercent,
              condition: med.condition,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              status: 'active',
              remainingDays: med.remainingDays,
              adherencePercent: med.adherencePercent,
              updatedBy: DEMO_ADMIN_ID,
            },
          });

          for (const dose of med.doses) {
            await tx.medicationDose.upsert({
              where: { id: dose.id },
              create: {
                id: dose.id,
                tenantId: DEMO_TENANT_ID,
                medicationId: med.medicationId,
                patientId: med.patientId,
                medicationName: med.name,
                scheduledAt: dose.scheduledAt,
                slot: dose.slot,
                dose: med.dose,
                status: dose.status,
                instructions: med.instructions,
              },
              update: {
                scheduledAt: dose.scheduledAt,
                status: dose.status,
              },
            });
          }

          await tx.medicationReminder.upsert({
            where: { id: med.reminderId },
            create: {
              id: med.reminderId,
              tenantId: DEMO_TENANT_ID,
              medicationId: med.medicationId,
              patientId: med.patientId,
              type: 'dose',
              channel: 'in_app',
              title: `Take ${med.name}`,
              message: `${med.dose} — ${med.instructions}`,
              dueAt: med.doses[0]?.scheduledAt ?? new Date(),
              active: true,
            },
            update: {
              title: `Take ${med.name}`,
              message: `${med.dose} — ${med.instructions}`,
              dueAt: med.doses[0]?.scheduledAt ?? new Date(),
              active: true,
            },
          });
        }

        for (const bed of buildDemoBeds()) {
          await tx.bed.upsert({
            where: { id: bed.id },
            create: {
              id: bed.id,
              tenantId: DEMO_TENANT_ID,
              facilityId: bed.facilityId,
              facilityName: bed.facilityName,
              label: bed.label,
              ward: bed.ward,
              roomLabel: bed.roomLabel,
              bedType: bed.bedType,
              status: bed.status,
              patientId: bed.patientId,
              patientName: bed.patientName,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              status: bed.status,
              patientId: bed.patientId ?? null,
              patientName: bed.patientName ?? null,
              facilityName: bed.facilityName,
              ward: bed.ward,
              roomLabel: bed.roomLabel,
              bedType: bed.bedType,
              updatedBy: DEMO_ADMIN_ID,
            },
          });

          if (bed.assignmentId && bed.patientId && bed.patientName) {
            await tx.bedAssignment.upsert({
              where: { id: bed.assignmentId },
              create: {
                id: bed.assignmentId,
                tenantId: DEMO_TENANT_ID,
                bedId: bed.id,
                patientId: bed.patientId,
                patientName: bed.patientName,
                status: 'assigned',
                assignedBy: DEMO_ADMIN_ID,
              },
              update: {
                status: 'assigned',
                patientName: bed.patientName,
              },
            });
          }
        }

        for (const admission of buildDemoAdmissions()) {
          await tx.admission.upsert({
            where: { id: admission.id },
            create: {
              id: admission.id,
              tenantId: DEMO_TENANT_ID,
              patientId: admission.patientId,
              patientName: admission.patientName,
              patientMrn: admission.patientMrn,
              facilityId: admission.facilityId,
              facilityName: admission.facilityName,
              ward: admission.ward,
              bedId: admission.bedId,
              bedLabel: admission.bedLabel,
              status: admission.status,
              priority: admission.priority,
              reason: admission.reason,
              requestedAt: admission.requestedAt,
              triagedAt: admission.triagedAt,
              admittedAt: admission.admittedAt,
              dischargedAt: admission.dischargedAt,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              status: admission.status,
              priority: admission.priority,
              ward: admission.ward,
              bedId: admission.bedId ?? null,
              bedLabel: admission.bedLabel ?? null,
              triagedAt: admission.triagedAt ?? null,
              admittedAt: admission.admittedAt ?? null,
              dischargedAt: admission.dischargedAt ?? null,
              updatedBy: DEMO_ADMIN_ID,
            },
          });
        }

        for (const transfer of buildDemoTransfers()) {
          await tx.patientTransfer.upsert({
            where: { id: transfer.id },
            create: {
              id: transfer.id,
              tenantId: DEMO_TENANT_ID,
              admissionId: transfer.admissionId,
              patientId: transfer.patientId,
              patientName: transfer.patientName,
              fromFacilityId: transfer.fromFacilityId,
              fromFacilityName: transfer.fromFacilityName,
              fromWard: transfer.fromWard,
              fromBedId: transfer.fromBedId,
              toFacilityId: transfer.toFacilityId,
              toFacilityName: transfer.toFacilityName,
              toWard: transfer.toWard,
              toBedId: transfer.toBedId,
              status: transfer.status,
              reason: transfer.reason,
              requestedAt: transfer.requestedAt,
              startedAt: transfer.startedAt,
              completedAt: transfer.completedAt,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              status: transfer.status,
              fromWard: transfer.fromWard,
              toWard: transfer.toWard,
              startedAt: transfer.startedAt ?? null,
              completedAt: transfer.completedAt ?? null,
              updatedBy: DEMO_ADMIN_ID,
            },
          });
        }

        for (const pathway of buildDemoCarePathways()) {
          await tx.carePathwayDefinition.upsert({
            where: { id: pathway.id },
            create: {
              id: pathway.id,
              tenantId: DEMO_TENANT_ID,
              code: pathway.code,
              name: pathway.name,
              description: pathway.description,
              completionCriteria: pathway.completionCriteria,
              requiredAppointments: pathway.requiredAppointments,
              requiredLabs: pathway.requiredLabs,
              medicationProtocols: pathway.medicationProtocols,
              mandatoryTasks: pathway.mandatoryTasks,
              active: true,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              name: pathway.name,
              description: pathway.description,
              completionCriteria: pathway.completionCriteria,
              requiredAppointments: pathway.requiredAppointments,
              requiredLabs: pathway.requiredLabs,
              medicationProtocols: pathway.medicationProtocols,
              mandatoryTasks: pathway.mandatoryTasks,
              active: true,
              updatedBy: DEMO_ADMIN_ID,
            },
          });

          for (const step of pathway.steps) {
            await tx.carePathwayStepDefinition.upsert({
              where: { id: step.id },
              create: {
                id: step.id,
                tenantId: DEMO_TENANT_ID,
                pathwayId: pathway.id,
                sortOrder: step.sortOrder,
                title: step.title,
              },
              update: {
                sortOrder: step.sortOrder,
                title: step.title,
              },
            });
          }
        }

        const enrollment = buildDemoCarePlanEnrollment();
        await tx.carePlan.upsert({
          where: { id: enrollment.plan.id },
          create: {
            id: enrollment.plan.id,
            tenantId: DEMO_TENANT_ID,
            patientId: enrollment.plan.patientId,
            patientName: enrollment.plan.patientName,
            pathwayId: enrollment.plan.pathwayId,
            pathwayCode: enrollment.plan.pathwayCode,
            admissionId: enrollment.plan.admissionId,
            title: enrollment.plan.title,
            description: enrollment.plan.description,
            type: enrollment.plan.type,
            status: enrollment.plan.status,
            primaryDiagnosis: enrollment.plan.primaryDiagnosis,
            diagnosisCode: enrollment.plan.diagnosisCode,
            startDate: enrollment.plan.startDate,
            reviewDate: enrollment.plan.reviewDate,
            completionPercent: enrollment.plan.completionPercent,
            progressPercent: enrollment.plan.progressPercent,
            healthScore: enrollment.plan.healthScore,
            riskLevel: enrollment.plan.riskLevel,
            assignedPhysician: enrollment.plan.assignedPhysician,
            assignedPhysicianId: enrollment.plan.assignedPhysicianId,
            facilityId: enrollment.plan.facilityId,
            facilityName: enrollment.plan.facilityName,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: enrollment.plan.status,
            pathwayId: enrollment.plan.pathwayId,
            pathwayCode: enrollment.plan.pathwayCode,
            admissionId: enrollment.plan.admissionId,
            completionPercent: enrollment.plan.completionPercent,
            progressPercent: enrollment.plan.progressPercent,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        for (const step of enrollment.steps) {
          await tx.carePlanStep.upsert({
            where: { id: step.id },
            create: {
              id: step.id,
              tenantId: DEMO_TENANT_ID,
              carePlanId: enrollment.plan.id,
              sortOrder: step.sortOrder,
              title: step.title,
              status: step.status,
              completedAt: step.completedAt,
            },
            update: {
              status: step.status,
              completedAt: step.completedAt ?? null,
              title: step.title,
              sortOrder: step.sortOrder,
            },
          });
        }

        for (const task of enrollment.tasks) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + task.dueOffsetDays);
          await tx.carePlanTask.upsert({
            where: { id: task.id },
            create: {
              id: task.id,
              tenantId: DEMO_TENANT_ID,
              carePlanId: enrollment.plan.id,
              patientId: enrollment.plan.patientId,
              title: task.title,
              type: task.type,
              priority: task.priority,
              owner: enrollment.plan.assignedPhysician,
              dueDate,
              status: task.status,
              completedAt: task.status === 'completed' ? new Date() : undefined,
            },
            update: {
              title: task.title,
              status: task.status,
              priority: task.priority,
              dueDate,
            },
          });
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
