import type {
  CreatePatientInput,
  ExportPatientsInput,
  UpdatePatientInput,
} from './patient.dto';
import type { PatientFilters, PatientSearchFilters } from './patient.filters';
import type {
  ExportResult,
  PaginatedResult,
  Patient,
  PatientAddress,
  PatientAllergy,
  PatientContact,
  PatientEmergencyContact,
  PatientIdentifier,
  PatientPreference,
} from './patient.types';

/**
 * Canonical Patients repository contract — single source of truth for mock and HTTP adapters.
 * All methods are async; missing resources throw {@link NotFoundError} from `@workspace/repository-transport`.
 */
export interface PatientsRepositoryContract {
  listPatients(filters?: PatientFilters): Promise<PaginatedResult<Patient>>;
  searchPatients(filters: PatientSearchFilters): Promise<PaginatedResult<Patient>>;
  getPatient(patientId: string): Promise<Patient>;
  createPatient(input: CreatePatientInput): Promise<Patient>;
  updatePatient(patientId: string, input: UpdatePatientInput): Promise<Patient>;
  archivePatient(patientId: string, updatedBy: string): Promise<Patient>;
  restorePatient(patientId: string, updatedBy: string): Promise<Patient>;

  getIdentifiers(patientId: string): Promise<PatientIdentifier[]>;
  getContacts(patientId: string): Promise<PatientContact[]>;
  getAddresses(patientId: string): Promise<PatientAddress[]>;
  getEmergencyContacts(patientId: string): Promise<PatientEmergencyContact[]>;
  getAllergies(patientId: string): Promise<PatientAllergy[]>;
  getPreferences(patientId: string): Promise<PatientPreference | null>;

  exportPatients(input: ExportPatientsInput): Promise<ExportResult>;
}
