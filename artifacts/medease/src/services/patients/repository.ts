import {
  getPatientsControllerArchivePatientUrl,
  getPatientsControllerExportPatientsUrl,
  getPatientsControllerGetAddressesUrl,
  getPatientsControllerGetAllergiesUrl,
  getPatientsControllerGetContactsUrl,
  getPatientsControllerGetEmergencyContactsUrl,
  getPatientsControllerGetIdentifiersUrl,
  getPatientsControllerGetPatientUrl,
  getPatientsControllerGetPreferencesUrl,
  getPatientsControllerListPatientsUrl,
  getPatientsControllerRegisterPatientUrl,
  getPatientsControllerRestorePatientUrl,
  getPatientsControllerSearchPatientsUrl,
  getPatientsControllerUpdatePatientUrl,
} from '@workspace/api-client-react';
import { httpTransport } from '@workspace/repository-transport';
import type {
  CreatePatientInput,
  ExportPatientsInput,
  PatientsRepositoryContract,
  PatientFilters,
  PatientSearchFilters,
  UpdatePatientInput,
} from '@medease/patients-contract';

import {
  filtersToQuery,
  mapArrayDto,
  mapExportResultDto,
  mapPaginatedDto,
  mapPatientAddressDto,
  mapPatientAllergyDto,
  mapPatientContactDto,
  mapPatientDto,
  mapPatientEmergencyContactDto,
  mapPatientIdentifierDto,
  mapPatientPreferenceDto,
} from '@/services/patients/dto-mappers';

class PatientsRepository implements PatientsRepositoryContract {
  private readonly transport = httpTransport;

  async listPatients(filters?: PatientFilters) {
    const dto = await this.transport.get(
      getPatientsControllerListPatientsUrl(),
      {
        query: filtersToQuery(filters),
      },
    );
    return mapPaginatedDto(dto, mapPatientDto);
  }

  async searchPatients(filters: PatientSearchFilters) {
    const dto = await this.transport.get(
      getPatientsControllerSearchPatientsUrl(),
      {
        query: filtersToQuery(filters),
      },
    );
    return mapPaginatedDto(dto, mapPatientDto);
  }

  async getPatient(patientId: string) {
    const dto = await this.transport.get(
      getPatientsControllerGetPatientUrl(patientId),
    );
    return mapPatientDto(dto);
  }

  async createPatient(input: CreatePatientInput) {
    const dto = await this.transport.post(
      getPatientsControllerRegisterPatientUrl(),
      { body: input },
    );
    return mapPatientDto(dto);
  }

  async updatePatient(patientId: string, input: UpdatePatientInput) {
    const dto = await this.transport.patch(
      getPatientsControllerUpdatePatientUrl(patientId),
      { body: input },
    );
    return mapPatientDto(dto);
  }

  async archivePatient(patientId: string, _updatedBy: string) {
    const dto = await this.transport.delete(
      getPatientsControllerArchivePatientUrl(patientId),
    );
    return mapPatientDto(dto);
  }

  async restorePatient(patientId: string, _updatedBy: string) {
    const dto = await this.transport.post(
      getPatientsControllerRestorePatientUrl(patientId),
    );
    return mapPatientDto(dto);
  }

  async getIdentifiers(patientId: string) {
    const dto = await this.transport.get(
      getPatientsControllerGetIdentifiersUrl(patientId),
    );
    return mapArrayDto(dto, mapPatientIdentifierDto);
  }

  async getContacts(patientId: string) {
    const dto = await this.transport.get(
      getPatientsControllerGetContactsUrl(patientId),
    );
    return mapArrayDto(dto, mapPatientContactDto);
  }

  async getAddresses(patientId: string) {
    const dto = await this.transport.get(
      getPatientsControllerGetAddressesUrl(patientId),
    );
    return mapArrayDto(dto, mapPatientAddressDto);
  }

  async getEmergencyContacts(patientId: string) {
    const dto = await this.transport.get(
      getPatientsControllerGetEmergencyContactsUrl(patientId),
    );
    return mapArrayDto(dto, mapPatientEmergencyContactDto);
  }

  async getAllergies(patientId: string) {
    const dto = await this.transport.get(
      getPatientsControllerGetAllergiesUrl(patientId),
    );
    return mapArrayDto(dto, mapPatientAllergyDto);
  }

  async getPreferences(patientId: string) {
    const dto = await this.transport.get(
      getPatientsControllerGetPreferencesUrl(patientId),
    );
    if (dto == null) {
      return null;
    }
    return mapPatientPreferenceDto(dto);
  }

  async exportPatients(input: ExportPatientsInput) {
    const dto = await this.transport.post(
      getPatientsControllerExportPatientsUrl(),
      { body: input },
    );
    return mapExportResultDto(dto);
  }
}

export const patientsRepository = new PatientsRepository();
