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
  Allergy,
  ClinicalAlert,
  Gender,
  PatientDemographics,
  PatientHealthRecord,
  TimelineEntry,
} from '@/services/patient-records/types';

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

function findPrimaryContact(
  contacts: PatientContact[],
  type: PatientContact['type'],
): string | undefined {
  return (
    contacts.find((item) => item.type === type && item.isPrimary)?.value ??
    contacts.find((item) => item.type === type)?.value
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

function createEmptyRecord(
  demographics: PatientDemographics,
  allergies: Allergy[],
  timeline: TimelineEntry[] = [],
): PatientHealthRecord {
  const updatedAt = new Date().toISOString();

  return {
    demographics,
    summary: {
      problemList: [],
      chronicDiseases: [],
      currentDiagnoses: [],
      resolvedConditions: [],
      activeTreatments: [],
      clinicalRisks: [],
    },
    allergies,
    vitals: [],
    encounters: [],
    notes: [],
    medications: [],
    immunizations: [],
    labs: [],
    radiology: [],
    procedures: [],
    carePlans: [],
    documents: [],
    timeline,
    alerts: buildAllergyAlerts(allergies),
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
      activeMedications: [],
      chronicConditions: [],
      emergencyContacts: demographics.emergencyContacts,
      primaryPhysician: demographics.primaryPhysician,
      lastUpdated: updatedAt,
    },
    healthScore: {
      overall: 78,
      vitals: 80,
      labs: 75,
      medications: 76,
      carePlans: 74,
      trend: 'stable',
    },
    updatedAt,
  };
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
}): PatientHealthRecord {
  const demographics = buildDemographics(input);
  const allergies = input.allergies.map(mapAllergy);

  return createEmptyRecord(demographics, allergies, input.timeline ?? []);
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
