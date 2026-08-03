import type {
  Patient,
  PatientAddress,
  PatientAllergy,
  PatientContact,
  PatientEmergencyContact,
  PatientIdentifier,
  PatientPreference,
} from '@medease/patients-contract';

import type {
  CareGoal,
  CarePlan as DomainCarePlan,
  CareTask,
} from '@/services/care-plans/types';
import type { LabObservation } from '@/services/laboratory/types';
import type { PatientMedication as DomainMedication } from '@/services/medications/types';
import type { VitalSign } from '@/services/patient-monitoring/types';
import type {
  Allergy,
  CarePlan,
  ClinicalAlert,
  Encounter,
  Gender,
  LabResult,
  PatientDemographics,
  PatientHealthRecord,
  PatientMedication,
  RadiologyStudy,
  TimelineEntry,
  VitalReading,
} from '@/services/patient-records/types';
import type {
  DiagnosticReport,
  RadiologyStudy as DomainRadiologyStudy,
} from '@/services/radiology/types';
import type { TelemedicineSession } from '@/services/telemedicine/types';

function asGender(value: Patient['gender']): Gender {
  if (
    value === 'male' ||
    value === 'female' ||
    value === 'other' ||
    value === 'unknown'
  ) {
    return value;
  }
  return 'unknown';
}

function mapAllergy(allergy: PatientAllergy): Allergy {
  const type =
    allergy.type === 'drug' ||
    allergy.type === 'food' ||
    allergy.type === 'environmental'
      ? allergy.type
      : 'environmental';

  return {
    id: allergy.allergyId,
    type,
    substance: allergy.allergen,
    severity: allergy.severity,
    reaction: allergy.reaction ?? 'Not recorded',
    recordedDate: allergy.notedAt,
  };
}

function findPrimaryIdentifier(
  identifiers: PatientIdentifier[],
  type: PatientIdentifier['type'],
): string | undefined {
  return (
    identifiers.find((item) => item.type === type && item.isPrimary)?.value ??
    identifiers.find((item) => item.type === type)?.value
  );
}

function findPrimaryAddress(addresses: PatientAddress[]) {
  return (
    addresses.find((item) => item.isPrimary) ??
    addresses.find((item) => item.type === 'home') ??
    addresses[0]
  );
}

function buildDemographics(input: {
  patient: Patient;
  identifiers: PatientIdentifier[];
  contacts: PatientContact[];
  addresses: PatientAddress[];
  emergencyContacts: PatientEmergencyContact[];
  preferences?: PatientPreference;
}): PatientDemographics {
  const { patient, identifiers, contacts, addresses, emergencyContacts, preferences } =
    input;
  const address = findPrimaryAddress(addresses);

  return {
    id: patient.patientId,
    mrn: patient.mrn,
    userId: patient.userId,
    fullName: patient.fullName,
    gender: asGender(patient.gender),
    dateOfBirth: patient.dateOfBirth,
    bloodGroup: 'unknown',
    address: {
      street: address?.street ?? '—',
      city: address?.city ?? '—',
      postalCode: address?.postalCode ?? '—',
      country: address?.country ?? '—',
    },
    language: preferences?.language ?? 'English',
    maritalStatus: preferences?.maritalStatus ?? '—',
    occupation: preferences?.occupation ?? '—',
    nationality: preferences?.nationality ?? '—',
    weightKg: 0,
    heightCm: 0,
    bmi: 0,
    smoking:
      preferences?.smoking === 'former' || preferences?.smoking === 'current'
        ? preferences.smoking
        : 'never',
    alcohol: 'none',
    primaryPhysician: patient.primaryProviderId ?? '—',
    emergencyContacts: emergencyContacts.map((contact) => ({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
    })),
    insurance: {
      provider: '—',
      policyNumber: '—',
    },
    nationalId: findPrimaryIdentifier(identifiers, 'national_id') ?? '—',
  };
}

function buildAllergyAlerts(allergies: Allergy[]): ClinicalAlert[] {
  return allergies
    .filter(
      (allergy) =>
        allergy.severity === 'severe' || allergy.severity === 'life_threatening',
    )
    .map((allergy) => ({
      id: `alert-${allergy.id}`,
      category: 'drug_allergy' as const,
      severity:
        allergy.severity === 'life_threatening'
          ? ('critical' as const)
          : ('warning' as const),
      title: `${allergy.substance} allergy`,
      message: allergy.reaction,
      active: true,
    }));
}

function mapMedicationStatus(
  status: DomainMedication['status'],
): PatientMedication['status'] {
  if (status === 'cancelled') return 'stopped';
  if (status === 'future') return 'active';
  if (status === 'completed' || status === 'paused' || status === 'active') {
    return status;
  }
  return 'active';
}

function mapMedications(items: DomainMedication[]): PatientMedication[] {
  return items.map((med) => ({
    id: med.id,
    name: med.name,
    dosage: med.dose || med.strength,
    frequency: med.frequency,
    status: mapMedicationStatus(med.status),
    prescribedBy: med.prescribingPhysician,
    startDate: med.startDate,
    endDate: med.endDate,
    instructions: med.instructions,
    compliance: med.adherencePercent,
    renewals: med.refillsRemaining,
  }));
}

function mapLabFlag(flag: LabObservation['flag']): LabResult['flag'] {
  if (flag === 'critical_high' || flag === 'critical_low') return 'critical';
  if (flag === 'abnormal') return 'high';
  if (flag === 'high' || flag === 'low' || flag === 'normal') return flag;
  return 'normal';
}

function mapLabs(observations: LabObservation[]): LabResult[] {
  return observations
    .slice()
    .sort(
      (a, b) =>
        new Date(b.resultedAt ?? b.collectedAt).getTime() -
        new Date(a.resultedAt ?? a.collectedAt).getTime(),
    )
    .map((obs) => ({
      id: obs.id,
      testName: obs.testName,
      category: obs.category,
      value: obs.value,
      unit: obs.unit,
      referenceRange: obs.referenceRange,
      flag: mapLabFlag(obs.flag),
      collectedAt: obs.collectedAt,
      resultedAt: obs.resultedAt ?? obs.collectedAt,
    }));
}

function mapRadiologyModality(
  modality: DomainRadiologyStudy['modality'],
): RadiologyStudy['modality'] {
  if (
    modality === 'MRI' ||
    modality === 'CT' ||
    modality === 'Ultrasound' ||
    modality === 'X-Ray'
  ) {
    return modality;
  }
  return 'X-Ray';
}

function mapRadiology(
  studies: DomainRadiologyStudy[],
  reports: DiagnosticReport[],
): RadiologyStudy[] {
  const reportByStudy = new Map(reports.map((report) => [report.studyId, report]));

  return studies
    .slice()
    .sort(
      (a, b) =>
        new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime(),
    )
    .map((study) => {
      const report = reportByStudy.get(study.id);
      const impression = report?.impression?.summary;
      const findings = report?.findings?.map((f) => f.description).join('; ');
      return {
        id: study.id,
        modality: mapRadiologyModality(study.modality),
        bodyPart: study.bodyPart,
        date: study.studyDate,
        report: impression || findings || study.clinicalIndication || study.reason,
        radiologist: study.radiologistName ?? report?.radiologistName ?? '—',
        imageUrl: study.series[0]?.instances[0]?.imageUrl,
      };
    });
}

function mapVitals(vitals: VitalSign[]): VitalReading[] {
  const byTime = new Map<string, VitalReading>();

  for (const vital of vitals) {
    const key = vital.recordedAt;
    const reading =
      byTime.get(key) ??
      ({
        id: `vital-${key}`,
        recordedAt: vital.recordedAt,
        recordedBy: vital.recordedBy,
      } satisfies VitalReading);

    const numeric =
      typeof vital.value === 'number'
        ? vital.value
        : Number.parseFloat(String(vital.value));

    switch (vital.type) {
      case 'blood_pressure':
        reading.bloodPressureSystolic = vital.systolic ?? numeric;
        reading.bloodPressureDiastolic = vital.diastolic;
        break;
      case 'heart_rate':
        reading.heartRate = numeric;
        break;
      case 'temperature':
        reading.temperatureC = numeric;
        break;
      case 'respiratory_rate':
        reading.respirationRate = numeric;
        break;
      case 'spo2':
        reading.oxygenSaturation = numeric;
        break;
      case 'blood_glucose':
        reading.bloodGlucose = numeric;
        break;
      case 'weight':
        reading.weightKg = numeric;
        break;
      case 'bmi':
        reading.bmi = numeric;
        break;
      default:
        break;
    }

    byTime.set(key, reading);
  }

  return [...byTime.values()].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );
}

function mapCarePlanStatus(
  status: DomainCarePlan['status'],
): CarePlan['status'] {
  if (status === 'active' || status === 'completed' || status === 'on_hold' || status === 'cancelled') {
    return status;
  }
  if (status === 'draft' || status === 'suspended') return 'on_hold';
  return 'cancelled';
}

function mapCarePlans(
  plans: DomainCarePlan[],
  goals: CareGoal[],
  tasks: CareTask[],
): CarePlan[] {
  return plans.map((plan) => {
    const planGoals = goals.filter((goal) => goal.carePlanId === plan.id);
    const planTasks = tasks.filter((task) => task.carePlanId === plan.id);
    const clinicians = [
      plan.assignedPhysician,
      ...planTasks.map((task) => task.owner).filter(Boolean),
    ];

    return {
      id: plan.id,
      title: plan.title,
      goals: planGoals.length
        ? planGoals.map((goal) => goal.title)
        : [plan.description || plan.primaryDiagnosis || 'Care plan goals'].filter(
            Boolean,
          ),
      interventions: planTasks.length
        ? planTasks.slice(0, 8).map((task) => task.title)
        : [
            plan.type.replaceAll('_', ' '),
            plan.primaryDiagnosis ? `Manage ${plan.primaryDiagnosis}` : '',
          ].filter(Boolean),
      progress: `${plan.progressPercent}% complete`,
      assignedClinicians: [...new Set(clinicians.filter(Boolean))],
      status: mapCarePlanStatus(plan.status),
      reviewSchedule: plan.reviewDate,
    };
  });
}

function mapTeleEncounters(sessions: TelemedicineSession[]): Encounter[] {
  return sessions.map((session) => ({
    id: session.sessionId,
    type: 'teleconsultation' as const,
    date: session.actualStart ?? session.scheduledStart,
    department: session.specialty,
    physician: session.clinicianName,
    facility: 'Telemedicine',
    reason: `${session.sessionType.replaceAll('_', ' ')} visit`,
    summary: session.notes,
  }));
}

function buildClinicalTimeline(input: {
  medications: PatientMedication[];
  labs: LabResult[];
  radiology: RadiologyStudy[];
  vitals: VitalReading[];
  carePlans: CarePlan[];
  encounters: Encounter[];
}): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const med of input.medications.slice(0, 12)) {
    entries.push({
      id: `tl-med-${med.id}`,
      category: 'medication',
      date: med.startDate,
      title: med.name,
      description: `${med.dosage} · ${med.frequency} · ${med.status}`,
      actor: med.prescribedBy,
    });
  }

  for (const lab of input.labs.slice(0, 12)) {
    entries.push({
      id: `tl-lab-${lab.id}`,
      category: 'lab',
      date: lab.resultedAt,
      title: lab.testName,
      description: `${lab.value} ${lab.unit} (${lab.flag})`,
      severity:
        lab.flag === 'critical'
          ? 'critical'
          : lab.flag === 'normal'
            ? undefined
            : 'warning',
    });
  }

  for (const study of input.radiology.slice(0, 8)) {
    entries.push({
      id: `tl-rad-${study.id}`,
      category: 'radiology',
      date: study.date,
      title: `${study.modality} — ${study.bodyPart}`,
      description: study.report,
      actor: study.radiologist,
    });
  }

  for (const vital of input.vitals.slice(0, 8)) {
    entries.push({
      id: `tl-vital-${vital.id}`,
      category: 'vital',
      date: vital.recordedAt,
      title: 'Vital signs recorded',
      description: [
        vital.bloodPressureSystolic != null &&
        vital.bloodPressureDiastolic != null
          ? `BP ${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`
          : null,
        vital.heartRate != null ? `HR ${vital.heartRate}` : null,
        vital.oxygenSaturation != null ? `SpO₂ ${vital.oxygenSaturation}%` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      actor: vital.recordedBy,
    });
  }

  for (const plan of input.carePlans.slice(0, 6)) {
    entries.push({
      id: `tl-plan-${plan.id}`,
      category: 'care_plan',
      date: plan.reviewSchedule,
      title: plan.title,
      description: `${plan.progress} · ${plan.status}`,
      actor: plan.assignedClinicians[0],
    });
  }

  for (const encounter of input.encounters.slice(0, 8)) {
    entries.push({
      id: `tl-enc-${encounter.id}`,
      category: 'encounter',
      date: encounter.date,
      title: `${encounter.type.replaceAll('_', ' ')} — ${encounter.department}`,
      description: `${encounter.physician} · ${encounter.reason}`,
      actor: encounter.physician,
    });
  }

  return entries;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeHealthScore(input: {
  medications: PatientMedication[];
  labs: LabResult[];
  vitals: VitalReading[];
  carePlans: CarePlan[];
}): PatientHealthRecord['healthScore'] {
  const adherence = input.medications
    .map((med) => med.compliance)
    .filter((value): value is number => typeof value === 'number');
  const medications = adherence.length
    ? adherence.reduce((sum, value) => sum + value, 0) / adherence.length
    : 82;

  const criticalLabs = input.labs.filter((lab) => lab.flag === 'critical').length;
  const abnormalLabs = input.labs.filter(
    (lab) => lab.flag === 'high' || lab.flag === 'low',
  ).length;
  const labs = input.labs.length
    ? clampScore(92 - criticalLabs * 18 - abnormalLabs * 6)
    : 80;

  const vitals = input.vitals.length ? 86 : 78;

  const planProgress = input.carePlans.map((plan) => {
    const match = /(\d+)/.exec(plan.progress);
    return match ? Number(match[1]) : 70;
  });
  const carePlans = planProgress.length
    ? planProgress.reduce((sum, value) => sum + value, 0) / planProgress.length
    : 76;

  const overall = clampScore(
    medications * 0.3 + labs * 0.25 + vitals * 0.2 + carePlans * 0.25,
  );

  return {
    overall,
    vitals: clampScore(vitals),
    labs: clampScore(labs),
    medications: clampScore(medications),
    carePlans: clampScore(carePlans),
    trend: overall >= 80 ? 'improving' : overall >= 65 ? 'stable' : 'declining',
  };
}

function mergeTimeline(...groups: TimelineEntry[][]): TimelineEntry[] {
  const seen = new Set<string>();
  return groups
    .flat()
    .filter((entry) => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export function buildPatientHealthRecordFromApi(input: {
  patient: Patient;
  identifiers: PatientIdentifier[];
  contacts: PatientContact[];
  addresses: PatientAddress[];
  emergencyContacts: PatientEmergencyContact[];
  allergies: PatientAllergy[];
  preferences?: PatientPreference;
  timeline?: TimelineEntry[];
  medications?: DomainMedication[];
  labObservations?: LabObservation[];
  radiologyStudies?: DomainRadiologyStudy[];
  radiologyReports?: DiagnosticReport[];
  vitals?: VitalSign[];
  carePlans?: DomainCarePlan[];
  careGoals?: CareGoal[];
  careTasks?: CareTask[];
  telemedicineSessions?: TelemedicineSession[];
}): PatientHealthRecord {
  const demographics = buildDemographics(input);
  const allergies = input.allergies.map(mapAllergy);
  const medications = mapMedications(input.medications ?? []);
  const labs = mapLabs(input.labObservations ?? []);
  const radiology = mapRadiology(
    input.radiologyStudies ?? [],
    input.radiologyReports ?? [],
  );
  const vitals = mapVitals(input.vitals ?? []);
  const carePlans = mapCarePlans(
    input.carePlans ?? [],
    input.careGoals ?? [],
    input.careTasks ?? [],
  );
  const encounters = mapTeleEncounters(input.telemedicineSessions ?? []);
  const updatedAt = new Date().toISOString();

  const activeMedications = medications.filter((med) => med.status === 'active');
  const criticalLabAlerts: ClinicalAlert[] = labs
    .filter((lab) => lab.flag === 'critical')
    .slice(0, 5)
    .map((lab) => ({
      id: `alert-lab-${lab.id}`,
      category: 'critical_lab' as const,
      severity: 'critical' as const,
      title: `Critical lab: ${lab.testName}`,
      message: `${lab.value} ${lab.unit} (ref ${lab.referenceRange})`,
      active: true,
    }));

  const clinicalTimeline = buildClinicalTimeline({
    medications,
    labs,
    radiology,
    vitals,
    carePlans,
    encounters,
  });

  const diagnosisLabels = [
    ...new Set(
      (input.carePlans ?? [])
        .map((plan) => plan.primaryDiagnosis)
        .filter((value): value is string => Boolean(value)),
    ),
  ];
  const diagnoses = (input.carePlans ?? [])
    .filter((plan) => plan.primaryDiagnosis)
    .map((plan) => ({
      id: `dx-${plan.id}`,
      code: plan.diagnosisCode,
      label: plan.primaryDiagnosis!,
      status:
        plan.status === 'completed'
          ? ('resolved' as const)
          : plan.type === 'chronic_disease'
            ? ('chronic' as const)
            : ('active' as const),
      onsetDate: plan.startDate,
      resolvedDate: plan.status === 'completed' ? plan.endDate : undefined,
    }));

  return {
    demographics,
    summary: {
      problemList: diagnoses.filter((dx) => dx.status !== 'resolved'),
      chronicDiseases: diagnosisLabels,
      currentDiagnoses: diagnoses.filter((dx) => dx.status === 'active' || dx.status === 'chronic'),
      resolvedConditions: diagnoses.filter((dx) => dx.status === 'resolved'),
      activeTreatments: activeMedications.map((med) => med.name),
      clinicalRisks: allergies
        .filter(
          (allergy) =>
            allergy.severity === 'severe' ||
            allergy.severity === 'life_threatening',
        )
        .map((allergy) => `${allergy.substance} allergy`),
    },
    allergies,
    vitals,
    encounters,
    notes: [],
    medications,
    immunizations: [],
    labs,
    radiology,
    procedures: [],
    carePlans,
    documents: [],
    timeline: mergeTimeline(input.timeline ?? [], clinicalTimeline),
    alerts: [...buildAllergyAlerts(allergies), ...criticalLabAlerts],
    familyHistory: [],
    lifestyle: {
      diet: '—',
      exercise: '—',
      sleepHours: 0,
      stressLevel: 'moderate',
    },
    socialHistory: {
      livingSituation: '—',
      supportNetwork: '—',
      employment: demographics.occupation,
    },
    emergencySummary: {
      bloodGroup: demographics.bloodGroup,
      criticalAllergies: allergies
        .filter(
          (allergy) =>
            allergy.severity === 'severe' ||
            allergy.severity === 'life_threatening',
        )
        .map((allergy) => allergy.substance),
      activeMedications: activeMedications.map((med) => med.name),
      chronicConditions: diagnosisLabels,
      emergencyContacts: demographics.emergencyContacts,
      primaryPhysician: demographics.primaryPhysician,
      lastUpdated: updatedAt,
    },
    healthScore: computeHealthScore({ medications, labs, vitals, carePlans }),
    updatedAt,
  };
}

export function buildDemographicsFromPatient(patient: Patient): PatientDemographics {
  return buildDemographics({
    patient,
    identifiers: [],
    contacts: [],
    addresses: [],
    emergencyContacts: [],
  });
}
