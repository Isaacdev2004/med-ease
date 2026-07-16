import type {
  AllergySeverity,
  AllergyType,
  ExportFormat,
  Gender,
  PatientAddressType,
  PatientContactType,
  PatientIdentifierType,
  PatientStatus,
} from './patient.types';

export interface CreatePatientIdentifierInput {
  type: PatientIdentifierType;
  value: string;
  system?: string;
  isPrimary?: boolean;
}

export interface CreatePatientContactInput {
  type: PatientContactType;
  value: string;
  isPrimary?: boolean;
}

export interface CreatePatientAddressInput {
  type?: PatientAddressType;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isPrimary?: boolean;
}

export interface CreatePatientEmergencyContactInput {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary?: boolean;
}

export interface CreatePatientAllergyInput {
  allergen: string;
  type: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
}

export interface CreatePatientPreferenceInput {
  language?: string;
  maritalStatus?: string;
  occupation?: string;
  nationality?: string;
  smoking?: string;
  communication?: Record<string, unknown>;
}

export interface CreatePatientInput {
  mrn: string;
  fullName: string;
  dateOfBirth: string;
  gender?: Gender;
  status?: PatientStatus;
  facilityId?: string;
  userId?: string;
  primaryProviderId?: string;
  fhirResourceId?: string;
  createdBy: string;
  identifiers?: CreatePatientIdentifierInput[];
  contacts?: CreatePatientContactInput[];
  addresses?: CreatePatientAddressInput[];
  emergencyContacts?: CreatePatientEmergencyContactInput[];
  allergies?: CreatePatientAllergyInput[];
  preferences?: CreatePatientPreferenceInput;
}

export interface UpdatePatientInput {
  mrn?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  status?: PatientStatus;
  facilityId?: string | null;
  userId?: string | null;
  primaryProviderId?: string | null;
  updatedBy: string;
  version?: number;
}

export interface ExportPatientsInput {
  format: ExportFormat;
  filters?: {
    status?: PatientStatus;
    facilityId?: string;
  };
}
