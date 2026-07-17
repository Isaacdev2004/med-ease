import type {
  DoseLog,
  DrugInteraction,
  MedicationAdministration,
  MedicationCourse,
  MedicationDispense,
  MedicationEducation,
  MedicationReminder,
  MedicationTimelineEntry,
  PatientMedication,
  PharmacyPrescriptionQueue,
  Prescription,
  RefillRequest,
  ScheduledDose,
} from '@/services/medications/types';
import { AUTH_USER_PATIENT_MAP } from '@/services/medications/types';

const BASE_DRUGS = [
  {
    name: 'Atorvastatine',
    generic: 'Atorvastatin',
    class: 'Statin',
    type: 'Tablet',
    strength: '20 mg',
  },
  {
    name: 'Metformine',
    generic: 'Metformin',
    class: 'Antidiabetic',
    type: 'Tablet',
    strength: '850 mg',
  },
  {
    name: 'Lisinopril',
    generic: 'Lisinopril',
    class: 'ACE Inhibitor',
    type: 'Tablet',
    strength: '10 mg',
  },
  {
    name: 'Oméprazole',
    generic: 'Omeprazole',
    class: 'PPI',
    type: 'Capsule',
    strength: '20 mg',
  },
  {
    name: 'Salbutamol',
    generic: 'Albuterol',
    class: 'Bronchodilator',
    type: 'Inhaler',
    strength: '100 mcg',
  },
  {
    name: 'Lévothyroxine',
    generic: 'Levothyroxine',
    class: 'Thyroid',
    type: 'Tablet',
    strength: '75 mcg',
  },
  {
    name: 'Amoxicilline',
    generic: 'Amoxicillin',
    class: 'Antibiotic',
    type: 'Capsule',
    strength: '500 mg',
  },
  {
    name: 'Paracétamol',
    generic: 'Acetaminophen',
    class: 'Analgesic',
    type: 'Tablet',
    strength: '500 mg',
  },
  {
    name: 'Warfarine',
    generic: 'Warfarin',
    class: 'Anticoagulant',
    type: 'Tablet',
    strength: '5 mg',
    controlled: true,
  },
  {
    name: 'Sertraline',
    generic: 'Sertraline',
    class: 'SSRI',
    type: 'Tablet',
    strength: '50 mg',
  },
  {
    name: 'Amlodipine',
    generic: 'Amlodipine',
    class: 'Calcium Channel Blocker',
    type: 'Tablet',
    strength: '5 mg',
  },
  {
    name: 'Insuline glargine',
    generic: 'Insulin glargine',
    class: 'Antidiabetic',
    type: 'Injection',
    strength: '100 U/mL',
  },
  {
    name: 'Prednisone',
    generic: 'Prednisone',
    class: 'Corticosteroid',
    type: 'Tablet',
    strength: '20 mg',
  },
  {
    name: 'Morphine',
    generic: 'Morphine',
    class: 'Opioid',
    type: 'Tablet',
    strength: '10 mg',
    controlled: true,
  },
  {
    name: 'Vaccin grippe',
    generic: 'Influenza vaccine',
    class: 'Vaccine',
    type: 'Injection',
    strength: '0.5 mL',
  },
];

const FORMULATIONS = [
  'Biogaran',
  'Sandoz',
  'Mylan',
  'Teva',
  'Arrow',
  'Zentiva',
];

export const MEDICATION_CATALOG = Array.from({ length: 300 }, (_, i) => {
  const base = BASE_DRUGS[i % BASE_DRUGS.length]!;
  const suffix =
    i >= BASE_DRUGS.length ? ` ${FORMULATIONS[i % FORMULATIONS.length]}` : '';
  return {
    id: `med-cat-${String(i + 1).padStart(3, '0')}`,
    name: `${base.name}${suffix}`,
    generic: base.generic,
    class: base.class,
    type: base.type,
    strength: base.strength,
    controlled: Boolean(base.controlled) || base.class === 'Opioid',
  };
});

const DRUGS = MEDICATION_CATALOG;

const PHYSICIANS = [
  'Dr. Emily Chen',
  'Dr. Jean-Luc Martin',
  'Dr. Sophie Bernard',
  'Dr. Antoine Moreau',
  'Dr. Marie Dupont',
];
const PHARMACIES = Array.from({ length: 25 }, (_, i) => ({
  id: `pharm-${String(i + 1).padStart(3, '0')}`,
  name:
    [
      'Pharmacie Centrale',
      'Pharmacie du Marché',
      'Pharmacie Pasteur',
      'Pharmacie de la Gare',
      'Pharmacie République',
    ][i % 5]! + (i >= 5 ? ` ${i + 1}` : ''),
}));

export const MOCK_PHARMACISTS = Array.from({ length: 50 }, (_, i) => ({
  id: `pharmacist-${String(i + 1).padStart(3, '0')}`,
  name: [
    'Marie Lefèvre',
    'Pierre Martin',
    'Sophie Bernard',
    'Lucas Dubois',
    'Camille Rousseau',
  ][i % 5]!,
  pharmacyId: PHARMACIES[i % PHARMACIES.length]!.id,
  pharmacyName: PHARMACIES[i % PHARMACIES.length]!.name,
  credentials: i % 2 === 0 ? 'PharmD' : 'Pharmacien diplômé',
  activeQueue: 3 + (i % 12),
}));
const CONDITIONS = [
  'Hypertension',
  'Type 2 Diabetes',
  'Hyperlipidemia',
  'Asthma',
  'Hypothyroidism',
  'Anxiety',
];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function generatePrescription(
  index: number,
  patientIdx: number,
): Prescription {
  const drug = DRUGS[index % DRUGS.length]!;
  const patientId = `phr-${String((patientIdx % 40) + 1).padStart(3, '0')}`;
  const startDate = daysAgo(30 + (index % 60));
  const durationDays = [30, 60, 90, 180][index % 4]!;
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  const pharmacy = PHARMACIES[index % PHARMACIES.length]!;
  const statusPool =
    index % 20 === 0 ? 'expired' : index % 15 === 0 ? 'cancelled' : 'active';

  return {
    id: `rx-${String(index + 1).padStart(4, '0')}`,
    prescriptionNumber: `RX-${2026000 + index}`,
    patientId,
    patientName: `Patient ${patientIdx + 1}`,
    medication: {
      id: drug.id ?? `med-lib-${(index % 13) + 1}`,
      name: drug.name,
      genericName: drug.generic,
      brandName: index % 3 === 0 ? `${drug.name}®` : undefined,
      strength: drug.strength,
      medicationClass: drug.class,
      medicationType: drug.type,
      manufacturer: 'Generic Pharma SA',
      controlledSubstance: Boolean(drug.controlled),
      libraryMedicationId: `ml-${(index % 13) + 1}`,
    },
    dose: drug.strength,
    frequency: index % 2 === 0 ? 'Once daily' : 'Twice daily',
    route:
      drug.type === 'Inhaler'
        ? 'inhalation'
        : drug.type === 'Injection'
          ? 'injection'
          : 'oral',
    durationDays,
    startDate,
    endDate: endDate.toISOString(),
    validityDays: 90,
    expiresAt: daysFromNow(90 - (index % 30)),
    status: statusPool as Prescription['status'],
    refillCount: 3 + (index % 3),
    refillsRemaining: index % 4,
    prescribingPhysician: PHYSICIANS[index % PHYSICIANS.length]!,
    prescribingPhysicianId: `prov-00${(index % 3) + 1}`,
    dispensingPharmacy: pharmacy.name,
    dispensingPharmacyId: pharmacy.id,
    instructions: 'Take with food unless otherwise directed.',
    warnings: index % 5 === 0 ? ['May cause drowsiness'] : [],
    contraindications: index % 7 === 0 ? ['Pregnancy category D'] : [],
    isRecurring: index % 8 === 0,
    carePlanId: index % 6 === 0 ? `cp-${index}` : undefined,
    diagnosisCode: CONDITIONS[index % CONDITIONS.length],
    appointmentId: index % 10 === 0 ? `apt-${index}` : undefined,
    facilityId: 'fac-001',
    createdAt: startDate,
    updatedAt: new Date().toISOString(),
    qrCodePlaceholder: `https://medease.health/rx/${index + 1}`,
  };
}

export function prescriptionToPatientMedication(
  rx: Prescription,
): PatientMedication {
  const end = rx.endDate ? new Date(rx.endDate) : null;
  const remainingDays = end
    ? Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000))
    : undefined;
  const status: PatientMedication['status'] =
    rx.status === 'cancelled'
      ? 'cancelled'
      : rx.status === 'expired'
        ? 'completed'
        : remainingDays !== undefined && remainingDays <= 0
          ? 'completed'
          : rx.status === 'pending'
            ? 'future'
            : 'active';

  return {
    ...rx.medication,
    prescriptionId: rx.id,
    patientId: rx.patientId,
    status,
    dose: rx.dose,
    frequency: rx.frequency,
    route: rx.route,
    startDate: rx.startDate,
    endDate: rx.endDate,
    remainingDays,
    instructions: rx.instructions,
    warnings: rx.warnings,
    contraindications: rx.contraindications,
    sideEffects: ['Nausea', 'Headache', 'Dry mouth'].slice(
      0,
      (parseInt(rx.id.replace(/\D/g, ''), 10) % 3) + 1,
    ),
    storage: 'Store at room temperature',
    prescribingPhysician: rx.prescribingPhysician,
    dispensingPharmacy: rx.dispensingPharmacy,
    refillCount: rx.refillCount,
    refillsRemaining: rx.refillsRemaining,
    adherencePercent: 70 + (parseInt(rx.id.replace(/\D/g, ''), 10) % 28),
    condition: rx.diagnosisCode,
    carePlanId: rx.carePlanId,
  };
}

export const MOCK_PRESCRIPTIONS: Prescription[] = Array.from(
  { length: 2500 },
  (_, i) => generatePrescription(i, i % 40),
);

export const MOCK_MEDICATIONS: PatientMedication[] = MOCK_PRESCRIPTIONS.filter(
  (rx) => ['active', 'renewed', 'pending'].includes(rx.status),
).map(prescriptionToPatientMedication);

function buildTodaySchedule(): ScheduledDose[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const slots: ScheduledDose['slot'][] = [
    'morning',
    'afternoon',
    'evening',
    'night',
  ];
  const hours = [8, 13, 18, 22];

  return MOCK_MEDICATIONS.slice(0, 400).flatMap((med, idx) =>
    slots
      .slice(0, med.frequency.includes('Twice') ? 2 : 1)
      .map((slot, slotIdx) => {
        const scheduled = new Date(today);
        scheduled.setHours(hours[slotIdx] ?? 8, 0, 0, 0);
        const isPast = scheduled.getTime() < Date.now();
        return {
          id: `dose-${med.id}-${slot}`,
          medicationId: med.id,
          patientId: med.patientId,
          medicationName: med.name,
          scheduledAt: scheduled.toISOString(),
          slot,
          dose: med.dose,
          status: isPast
            ? idx % 5 === 0
              ? 'missed'
              : idx % 3 === 0
                ? 'late'
                : 'taken'
            : 'pending',
          instructions: med.instructions,
        };
      }),
  );
}

export const MOCK_SCHEDULE: ScheduledDose[] = buildTodaySchedule();

export const MOCK_DOSE_LOGS: DoseLog[] = Array.from(
  { length: 1500 },
  (_, i) => {
    const med = MOCK_MEDICATIONS[i % MOCK_MEDICATIONS.length]!;
    const dayOffset = i % 90;
    return {
      id: `log-${String(i + 1).padStart(5, '0')}`,
      medicationId: med.id,
      patientId: med.patientId,
      scheduledDoseId: `dose-${med.id}-morning`,
      status: (['taken', 'skipped', 'late', 'partial'] as const)[i % 4]!,
      loggedAt: daysAgo(dayOffset),
      notes: i % 4 === 0 ? 'Taken with meal' : undefined,
      mood: i % 5 === 0 ? 'good' : undefined,
      painScore: i % 6 === 0 ? 3 : undefined,
    };
  },
);

export const MOCK_REMINDERS: MedicationReminder[] = Array.from(
  { length: 500 },
  (_, i) => {
    const med = MOCK_MEDICATIONS[i % MOCK_MEDICATIONS.length]!;
    return {
      id: `rem-${String(i + 1).padStart(4, '0')}`,
      medicationId: med.id,
      patientId: med.patientId,
      type: (['dose', 'refill', 'expiration', 'follow_up'] as const)[i % 4]!,
      channel: (['push', 'email', 'sms', 'in_app'] as const)[i % 4]!,
      title: i % 4 === 0 ? 'Refill reminder' : 'Medication reminder',
      message: `${med.name} — ${med.dose}`,
      dueAt: daysFromNow(i % 7),
      active: i % 11 !== 0,
    };
  },
);

export const MOCK_REFILL_REQUESTS: RefillRequest[] = Array.from(
  { length: 600 },
  (_, i) => {
    const med = MOCK_MEDICATIONS[i % MOCK_MEDICATIONS.length]!;
    const pharmacy = PHARMACIES[i % PHARMACIES.length]!;
    return {
      id: `refill-${String(i + 1).padStart(4, '0')}`,
      prescriptionId: med.prescriptionId,
      medicationId: med.id,
      patientId: med.patientId,
      patientName: `Patient ${parseInt(med.patientId.replace(/\D/g, ''), 10)}`,
      medicationName: med.name,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      status: (
        ['pending', 'approved', 'rejected', 'dispensed', 'partial'] as const
      )[i % 5]!,
      remainingTablets: 5 + (i % 10),
      daysLeft: 3 + (i % 7),
      requestedAt: daysAgo(i % 30),
      expectedDate: daysFromNow(2 + (i % 5)),
      autoRefill: i % 3 === 0,
    };
  },
);

export const MOCK_INTERACTIONS: DrugInteraction[] = Array.from(
  { length: 250 },
  (_, i) => {
    const med = MOCK_MEDICATIONS[i % MOCK_MEDICATIONS.length]!;
    const types = [
      'medication',
      'allergy',
      'food',
      'pregnancy',
      'alcohol',
      'supplement',
    ] as const;
    const type = types[i % types.length]!;
    return {
      id: `int-${String(i + 1).padStart(4, '0')}`,
      patientId: med.patientId,
      type,
      source: med.name,
      target:
        type === 'allergy' ? 'Penicillin' : DRUGS[(i + 3) % DRUGS.length]!.name,
      severity: (['critical', 'high', 'moderate', 'low'] as const)[i % 4]!,
      recommendation:
        type === 'allergy'
          ? 'Do not dispense — documented allergy.'
          : 'Monitor closely and adjust therapy if needed.',
      active: i % 7 !== 0,
    };
  },
);

export const MOCK_ADMINISTRATIONS: MedicationAdministration[] = Array.from(
  { length: 1500 },
  (_, i) => {
    const med = MOCK_MEDICATIONS[i % MOCK_MEDICATIONS.length]!;
    return {
      id: `adm-${String(i + 1).padStart(5, '0')}`,
      medicationId: med.id,
      patientId: med.patientId,
      prescriptionId: med.prescriptionId,
      medicationName: med.name,
      dose: med.dose,
      route: med.route,
      administeredAt: daysAgo(i % 60),
      administeredBy: ['Nurse Marie', 'Nurse Pierre', 'Dr. Chen'][i % 3]!,
      status: (['completed', 'refused', 'held', 'partial'] as const)[
        i % 10 === 0 ? 1 : 0
      ]!,
      notes: i % 5 === 0 ? 'Patient tolerated well' : undefined,
    };
  },
);

export const MOCK_DISPENSES: MedicationDispense[] = Array.from(
  { length: 800 },
  (_, i) => {
    const rx = MOCK_PRESCRIPTIONS[i % MOCK_PRESCRIPTIONS.length]!;
    const pharmacy = PHARMACIES[i % PHARMACIES.length]!;
    const pharmacist = MOCK_PHARMACISTS[i % MOCK_PHARMACISTS.length]!;
    return {
      id: `disp-${String(i + 1).padStart(4, '0')}`,
      prescriptionId: rx.id,
      patientId: rx.patientId,
      medicationName: rx.medication.name,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      quantity: 30 + (i % 60),
      unit: 'tablets',
      dispensedAt: daysAgo(i % 45),
      dispensedBy: pharmacist.name,
      status: i % 15 === 0 ? 'partial' : 'dispensed',
      lotNumber: `LOT-${2026}${String(i % 999).padStart(3, '0')}`,
    };
  },
);

export const MOCK_COURSES: MedicationCourse[] = Array.from(
  { length: 100 },
  (_, i) => {
    const med = MOCK_MEDICATIONS[i % MOCK_MEDICATIONS.length]!;
    const total = 14 + (i % 30);
    const completed = Math.min(total, 5 + (i % total));
    return {
      id: `course-${String(i + 1).padStart(3, '0')}`,
      medicationId: med.id,
      patientId: med.patientId,
      medicationName: med.name,
      startDate: daysAgo(30 + i),
      endDate: completed >= total ? daysAgo(i % 5) : undefined,
      totalDoses: total,
      completedDoses: completed,
      status:
        completed >= total ? 'completed' : i % 9 === 0 ? 'paused' : 'active',
    };
  },
);

export function buildMedicationEducation(
  medicationId: string,
): MedicationEducation | null {
  const med = MOCK_MEDICATIONS.find((m) => m.id === medicationId);
  if (!med) return null;
  return {
    medicationId,
    title: med.name,
    summary: `${med.genericName} — ${med.medicationClass}`,
    instructions: [
      med.instructions,
      `Take ${med.frequency}`,
      `Route: ${med.route}`,
    ],
    sideEffects: med.sideEffects,
    storage: med.storage ?? 'Store at room temperature',
    whenToCall: [
      'Severe allergic reaction',
      'Unusual bleeding',
      'Persistent vomiting',
    ],
  };
}

export const MOCK_PHARMACY_QUEUE: PharmacyPrescriptionQueue[] =
  MOCK_PRESCRIPTIONS.slice(0, 120).map((rx, i) => ({
    id: `pq-${i + 1}`,
    prescriptionId: rx.id,
    patientName: rx.patientName,
    medicationName: rx.medication.name,
    status: (['pending', 'approved', 'dispensed', 'delivered'] as const)[
      i % 4
    ]!,
    receivedAt: daysAgo(i % 3),
    pharmacyId: 'pharm-001',
  }));

export function buildTimeline(patientId: string): MedicationTimelineEntry[] {
  const entries: MedicationTimelineEntry[] = [];
  for (const rx of MOCK_PRESCRIPTIONS.filter(
    (r) => r.patientId === patientId,
  ).slice(0, 8)) {
    entries.push({
      id: `tl-rx-${rx.id}`,
      patientId,
      date: rx.createdAt,
      type: 'prescription',
      title: `Prescribed ${rx.medication.name}`,
      description: `${rx.dose} · ${rx.frequency}`,
      actor: rx.prescribingPhysician,
    });
  }
  for (const log of MOCK_DOSE_LOGS.filter(
    (l) => l.patientId === patientId,
  ).slice(0, 6)) {
    entries.push({
      id: `tl-log-${log.id}`,
      patientId,
      date: log.loggedAt,
      type: 'dose',
      title: `Dose ${log.status}`,
      description: log.notes ?? '',
    });
  }
  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPatientIdForUser(userId: string): string | null {
  return AUTH_USER_PATIENT_MAP[userId] ?? null;
}

export { PHARMACIES, PHYSICIANS, DRUGS };
