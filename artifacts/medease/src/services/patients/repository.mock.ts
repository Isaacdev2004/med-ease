import type {
  CreatePatientInput,
  ExportPatientsInput,
  PaginatedResult,
  Patient,
  PatientsRepositoryContract,
  PatientFilters,
  PatientSearchFilters,
  UpdatePatientInput,
} from '@medease/patients-contract';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@workspace/repository-transport';

import { MOCK_PATIENTS } from '@/services/patients/mock-data';

function paginate<T>(items: T[], page = 1, pageSize = 25): PaginatedResult<T> {
  const safePage = page ?? 1;
  const safePageSize = pageSize ?? 25;
  const start = (safePage - 1) * safePageSize;
  return {
    items: items.slice(start, start + safePageSize),
    total: items.length,
    page: safePage,
    pageSize: safePageSize,
  };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((field) => field?.toLowerCase().includes(lower));
}

function applyFilters(items: Patient[], filters?: PatientFilters): Patient[] {
  let result = filters?.includeArchived
    ? [...items]
    : items.filter((patient) => !patient.deletedAt);

  if (filters?.status) {
    result = result.filter((patient) => patient.status === filters.status);
  }
  if (filters?.facilityId) {
    result = result.filter(
      (patient) => patient.facilityId === filters.facilityId,
    );
  }
  if (filters?.userId) {
    result = result.filter((patient) => patient.userId === filters.userId);
  }
  if (filters?.primaryProviderId) {
    result = result.filter(
      (patient) => patient.primaryProviderId === filters.primaryProviderId,
    );
  }
  if (filters?.q) {
    result = result.filter((patient) =>
      matchQ(filters.q, patient.fullName, patient.mrn, patient.patientId),
    );
  }

  return result;
}

class PatientsMockRepository implements PatientsRepositoryContract {
  private patients = MOCK_PATIENTS.map((patient) => ({ ...patient }));

  private findPatient(patientId: string): Patient {
    const patient = this.patients.find(
      (entry) => entry.patientId === patientId,
    );
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }
    return patient;
  }

  async listPatients(filters?: PatientFilters) {
    const items = applyFilters(this.patients, filters);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async searchPatients(filters: PatientSearchFilters) {
    if (!filters.q?.trim()) {
      throw new ValidationError('Search query is required');
    }
    return this.listPatients(filters);
  }

  async getPatient(patientId: string) {
    return this.findPatient(patientId);
  }

  async createPatient(input: CreatePatientInput) {
    if (
      this.patients.some(
        (entry) =>
          !entry.deletedAt &&
          entry.mrn.toLowerCase() === input.mrn.toLowerCase(),
      )
    ) {
      throw new ConflictError('Patient with this MRN already exists');
    }

    const patientId = `01930000-0000-7000-8000-00000000${String(this.patients.length + 901).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const patient: Patient = {
      patientId,
      tenantId:
        MOCK_PATIENTS[0]?.tenantId ?? '01930000-0000-7000-8000-000000000001',
      facilityId: input.facilityId,
      userId: input.userId,
      mrn: input.mrn,
      fullName: input.fullName,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      status: input.status ?? 'active',
      primaryProviderId: input.primaryProviderId,
      fhirResourceId:
        input.fhirResourceId ??
        `01930000-0000-7000-8000-00000000f${patientId.slice(-3)}`,
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.patients.push(patient);
    return patient;
  }

  async updatePatient(patientId: string, input: UpdatePatientInput) {
    const index = this.patients.findIndex(
      (entry) => entry.patientId === patientId,
    );
    if (index < 0) {
      throw new NotFoundError('Patient not found');
    }

    const current = this.patients[index]!;
    const updated: Patient = {
      ...current,
      mrn: input.mrn ?? current.mrn,
      fullName: input.fullName ?? current.fullName,
      dateOfBirth: input.dateOfBirth ?? current.dateOfBirth,
      gender: input.gender ?? current.gender,
      status: input.status ?? current.status,
      facilityId:
        input.facilityId === null
          ? undefined
          : (input.facilityId ?? current.facilityId),
      userId:
        input.userId === null ? undefined : (input.userId ?? current.userId),
      primaryProviderId:
        input.primaryProviderId === null
          ? undefined
          : (input.primaryProviderId ?? current.primaryProviderId),
      updatedBy: input.updatedBy,
      updatedAt: new Date().toISOString(),
      version: input.version ?? current.version + 1,
    };
    this.patients[index] = updated;
    return updated;
  }

  async archivePatient(patientId: string, updatedBy: string) {
    const index = this.patients.findIndex(
      (entry) => entry.patientId === patientId,
    );
    if (index < 0) {
      throw new NotFoundError('Patient not found');
    }
    if (this.patients[index]!.deletedAt) {
      throw new ValidationError('Patient is already archived');
    }

    const archived: Patient = {
      ...this.patients[index]!,
      status: 'inactive',
      updatedBy,
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString(),
      version: this.patients[index]!.version + 1,
    };
    this.patients[index] = archived;
    return archived;
  }

  async restorePatient(patientId: string, updatedBy: string) {
    const index = this.patients.findIndex(
      (entry) => entry.patientId === patientId,
    );
    if (index < 0) {
      throw new NotFoundError('Patient not found');
    }
    if (!this.patients[index]!.deletedAt) {
      throw new ValidationError('Patient is not archived');
    }

    const restored: Patient = {
      ...this.patients[index]!,
      status: 'active',
      updatedBy,
      updatedAt: new Date().toISOString(),
      deletedAt: undefined,
      version: this.patients[index]!.version + 1,
    };
    this.patients[index] = restored;
    return restored;
  }

  async getIdentifiers(_patientId: string) {
    return [];
  }

  async getContacts(_patientId: string) {
    return [];
  }

  async getAddresses(_patientId: string) {
    return [];
  }

  async getEmergencyContacts(_patientId: string) {
    return [];
  }

  async getAllergies(_patientId: string) {
    return [];
  }

  async getPreferences(_patientId: string) {
    return null;
  }

  async exportPatients(input: ExportPatientsInput) {
    const items = applyFilters(this.patients, input.filters);
    return {
      format: input.format,
      exportedAt: new Date().toISOString(),
      recordCount: items.length,
    };
  }
}

export const patientsMockRepository = new PatientsMockRepository();
