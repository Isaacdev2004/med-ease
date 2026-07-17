import { Injectable } from '@nestjs/common';

import type {
  CreatePatientInput,
  ExportPatientsInput,
  Patient,
  PatientAddress,
  PatientAllergy,
  PatientContact,
  PatientEmergencyContact,
  PatientFilters,
  PatientIdentifier,
  PatientIdentifierType,
  PatientPreference,
  PatientSearchFilters,
  PatientsRepositoryContract,
  UpdatePatientInput,
  CreatePatientAllergyInput,
  CreatePatientPreferenceInput,
} from '@medease/patients-contract';
import {
  normalizePagination,
  Prisma,
  PrismaService,
  restoreSoftDeleteData,
  softDeleteData,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import {
  ConflictError,
  ValidationError,
} from '@workspace/repository-transport/errors';
import { newId } from '@medease/uuid';

import {
  assertPatientFound,
  buildExportResult,
  mapPatientRepositoryError,
  toContractPaginated,
} from './patients.helpers';
import {
  mapPatient,
  mapPatientAddress,
  mapPatientAllergy,
  mapPatientContact,
  mapPatientEmergencyContact,
  mapPatientIdentifier,
  mapPatientPreference,
} from './mappers/patient.mapper';
import {
  buildPatientExportWhere,
  buildPatientListWhere,
  buildPatientSearchWhere,
} from './queries/patient.queries';

@Injectable()
export class PatientsRepository
  extends TenantAwareRepository
  implements PatientsRepositoryContract
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  listPatients(filters: PatientFilters = {}) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildPatientListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.patient.findMany({
          where,
          skip,
          take,
          orderBy: [{ fullName: 'asc' }, { createdAt: 'desc' }],
        }),
        tx.patient.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapPatient), total, page, pageSize),
      );
    });
  }

  searchPatients(filters: PatientSearchFilters) {
    if (!filters.q?.trim()) {
      throw new ValidationError('Search query is required');
    }

    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildPatientSearchWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.patient.findMany({
          where,
          skip,
          take,
          orderBy: [{ fullName: 'asc' }, { createdAt: 'desc' }],
        }),
        tx.patient.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapPatient), total, page, pageSize),
      );
    });
  }

  async getPatient(patientId: string): Promise<Patient> {
    return this.prisma.runInTransaction(async (tx) => {
      const patient = await tx.patient.findFirst({
        where: { id: patientId, tenantId: this.tenantId },
      });
      assertPatientFound(patient, patientId);
      return mapPatient(patient);
    });
  }

  async createPatient(input: CreatePatientInput): Promise<Patient> {
    const patientId = newId();
    const fhirResourceId = input.fhirResourceId ?? patientId;

    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const patient = await tx.patient.create({
          data: {
            id: patientId,
            tenantId: this.tenantId,
            facilityId: input.facilityId,
            userId: input.userId,
            mrn: input.mrn,
            fullName: input.fullName,
            dateOfBirth: new Date(input.dateOfBirth),
            gender: input.gender,
            status: input.status ?? 'active',
            primaryProviderId: input.primaryProviderId,
            fhirResourceId,
            createdBy: input.createdBy,
          },
        });

        if (input.identifiers?.length) {
          await tx.patientIdentifier.createMany({
            data: input.identifiers.map((identifier) => ({
              id: newId(),
              tenantId: this.tenantId,
              patientId,
              type: identifier.type,
              value: identifier.value,
              system: identifier.system,
              isPrimary: identifier.isPrimary ?? false,
            })),
          });
        }

        if (input.contacts?.length) {
          await tx.patientContact.createMany({
            data: input.contacts.map((contact) => ({
              id: newId(),
              tenantId: this.tenantId,
              patientId,
              type: contact.type,
              value: contact.value,
              isPrimary: contact.isPrimary ?? false,
            })),
          });
        }

        if (input.addresses?.length) {
          await tx.patientAddress.createMany({
            data: input.addresses.map((address) => ({
              id: newId(),
              tenantId: this.tenantId,
              patientId,
              type: address.type ?? 'home',
              street: address.street,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
              isPrimary: address.isPrimary ?? false,
            })),
          });
        }

        if (input.emergencyContacts?.length) {
          await tx.patientEmergencyContact.createMany({
            data: input.emergencyContacts.map((contact) => ({
              id: newId(),
              tenantId: this.tenantId,
              patientId,
              name: contact.name,
              relationship: contact.relationship,
              phone: contact.phone,
              email: contact.email,
              isPrimary: contact.isPrimary ?? true,
            })),
          });
        }

        if (input.allergies?.length) {
          await tx.patientAllergy.createMany({
            data: input.allergies.map((allergy) => ({
              id: newId(),
              tenantId: this.tenantId,
              patientId,
              allergen: allergy.allergen,
              type: allergy.type,
              severity: allergy.severity,
              reaction: allergy.reaction,
            })),
          });
        }

        if (input.preferences) {
          await tx.patientPreference.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              patientId,
              language: input.preferences.language ?? 'en-US',
              maritalStatus: input.preferences.maritalStatus,
              occupation: input.preferences.occupation,
              nationality: input.preferences.nationality,
              smoking: input.preferences.smoking,
              communication: input.preferences.communication as
                Prisma.InputJsonValue | undefined,
            },
          });
        }

        return mapPatient(patient);
      });
    } catch (error) {
      mapPatientRepositoryError(error);
    }
  }

  async updatePatient(
    patientId: string,
    input: UpdatePatientInput,
  ): Promise<Patient> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patient.findFirst({
          where: { id: patientId, tenantId: this.tenantId, deletedAt: null },
        });
        assertPatientFound(existing, patientId);

        if (input.version !== undefined && input.version !== existing.version) {
          throw new ConflictError('Patient version conflict', {
            details: {
              patientId,
              expectedVersion: input.version,
              actualVersion: existing.version,
            },
          });
        }

        const patient = await tx.patient.update({
          where: { id: patientId },
          data: {
            mrn: input.mrn,
            fullName: input.fullName,
            dateOfBirth: input.dateOfBirth
              ? new Date(input.dateOfBirth)
              : undefined,
            gender: input.gender,
            status: input.status,
            facilityId: input.facilityId,
            userId: input.userId,
            primaryProviderId: input.primaryProviderId,
            updatedBy: input.updatedBy,
            version: { increment: 1 },
          },
        });

        return mapPatient(patient);
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      mapPatientRepositoryError(error);
    }
  }

  async archivePatient(patientId: string, updatedBy: string): Promise<Patient> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patient.findFirst({
          where: { id: patientId, tenantId: this.tenantId, deletedAt: null },
        });
        assertPatientFound(existing, patientId);

        const patient = await tx.patient.update({
          where: { id: patientId },
          data: {
            ...softDeleteData(),
            status: 'inactive',
            updatedBy,
            version: { increment: 1 },
          },
        });

        return mapPatient(patient);
      });
    } catch (error) {
      mapPatientRepositoryError(error);
    }
  }

  async restorePatient(patientId: string, updatedBy: string): Promise<Patient> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patient.findFirst({
          where: {
            id: patientId,
            tenantId: this.tenantId,
            deletedAt: { not: null },
          },
        });
        assertPatientFound(existing, patientId);

        const patient = await tx.patient.update({
          where: { id: patientId },
          data: {
            ...restoreSoftDeleteData(),
            status: 'active',
            updatedBy,
            version: { increment: 1 },
          },
        });

        return mapPatient(patient);
      });
    } catch (error) {
      mapPatientRepositoryError(error);
    }
  }

  async getIdentifiers(patientId: string): Promise<PatientIdentifier[]> {
    await this.getPatient(patientId);

    return this.prisma.runInTransaction(async (tx) => {
      const identifiers = await tx.patientIdentifier.findMany({
        where: { patientId, tenantId: this.tenantId },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
      });
      return identifiers.map(mapPatientIdentifier);
    });
  }

  async getContacts(patientId: string): Promise<PatientContact[]> {
    await this.getPatient(patientId);

    return this.prisma.runInTransaction(async (tx) => {
      const contacts = await tx.patientContact.findMany({
        where: { patientId, tenantId: this.tenantId },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
      });
      return contacts.map(mapPatientContact);
    });
  }

  async getAddresses(patientId: string): Promise<PatientAddress[]> {
    await this.getPatient(patientId);

    return this.prisma.runInTransaction(async (tx) => {
      const addresses = await tx.patientAddress.findMany({
        where: { patientId, tenantId: this.tenantId },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
      });
      return addresses.map(mapPatientAddress);
    });
  }

  async getEmergencyContacts(
    patientId: string,
  ): Promise<PatientEmergencyContact[]> {
    await this.getPatient(patientId);

    return this.prisma.runInTransaction(async (tx) => {
      const contacts = await tx.patientEmergencyContact.findMany({
        where: { patientId, tenantId: this.tenantId },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
      });
      return contacts.map(mapPatientEmergencyContact);
    });
  }

  async getAllergies(patientId: string): Promise<PatientAllergy[]> {
    await this.getPatient(patientId);

    return this.prisma.runInTransaction(async (tx) => {
      const allergies = await tx.patientAllergy.findMany({
        where: { patientId, tenantId: this.tenantId },
        orderBy: [{ notedAt: 'desc' }],
      });
      return allergies.map(mapPatientAllergy);
    });
  }

  async getPreferences(patientId: string): Promise<PatientPreference | null> {
    await this.getPatient(patientId);

    return this.prisma.runInTransaction(async (tx) => {
      const preferences = await tx.patientPreference.findFirst({
        where: { patientId, tenantId: this.tenantId },
      });
      return preferences ? mapPatientPreference(preferences) : null;
    });
  }

  /** Persistence lookup — active patients only. */
  async findByMrn(
    mrn: string,
    excludePatientId?: string,
  ): Promise<Patient | null> {
    return this.prisma.runInTransaction(async (tx) => {
      const patient = await tx.patient.findFirst({
        where: {
          tenantId: this.tenantId,
          mrn: { equals: mrn, mode: 'insensitive' },
          deletedAt: null,
          ...(excludePatientId ? { NOT: { id: excludePatientId } } : {}),
        },
      });
      return patient ? mapPatient(patient) : null;
    });
  }

  /** Persistence lookup — active patients only. */
  async findByIdentifier(
    type: PatientIdentifierType,
    value: string,
    excludePatientId?: string,
  ): Promise<Patient | null> {
    return this.prisma.runInTransaction(async (tx) => {
      const identifier = await tx.patientIdentifier.findFirst({
        where: {
          tenantId: this.tenantId,
          type,
          value: { equals: value, mode: 'insensitive' },
          patient: {
            deletedAt: null,
            ...(excludePatientId ? { NOT: { id: excludePatientId } } : {}),
          },
        },
        include: { patient: true },
      });
      return identifier?.patient ? mapPatient(identifier.patient) : null;
    });
  }

  async addAllergy(
    patientId: string,
    input: CreatePatientAllergyInput,
  ): Promise<PatientAllergy> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const patient = await tx.patient.findFirst({
          where: { id: patientId, tenantId: this.tenantId, deletedAt: null },
        });
        assertPatientFound(patient, patientId);

        const allergy = await tx.patientAllergy.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            patientId,
            allergen: input.allergen,
            type: input.type,
            severity: input.severity,
            reaction: input.reaction,
          },
        });

        return mapPatientAllergy(allergy);
      });
    } catch (error) {
      mapPatientRepositoryError(error);
    }
  }

  async upsertPreferences(
    patientId: string,
    input: CreatePatientPreferenceInput,
  ): Promise<PatientPreference> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const patient = await tx.patient.findFirst({
          where: { id: patientId, tenantId: this.tenantId, deletedAt: null },
        });
        assertPatientFound(patient, patientId);

        const preference = await tx.patientPreference.upsert({
          where: { patientId },
          create: {
            id: newId(),
            tenantId: this.tenantId,
            patientId,
            language: input.language ?? 'en-US',
            maritalStatus: input.maritalStatus,
            occupation: input.occupation,
            nationality: input.nationality,
            smoking: input.smoking,
            communication: input.communication as
              Prisma.InputJsonValue | undefined,
          },
          update: {
            language: input.language,
            maritalStatus: input.maritalStatus,
            occupation: input.occupation,
            nationality: input.nationality,
            smoking: input.smoking,
            communication: input.communication as
              Prisma.InputJsonValue | undefined,
          },
        });

        return mapPatientPreference(preference);
      });
    } catch (error) {
      mapPatientRepositoryError(error);
    }
  }

  exportPatients(input: ExportPatientsInput) {
    const where = buildPatientExportWhere(this.tenantId, input.filters);

    return this.prisma.runInTransaction(async (tx) => {
      const recordCount = await tx.patient.count({ where });
      return buildExportResult(input.format, recordCount);
    });
  }
}
