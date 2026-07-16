import { patientsRepository } from '@/services/patients/repository';
import type {
  CreatePatientInput,
  ExportPatientsInput,
  PatientFilters,
  PatientSearchFilters,
  UpdatePatientInput,
} from '@medease/patients-contract';

const DELAY = 250;

async function delay(ms = DELAY) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const patientsService = {
  async listPatients(filters?: PatientFilters) {
    await delay();
    return patientsRepository.listPatients(filters);
  },
  async searchPatients(filters: PatientSearchFilters) {
    await delay();
    return patientsRepository.searchPatients(filters);
  },
  async getPatient(patientId: string) {
    await delay();
    return patientsRepository.getPatient(patientId);
  },
  async createPatient(input: CreatePatientInput) {
    await delay();
    return patientsRepository.createPatient(input);
  },
  async updatePatient(patientId: string, input: UpdatePatientInput) {
    await delay();
    return patientsRepository.updatePatient(patientId, input);
  },
  async archivePatient(patientId: string, updatedBy: string) {
    await delay();
    return patientsRepository.archivePatient(patientId, updatedBy);
  },
  async restorePatient(patientId: string, updatedBy: string) {
    await delay();
    return patientsRepository.restorePatient(patientId, updatedBy);
  },
  async getIdentifiers(patientId: string) {
    await delay();
    return patientsRepository.getIdentifiers(patientId);
  },
  async getContacts(patientId: string) {
    await delay();
    return patientsRepository.getContacts(patientId);
  },
  async getAddresses(patientId: string) {
    await delay();
    return patientsRepository.getAddresses(patientId);
  },
  async getEmergencyContacts(patientId: string) {
    await delay();
    return patientsRepository.getEmergencyContacts(patientId);
  },
  async getAllergies(patientId: string) {
    await delay();
    return patientsRepository.getAllergies(patientId);
  },
  async getPreferences(patientId: string) {
    await delay();
    return patientsRepository.getPreferences(patientId);
  },
  async exportPatients(input: ExportPatientsInput) {
    await delay();
    return patientsRepository.exportPatients(input);
  },
};
