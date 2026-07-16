import type {
  AllergySeverity,
  AllergyType,
  Gender,
  Patient,
  PatientAddress,
  PatientAddressType,
  PatientAllergy,
  PatientContact,
  PatientContactType,
  PatientEmergencyContact,
  PatientIdentifier,
  PatientIdentifierType,
  PatientPreference,
  PatientStatus,
} from '@medease/patients-contract';
import type { Prisma } from '@medease/prisma';

export function mapPatientStatus(status: string): PatientStatus {
  switch (status) {
    case 'active':
    case 'inactive':
    case 'observation':
      return status;
    default:
      return 'active';
  }
}

export function mapGender(gender: string | null | undefined): Gender | undefined {
  if (!gender) return undefined;
  switch (gender) {
    case 'male':
    case 'female':
    case 'other':
    case 'unknown':
      return gender;
    default:
      return 'unknown';
  }
}

export function mapPatient(patient: Prisma.PatientGetPayload<object>): Patient {
  return {
    patientId: patient.id,
    tenantId: patient.tenantId,
    facilityId: patient.facilityId ?? undefined,
    userId: patient.userId ?? undefined,
    mrn: patient.mrn,
    fullName: patient.fullName,
    dateOfBirth: patient.dateOfBirth.toISOString().slice(0, 10),
    gender: mapGender(patient.gender),
    status: mapPatientStatus(patient.status),
    primaryProviderId: patient.primaryProviderId ?? undefined,
    fhirResourceId: patient.fhirResourceId,
    createdBy: patient.createdBy,
    updatedBy: patient.updatedBy ?? undefined,
    createdAt: patient.createdAt.toISOString(),
    updatedAt: patient.updatedAt.toISOString(),
    deletedAt: patient.deletedAt?.toISOString(),
    version: patient.version,
  };
}

export function mapPatientIdentifier(
  identifier: Prisma.PatientIdentifierGetPayload<object>,
): PatientIdentifier {
  return {
    identifierId: identifier.id,
    tenantId: identifier.tenantId,
    patientId: identifier.patientId,
    type: identifier.type as PatientIdentifierType,
    value: identifier.value,
    system: identifier.system ?? undefined,
    isPrimary: identifier.isPrimary,
    createdAt: identifier.createdAt.toISOString(),
    updatedAt: identifier.updatedAt.toISOString(),
  };
}

export function mapPatientContact(contact: Prisma.PatientContactGetPayload<object>): PatientContact {
  return {
    contactId: contact.id,
    tenantId: contact.tenantId,
    patientId: contact.patientId,
    type: contact.type as PatientContactType,
    value: contact.value,
    isPrimary: contact.isPrimary,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
}

export function mapPatientAddress(address: Prisma.PatientAddressGetPayload<object>): PatientAddress {
  return {
    addressId: address.id,
    tenantId: address.tenantId,
    patientId: address.patientId,
    type: address.type as PatientAddressType,
    street: address.street,
    city: address.city,
    state: address.state ?? undefined,
    postalCode: address.postalCode,
    country: address.country,
    isPrimary: address.isPrimary,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  };
}

export function mapPatientEmergencyContact(
  contact: Prisma.PatientEmergencyContactGetPayload<object>,
): PatientEmergencyContact {
  return {
    emergencyContactId: contact.id,
    tenantId: contact.tenantId,
    patientId: contact.patientId,
    name: contact.name,
    relationship: contact.relationship,
    phone: contact.phone,
    email: contact.email ?? undefined,
    isPrimary: contact.isPrimary,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
}

export function mapPatientAllergy(allergy: Prisma.PatientAllergyGetPayload<object>): PatientAllergy {
  return {
    allergyId: allergy.id,
    tenantId: allergy.tenantId,
    patientId: allergy.patientId,
    allergen: allergy.allergen,
    type: allergy.type as AllergyType,
    severity: allergy.severity as AllergySeverity,
    reaction: allergy.reaction ?? undefined,
    notedAt: allergy.notedAt.toISOString(),
    createdAt: allergy.createdAt.toISOString(),
    updatedAt: allergy.updatedAt.toISOString(),
  };
}

export function mapPatientPreference(
  preference: Prisma.PatientPreferenceGetPayload<object>,
): PatientPreference {
  return {
    preferenceId: preference.id,
    tenantId: preference.tenantId,
    patientId: preference.patientId,
    language: preference.language,
    maritalStatus: preference.maritalStatus ?? undefined,
    occupation: preference.occupation ?? undefined,
    nationality: preference.nationality ?? undefined,
    smoking: preference.smoking ?? undefined,
    communication:
      preference.communication && typeof preference.communication === 'object'
        ? (preference.communication as Record<string, unknown>)
        : undefined,
    createdAt: preference.createdAt.toISOString(),
    updatedAt: preference.updatedAt.toISOString(),
  };
}
