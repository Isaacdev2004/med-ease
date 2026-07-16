export type PatientStatus = 'active' | 'inactive' | 'observation';
export type Gender = 'male' | 'female' | 'other' | 'unknown';
export type PatientIdentifierType =
  | 'mrn'
  | 'national_id'
  | 'passport'
  | 'drivers_license'
  | 'ssn'
  | 'other';
export type PatientContactType = 'phone' | 'email' | 'fax' | 'other';
export type PatientAddressType = 'home' | 'work' | 'mailing' | 'temporary' | 'other';
export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'life_threatening';
export type AllergyType = 'drug' | 'food' | 'environmental' | 'other';
export type ExportFormat = 'csv' | 'pdf' | 'xlsx';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ExportResult {
  format: ExportFormat;
  exportedAt: string;
  recordCount: number;
}

export interface Patient {
  patientId: string;
  tenantId: string;
  facilityId?: string;
  userId?: string;
  mrn: string;
  fullName: string;
  dateOfBirth: string;
  gender?: Gender;
  status: PatientStatus;
  primaryProviderId?: string;
  fhirResourceId: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
}

export interface PatientIdentifier {
  identifierId: string;
  tenantId: string;
  patientId: string;
  type: PatientIdentifierType;
  value: string;
  system?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientContact {
  contactId: string;
  tenantId: string;
  patientId: string;
  type: PatientContactType;
  value: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientAddress {
  addressId: string;
  tenantId: string;
  patientId: string;
  type: PatientAddressType;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientEmergencyContact {
  emergencyContactId: string;
  tenantId: string;
  patientId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientAllergy {
  allergyId: string;
  tenantId: string;
  patientId: string;
  allergen: string;
  type: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  notedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientPreference {
  preferenceId: string;
  tenantId: string;
  patientId: string;
  language: string;
  maritalStatus?: string;
  occupation?: string;
  nationality?: string;
  smoking?: string;
  communication?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
