import type {
  Allergy,
  CarePlan,
  ClinicalAlert,
  ClinicalDocument,
  ClinicalNote,
  Encounter,
  Immunization,
  LabResult,
  PatientHealthRecord,
  PatientMedication,
  ProcedureRecord,
  RadiologyStudy,
  TimelineEntry,
  VitalReading,
} from '@/services/patient-records/types';

const FIRST_NAMES = [
  'Sarah',
  'James',
  'Maria',
  'David',
  'Emily',
  'Michael',
  'Aisha',
  'Robert',
  'Sophie',
  'Jean',
  'Amélie',
  'Pierre',
  'Fatima',
  'Lucas',
  'Chloé',
  'Thomas',
  'Isabelle',
  'Antoine',
  'Camille',
  'Nicolas',
  'Julie',
  'Marc',
  'Nadia',
  'Paul',
  'Elena',
  'Hugo',
  'Léa',
  'Olivier',
  'Manon',
  'Alexandre',
  'Claire',
  'Vincent',
  'Laura',
  'Maxime',
  'Zoé',
  'Julien',
  'Emma',
  'Raphaël',
  'Inès',
  'Louis',
];

const LAST_NAMES = [
  'Jenkins',
  'Wilson',
  'Lopez',
  'Chen',
  'Rodriguez',
  'Brown',
  'Patel',
  'Taylor',
  'Martin',
  'Dubois',
  'Bernard',
  'Petit',
  'Durand',
  'Leroy',
  'Moreau',
  'Simon',
  'Laurent',
  'Lefebvre',
  'Michel',
  'Garcia',
  'David',
  'Bertrand',
  'Roux',
  'Vincent',
  'Fournier',
  'Morel',
  'Girard',
  'André',
  'Mercier',
  'Dupont',
  'Lambert',
  'Bonnet',
  'François',
  'Martinez',
  'Legrand',
  'Garnier',
  'Faure',
  'Rousseau',
  'Blanc',
  'Guerin',
];

const CONDITIONS = [
  'Hypertension',
  'Type 2 Diabetes',
  'Asthma',
  'Hyperlipidemia',
  'Anxiety',
  'Depression',
  'Osteoarthritis',
  'GERD',
  'Hypothyroidism',
  'Migraine',
  'COPD',
  'Atrial Fibrillation',
  'CKD Stage 2',
  'Obesity',
  'Anemia',
];

const DEPARTMENTS = [
  'Cardiology',
  'Internal Medicine',
  'Emergency',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'Oncology',
  'ICU',
  'Endocrinology',
  'Pulmonology',
];

const PHYSICIANS = [
  'Dr. Emily Chen',
  'Dr. Jean-Luc Martin',
  'Dr. Sophie Bernard',
  'Dr. Marie Dupont',
  'Dr. Antoine Leroy',
  'Dr. James Wilson',
  'Dr. Aisha Patel',
];

const FACILITIES = [
  'Pitié-Salpêtrière',
  'Hôpital Édouard Herriot',
  'Clinique Pasteur',
  'Centre Médical La Défense',
];

const MEDICATIONS = [
  { name: 'Metformin', dosage: '850 mg', frequency: 'Twice daily' },
  { name: 'Atorvastatin', dosage: '20 mg', frequency: 'Once daily' },
  { name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily' },
  { name: 'Omeprazole', dosage: '20 mg', frequency: 'Once daily' },
  { name: 'Salbutamol', dosage: '100 mcg', frequency: 'As needed' },
  { name: 'Levothyroxine', dosage: '75 mcg', frequency: 'Once daily' },
  { name: 'Paracetamol', dosage: '500 mg', frequency: 'As needed' },
  { name: 'Amoxicillin', dosage: '500 mg', frequency: 'Three times daily' },
];

const ALLERGENS = [
  {
    type: 'drug' as const,
    substance: 'Penicillin',
    severity: 'severe' as const,
    reaction: 'Anaphylaxis',
  },
  {
    type: 'drug' as const,
    substance: 'Sulfa drugs',
    severity: 'moderate' as const,
    reaction: 'Rash',
  },
  {
    type: 'food' as const,
    substance: 'Peanuts',
    severity: 'life_threatening' as const,
    reaction: 'Anaphylaxis',
  },
  {
    type: 'food' as const,
    substance: 'Shellfish',
    severity: 'moderate' as const,
    reaction: 'Urticaria',
  },
  {
    type: 'environmental' as const,
    substance: 'Pollen',
    severity: 'mild' as const,
    reaction: 'Rhinitis',
  },
];

const VACCINES = [
  'COVID-19',
  'Influenza',
  'Tetanus',
  'Hepatitis B',
  'MMR',
  'Travel: Yellow Fever',
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

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

function generateVitals(index: number, rand: () => number): VitalReading[] {
  const readings: VitalReading[] = [];
  for (let i = 0; i < 12; i++) {
    const baseSys = 115 + (index % 20);
    readings.push({
      id: `vital-${index}-${i}`,
      recordedAt: daysAgo(i * 14),
      bloodPressureSystolic: baseSys + Math.floor(rand() * 15),
      bloodPressureDiastolic: 70 + Math.floor(rand() * 15),
      heartRate: 65 + Math.floor(rand() * 25),
      temperatureC: 36.2 + rand() * 0.8,
      respirationRate: 14 + Math.floor(rand() * 4),
      oxygenSaturation: 95 + Math.floor(rand() * 5),
      bloodGlucose: index % 5 === 0 ? 95 + Math.floor(rand() * 40) : undefined,
      weightKg: 60 + (index % 30) + rand() * 5,
      bmi: 20 + (index % 10) + rand() * 2,
      recordedBy: pick(PHYSICIANS, rand),
    });
  }
  return readings;
}

function generateLabs(index: number): LabResult[] {
  const templates = [
    {
      testName: 'Hemoglobin',
      category: 'CBC',
      value: '14.2',
      unit: 'g/dL',
      referenceRange: '12.0–16.0',
      flag: 'normal' as const,
    },
    {
      testName: 'WBC',
      category: 'CBC',
      value: '7.5',
      unit: '10³/µL',
      referenceRange: '4.5–11.0',
      flag: 'normal' as const,
    },
    {
      testName: 'Creatinine',
      category: 'Kidney',
      value: '1.1',
      unit: 'mg/dL',
      referenceRange: '0.7–1.3',
      flag: 'normal' as const,
    },
    {
      testName: 'eGFR',
      category: 'Kidney',
      value: '88',
      unit: 'mL/min',
      referenceRange: '>60',
      flag: 'normal' as const,
    },
    {
      testName: 'ALT',
      category: 'Liver',
      value: '28',
      unit: 'U/L',
      referenceRange: '7–56',
      flag: 'normal' as const,
    },
    {
      testName: 'Fasting Glucose',
      category: 'Glucose',
      value: index % 5 === 0 ? '142' : '92',
      unit: 'mg/dL',
      referenceRange: '70–100',
      flag: index % 5 === 0 ? ('high' as const) : ('normal' as const),
    },
    {
      testName: 'HbA1c',
      category: 'Glucose',
      value: index % 5 === 0 ? '7.8' : '5.4',
      unit: '%',
      referenceRange: '<5.7',
      flag: index % 5 === 0 ? ('high' as const) : ('normal' as const),
    },
    {
      testName: 'LDL Cholesterol',
      category: 'Lipid',
      value: '118',
      unit: 'mg/dL',
      referenceRange: '<100',
      flag: 'high' as const,
    },
    {
      testName: 'Sodium',
      category: 'Electrolytes',
      value: '140',
      unit: 'mEq/L',
      referenceRange: '136–145',
      flag: 'normal' as const,
    },
    {
      testName: 'TSH',
      category: 'Hormones',
      value: '2.1',
      unit: 'mIU/L',
      referenceRange: '0.4–4.0',
      flag: 'normal' as const,
    },
  ];
  return templates.map((t, i) => ({
    id: `lab-${index}-${i}`,
    ...t,
    collectedAt: daysAgo(30 + i * 5),
    resultedAt: daysAgo(29 + i * 5),
  }));
}

function buildTimeline(
  record: Omit<PatientHealthRecord, 'timeline'>,
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  for (const enc of record.encounters) {
    entries.push({
      id: `tl-enc-${enc.id}`,
      category: 'encounter',
      date: enc.date,
      title: enc.type,
      description: enc.reason,
      actor: enc.physician,
    });
  }
  for (const lab of record.labs.slice(0, 3)) {
    entries.push({
      id: `tl-lab-${lab.id}`,
      category: 'lab',
      date: lab.resultedAt,
      title: lab.testName,
      description: `${lab.value} ${lab.unit}`,
      severity: lab.flag === 'high' ? 'warning' : 'info',
    });
  }
  for (const med of record.medications.filter((m) => m.status === 'active')) {
    entries.push({
      id: `tl-med-${med.id}`,
      category: 'medication',
      date: med.startDate,
      title: med.name,
      description: med.dosage,
    });
  }
  for (const proc of record.procedures) {
    entries.push({
      id: `tl-proc-${proc.id}`,
      category: 'procedure',
      date: proc.date,
      title: proc.name,
      description: proc.category,
      actor: proc.physician,
    });
  }
  for (const imm of record.immunizations) {
    entries.push({
      id: `tl-imm-${imm.id}`,
      category: 'immunization',
      date: imm.date,
      title: imm.vaccine,
      description: imm.dose,
    });
  }
  for (const note of record.notes) {
    entries.push({
      id: `tl-note-${note.id}`,
      category: 'note',
      date: note.date,
      title: note.title,
      description: note.content.slice(0, 80),
      actor: note.author,
    });
  }
  for (const rad of record.radiology) {
    entries.push({
      id: `tl-rad-${rad.id}`,
      category: 'radiology',
      date: rad.date,
      title: rad.modality,
      description: rad.bodyPart,
    });
  }
  for (const cp of record.carePlans) {
    entries.push({
      id: `tl-cp-${cp.id}`,
      category: 'care_plan',
      date: cp.reviewSchedule,
      title: cp.title,
      description: cp.status,
    });
  }
  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function generatePatientRecord(index: number): PatientHealthRecord {
  const rand = seededRandom(index * 9973);
  const firstName = FIRST_NAMES[index - 1] ?? `Patient${index}`;
  const lastName = LAST_NAMES[index - 1] ?? `Demo${index}`;
  const fullName = `${firstName} ${lastName}`;
  const id = `phr-${String(index).padStart(3, '0')}`;
  const mrn = `MRN-${10000 + index}`;
  const gender =
    index % 3 === 0 ? 'female' : index % 3 === 1 ? 'male' : 'other';
  const dobYear = 1950 + (index % 50);
  const heightCm = 155 + (index % 35);
  const weightKg = 55 + (index % 40);
  const bmi = Math.round((weightKg / (heightCm / 100) ** 2) * 10) / 10;
  const primaryCondition = CONDITIONS[index % CONDITIONS.length]!;
  const hasDiabetes = index % 5 === 0;
  const hasPenicillinAllergy = index % 7 === 0;

  const allergies: Allergy[] = [];
  if (hasPenicillinAllergy) {
    allergies.push({
      id: `all-${index}-1`,
      type: 'drug',
      substance: 'Penicillin',
      severity: 'severe',
      reaction: 'Anaphylaxis',
      recordedDate: daysAgo(365 * 3),
    });
  }
  if (index % 4 === 0) {
    const a = pick(
      ALLERGENS.filter((x) => x.type === 'food'),
      rand,
    );
    allergies.push({
      id: `all-${index}-2`,
      type: a.type,
      substance: a.substance,
      severity: a.severity,
      reaction: a.reaction,
      recordedDate: daysAgo(200),
    });
  }

  const vitals = generateVitals(index, rand);
  const labs = generateLabs(index);

  const encounters: Encounter[] = Array.from({ length: 4 }, (_, i) => ({
    id: `enc-${index}-${i}`,
    type: pick(
      ['consultation', 'emergency', 'admission', 'teleconsultation'] as const,
      rand,
    ),
    date: daysAgo(30 * (i + 1)),
    department: pick(DEPARTMENTS, rand),
    physician: pick(PHYSICIANS, rand),
    facility: pick(FACILITIES, rand),
    reason: pick(
      ['Follow-up', 'Annual checkup', 'Chest pain', 'Medication review'],
      rand,
    ),
    summary: 'Patient evaluated and plan updated.',
  }));

  const medications: PatientMedication[] = MEDICATIONS.slice(
    0,
    3 + (index % 4),
  ).map((m, i) => ({
    id: `med-${index}-${i}`,
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    status: i === 0 && index % 9 === 0 ? 'paused' : 'active',
    prescribedBy: pick(PHYSICIANS, rand),
    startDate: daysAgo(180 + i * 30),
    instructions: 'Take as directed',
    compliance: 70 + Math.floor(rand() * 30),
    renewals: Math.floor(rand() * 5),
  }));

  const immunizations: Immunization[] = VACCINES.slice(0, 4 + (index % 3)).map(
    (v, i) => ({
      id: `imm-${index}-${i}`,
      vaccine: v,
      date: daysAgo(90 * (i + 1)),
      dose: '1 dose',
      provider: pick(PHYSICIANS, rand),
    }),
  );

  const radiology: RadiologyStudy[] = [
    {
      id: `rad-${index}-1`,
      modality: 'X-Ray',
      bodyPart: 'Chest',
      date: daysAgo(120),
      report: 'No acute findings.',
      radiologist: 'Dr. Radiology Team',
    },
    ...(index % 3 === 0
      ? [
          {
            id: `rad-${index}-2`,
            modality: 'MRI' as const,
            bodyPart: 'Knee',
            date: daysAgo(200),
            report: 'Mild meniscal degeneration.',
            radiologist: 'Dr. Imaging',
          },
        ]
      : []),
  ];

  const procedures: ProcedureRecord[] =
    index % 4 === 0
      ? [
          {
            id: `proc-${index}-1`,
            name: 'Arthroscopy',
            category: 'Orthopedic',
            date: daysAgo(400),
            physician: pick(PHYSICIANS, rand),
            facility: pick(FACILITIES, rand),
            notes: 'Outpatient procedure',
            recoveryNotes: 'Full recovery in 6 weeks',
          },
        ]
      : [];

  const carePlans: CarePlan[] = [
    {
      id: `cp-${index}-1`,
      title: hasDiabetes
        ? 'Diabetes Management Plan'
        : `${primaryCondition} Care Plan`,
      goals: [
        'Maintain stable vitals',
        'Improve medication adherence',
        'Reduce ER visits',
      ],
      interventions: [
        'Monthly follow-up',
        'Home glucose monitoring',
        'Nutrition counseling',
      ],
      progress: index % 2 === 0 ? 'On track' : 'Needs review',
      assignedClinicians: [pick(PHYSICIANS, rand)],
      status: 'active',
      reviewSchedule: daysAgo(-30),
    },
  ];

  const notes: ClinicalNote[] = [
    {
      id: `note-${index}-1`,
      date: daysAgo(14),
      author: pick(PHYSICIANS, rand),
      specialty: pick(DEPARTMENTS, rand),
      title: 'Progress Note',
      content: `Patient seen for ${primaryCondition} follow-up. Vitals stable. Continue current regimen.`,
    },
  ];

  const documents: ClinicalDocument[] = [
    {
      id: `doc-${index}-1`,
      title: 'Discharge Summary',
      type: 'discharge',
      date: daysAgo(60),
      author: pick(PHYSICIANS, rand),
      facility: pick(FACILITIES, rand),
    },
    {
      id: `doc-${index}-2`,
      title: 'Lab Report Panel',
      type: 'other',
      date: daysAgo(30),
      author: 'Laboratory Services',
    },
    {
      id: `doc-${index}-3`,
      title: 'Insurance Authorization',
      type: 'insurance',
      date: daysAgo(90),
      author: 'Admin',
    },
  ];

  const alerts: ClinicalAlert[] = [];
  if (hasPenicillinAllergy)
    alerts.push({
      id: `alert-${index}-1`,
      category: 'drug_allergy',
      severity: 'critical',
      title: 'Penicillin Allergy',
      message: 'Severe anaphylaxis documented',
      active: true,
    });
  if (hasDiabetes)
    alerts.push({
      id: `alert-${index}-2`,
      category: 'diabetes',
      severity: 'warning',
      title: 'Diabetes',
      message: 'HbA1c above target — review needed',
      active: true,
    });
  if (index % 8 === 0)
    alerts.push({
      id: `alert-${index}-3`,
      category: 'fall_risk',
      severity: 'warning',
      title: 'Fall Risk',
      message: 'Mobility assessment recommended',
      active: true,
    });

  const partial: Omit<PatientHealthRecord, 'timeline'> = {
    demographics: {
      id,
      mrn,
      userId: index === 1 ? 'user-patient' : undefined,
      fullName,
      gender,
      dateOfBirth: `${dobYear}-${String((index % 12) + 1).padStart(2, '0')}-15`,
      bloodGroup: pick(['A+', 'O+', 'B+', 'AB+', 'A-'] as const, rand),
      address: {
        street: `${index} Rue de la Santé`,
        city: pick(['Paris', 'Lyon', 'Marseille', 'Toulouse'], rand),
        postalCode: `750${String(index).padStart(2, '0')}`,
        country: 'France',
      },
      language: index % 5 === 0 ? 'English' : 'French',
      maritalStatus: pick(['Single', 'Married', 'Divorced', 'Widowed'], rand),
      occupation: pick(
        ['Engineer', 'Teacher', 'Retired', 'Student', 'Healthcare worker'],
        rand,
      ),
      nationality: 'French',
      weightKg,
      heightCm,
      bmi,
      smoking: pick(['never', 'former', 'current'] as const, rand),
      alcohol: pick(['none', 'moderate', 'heavy'] as const, rand),
      primaryPhysician: pick(PHYSICIANS, rand),
      emergencyContacts: [
        {
          name: `${firstName} Contact`,
          relationship: 'Spouse',
          phone: '+33 6 12 34 56 78',
        },
      ],
      insurance: {
        provider: 'Mutuelle Générale',
        policyNumber: `POL-${100000 + index}`,
        validUntil: '2027-12-31',
      },
      nationalId: `FR-${900000000 + index}`,
    },
    summary: {
      problemList: [
        {
          id: `dx-${index}-1`,
          label: primaryCondition,
          status: 'chronic',
          onsetDate: daysAgo(800),
        },
      ],
      chronicDiseases: [
        primaryCondition,
        ...(hasDiabetes ? ['Type 2 Diabetes'] : []),
      ],
      currentDiagnoses: [
        {
          id: `dx-${index}-2`,
          label: primaryCondition,
          status: 'active',
          onsetDate: daysAgo(800),
        },
      ],
      resolvedConditions:
        index % 6 === 0
          ? [
              {
                id: `dx-${index}-3`,
                label: 'Acute bronchitis',
                status: 'resolved',
                onsetDate: daysAgo(400),
                resolvedDate: daysAgo(380),
              },
            ]
          : [],
      activeTreatments: medications
        .filter((m) => m.status === 'active')
        .map((m) => m.name),
      clinicalRisks: hasDiabetes
        ? ['Cardiovascular risk', 'Hypoglycemia risk']
        : ['Standard monitoring'],
    },
    allergies,
    vitals,
    encounters,
    notes,
    medications,
    immunizations,
    labs,
    radiology,
    procedures,
    carePlans,
    documents,
    alerts,
    familyHistory: [
      { relation: 'Mother', condition: 'Hypertension', ageOfOnset: 55 },
      { relation: 'Father', condition: 'Type 2 Diabetes', ageOfOnset: 60 },
    ],
    lifestyle: {
      diet: 'Mediterranean',
      exercise: '3x weekly',
      sleepHours: 7,
      stressLevel: pick(['low', 'moderate', 'high'] as const, rand),
    },
    socialHistory: {
      livingSituation: 'With family',
      supportNetwork: 'Strong',
      employment: pick(['Employed', 'Retired', 'Student'], rand),
    },
    emergencySummary: {
      bloodGroup: pick(['A+', 'O+', 'B+'] as const, rand),
      criticalAllergies: allergies
        .filter(
          (a) => a.severity === 'severe' || a.severity === 'life_threatening',
        )
        .map((a) => a.substance),
      activeMedications: medications
        .filter((m) => m.status === 'active')
        .map((m) => `${m.name} ${m.dosage}`),
      chronicConditions: [primaryCondition],
      emergencyContacts: [
        {
          name: `${firstName} Contact`,
          relationship: 'Spouse',
          phone: '+33 6 12 34 56 78',
        },
      ],
      primaryPhysician: pick(PHYSICIANS, rand),
      lastUpdated: daysAgo(1),
    },
    healthScore: {
      overall: 65 + (index % 30),
      vitals: 70 + (index % 25),
      labs: hasDiabetes ? 55 : 80,
      medications: 75 + (index % 20),
      carePlans: 70 + (index % 25),
      trend: pick(['improving', 'stable', 'declining'] as const, rand),
    },
    updatedAt: daysAgo(index % 5),
  };

  return { ...partial, timeline: buildTimeline(partial) };
}

export const MOCK_PATIENT_RECORDS: PatientHealthRecord[] = Array.from(
  { length: 40 },
  (_, i) => generatePatientRecord(i + 1),
);

export function getPatientIdForUser(userId: string): string | null {
  const record = MOCK_PATIENT_RECORDS.find(
    (r) => r.demographics.userId === userId,
  );
  return (
    record?.demographics.id ?? (userId === 'user-patient' ? 'phr-001' : null)
  );
}
