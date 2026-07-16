import { Injectable } from '@nestjs/common';

import { DomainEventBus, PatientEvents, UserEvents } from '@medease/events';
import type {
  CreatePatientAllergyInput,
  CreatePatientPreferenceInput,
  ExportPatientsInput,
  PatientFilters,
  PatientSearchFilters,
  UpdatePatientInput,
} from '@medease/patients-contract';
import { ConflictError } from '@workspace/repository-transport/errors';

import { RequestContextService } from '../tenant/request-context.service';
import { PatientsRepository } from './patients.repository';
import {
  assertNotAlreadyArchived,
  assertPatientIsArchived,
  type RegisterPatientInput,
  type ValidatePatientMergeInput,
  validateAllergyInput,
  validateDuplicateIdentifiersInInput,
  validateMergeCandidates,
  validatePreferenceInput,
  validateRegistrationFields,
  validateUpdateFields,
} from './patients.service.validation';

@Injectable()
export class PatientsService {
  constructor(
    private readonly repository: PatientsRepository,
    private readonly requestContext: RequestContextService,
    private readonly eventBus: DomainEventBus,
  ) {}

  private actorId(): string {
    return this.requestContext.require().userId ?? '00000000-0000-0000-0000-000000000000';
  }

  private eventContext(patient: { tenantId: string; facilityId?: string }) {
    return {
      tenantId: patient.tenantId,
      facilityId: patient.facilityId,
      userId: this.actorId(),
    };
  }

  listPatients(filters?: PatientFilters) {
    return this.repository.listPatients(filters);
  }

  searchPatients(filters: PatientSearchFilters) {
    return this.repository.searchPatients(filters);
  }

  async getPatient(patientId: string, options?: { trackView?: boolean }) {
    const patient = await this.repository.getPatient(patientId);

    if (options?.trackView !== false) {
      await this.eventBus.publish(
        PatientEvents.patientViewed(
          {
            patientId: patient.patientId,
            resourceType: 'patient',
            resourceId: patient.patientId,
            tenantId: patient.tenantId,
            facilityId: patient.facilityId,
          },
          this.eventContext(patient),
        ),
      );
    }

    return patient;
  }

  async registerPatient(input: RegisterPatientInput) {
    validateRegistrationFields(input);
    validateDuplicateIdentifiersInInput(input.identifiers);

    const duplicateMrn = await this.repository.findByMrn(input.mrn.trim());
    if (duplicateMrn) {
      throw new ConflictError('Patient with this MRN already exists', {
        details: { mrn: input.mrn, patientId: duplicateMrn.patientId },
      });
    }

    for (const identifier of input.identifiers ?? []) {
      if (!identifier.isPrimary) {
        continue;
      }

      const duplicateIdentifier = await this.repository.findByIdentifier(
        identifier.type,
        identifier.value.trim(),
      );
      if (duplicateIdentifier) {
        throw new ConflictError('Primary identifier already assigned to another patient', {
          details: {
            type: identifier.type,
            value: identifier.value,
            patientId: duplicateIdentifier.patientId,
          },
        });
      }
    }

    const patient = await this.repository.createPatient({
      ...input,
      mrn: input.mrn.trim(),
      fullName: input.fullName.trim(),
      createdBy: this.actorId(),
    });

    await this.eventBus.publish(
      PatientEvents.patientRegistered(
        {
          patientId: patient.patientId,
          tenantId: patient.tenantId,
          facilityId: patient.facilityId,
          metadata: { mrn: patient.mrn },
        },
        this.eventContext(patient),
      ),
    );

    if (input.allergies?.length) {
      for (const allergy of input.allergies) {
        await this.eventBus.publish(
          PatientEvents.patientAllergyAdded(
            {
              patientId: patient.patientId,
              tenantId: patient.tenantId,
              facilityId: patient.facilityId,
              metadata: { allergen: allergy.allergen, type: allergy.type },
            },
            this.eventContext(patient),
          ),
        );
      }
    }

    if (input.preferences) {
      await this.eventBus.publish(
        PatientEvents.patientPreferenceUpdated(
          {
            patientId: patient.patientId,
            tenantId: patient.tenantId,
            facilityId: patient.facilityId,
          },
          this.eventContext(patient),
        ),
      );
    }

    return patient;
  }

  async updatePatient(patientId: string, input: Omit<UpdatePatientInput, 'updatedBy'>) {
    validateUpdateFields({ ...input, updatedBy: this.actorId() });

    const existing = await this.repository.getPatient(patientId);
    assertNotAlreadyArchived(existing);

    if (input.mrn && input.mrn.trim().toLowerCase() !== existing.mrn.toLowerCase()) {
      const duplicateMrn = await this.repository.findByMrn(input.mrn.trim(), patientId);
      if (duplicateMrn) {
        throw new ConflictError('Patient with this MRN already exists', {
          details: { mrn: input.mrn, patientId: duplicateMrn.patientId },
        });
      }
    }

    const patient = await this.repository.updatePatient(patientId, {
      ...input,
      mrn: input.mrn?.trim(),
      fullName: input.fullName?.trim(),
      updatedBy: this.actorId(),
    });

    await this.eventBus.publish(
      PatientEvents.patientUpdated(
        {
          patientId: patient.patientId,
          tenantId: patient.tenantId,
          facilityId: patient.facilityId,
          metadata: { version: patient.version },
        },
        this.eventContext(patient),
      ),
    );

    return patient;
  }

  async archivePatient(patientId: string) {
    const existing = await this.repository.getPatient(patientId);
    assertNotAlreadyArchived(existing);

    const patient = await this.repository.archivePatient(patientId, this.actorId());

    await this.eventBus.publish(
      PatientEvents.patientArchived(
        {
          patientId: patient.patientId,
          tenantId: patient.tenantId,
          facilityId: patient.facilityId,
        },
        this.eventContext(patient),
      ),
    );

    return patient;
  }

  async restorePatient(patientId: string) {
    const existing = await this.repository.getPatient(patientId);
    assertPatientIsArchived(existing);

    const patient = await this.repository.restorePatient(patientId, this.actorId());

    await this.eventBus.publish(
      PatientEvents.patientRestored(
        {
          patientId: patient.patientId,
          tenantId: patient.tenantId,
          facilityId: patient.facilityId,
        },
        this.eventContext(patient),
      ),
    );

    return patient;
  }

  async validateMerge(input: ValidatePatientMergeInput) {
    const [sourcePatient, targetPatient] = await Promise.all([
      this.repository.getPatient(input.sourcePatientId),
      this.repository.getPatient(input.targetPatientId),
    ]);

    return validateMergeCandidates(sourcePatient, targetPatient, input);
  }

  async addAllergy(patientId: string, input: CreatePatientAllergyInput) {
    validateAllergyInput(input);

    const existing = await this.repository.getPatient(patientId);
    assertNotAlreadyArchived(existing);

    const allergy = await this.repository.addAllergy(patientId, input);

    await this.eventBus.publish(
      PatientEvents.patientAllergyAdded(
        {
          patientId: existing.patientId,
          tenantId: existing.tenantId,
          facilityId: existing.facilityId,
          metadata: { allergyId: allergy.allergyId, allergen: allergy.allergen },
        },
        this.eventContext(existing),
      ),
    );

    return allergy;
  }

  async updatePreferences(patientId: string, input: CreatePatientPreferenceInput) {
    validatePreferenceInput(input);

    const existing = await this.repository.getPatient(patientId);
    assertNotAlreadyArchived(existing);

    const preferences = await this.repository.upsertPreferences(patientId, input);

    await this.eventBus.publish(
      PatientEvents.patientPreferenceUpdated(
        {
          patientId: existing.patientId,
          tenantId: existing.tenantId,
          facilityId: existing.facilityId,
          metadata: input as Record<string, unknown>,
        },
        this.eventContext(existing),
      ),
    );

    return preferences;
  }

  getIdentifiers(patientId: string) {
    return this.repository.getIdentifiers(patientId);
  }

  getContacts(patientId: string) {
    return this.repository.getContacts(patientId);
  }

  getAddresses(patientId: string) {
    return this.repository.getAddresses(patientId);
  }

  getEmergencyContacts(patientId: string) {
    return this.repository.getEmergencyContacts(patientId);
  }

  getAllergies(patientId: string) {
    return this.repository.getAllergies(patientId);
  }

  getPreferences(patientId: string) {
    return this.repository.getPreferences(patientId);
  }

  async exportPatients(input: ExportPatientsInput) {
    const result = await this.repository.exportPatients(input);

    await this.eventBus.publish(
      UserEvents.dataExported({
        resourceType: 'patient',
        tenantId: this.requestContext.requireTenantId(),
        metadata: { format: result.format, recordCount: result.recordCount },
      }),
    );

    return result;
  }
}
