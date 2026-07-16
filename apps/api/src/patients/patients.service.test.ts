import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import { PatientEventType } from '@medease/events';
import type { Patient, PatientAllergy } from '@medease/patients-contract';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@workspace/repository-transport/errors';

import { PatientsRepository } from './patients.repository';
import { PatientsService } from './patients.service';
import {
  validateMergeCandidates,
  validateRegistrationFields,
} from './patients.service.validation';

const TENANT_ID = '01930000-0000-7000-8000-000000000001';
const ACTOR_ID = '01930000-0000-7000-8000-000000000101';
const PATIENT_ID = '01930000-0000-7000-8000-000000000301';

function samplePatient(overrides: Partial<Patient> = {}): Patient {
  return {
    patientId: PATIENT_ID,
    tenantId: TENANT_ID,
    mrn: 'MRN-10293',
    fullName: 'Sarah Jenkins',
    dateOfBirth: '1985-03-14',
    gender: 'female',
    status: 'active',
    fhirResourceId: PATIENT_ID,
    createdBy: ACTOR_ID,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-16T10:00:00.000Z',
    version: 1,
    ...overrides,
  };
}

function createService(repository: Partial<PatientsRepository>) {
  const published: string[] = [];

  const eventBus = {
    publish: mock.fn(async (event: { type: string }) => {
      published.push(event.type);
    }),
    publishMany: mock.fn(async () => undefined),
  };

  const requestContext = {
    requireTenantId: () => TENANT_ID,
    require: () => ({
      tenantId: TENANT_ID,
      userId: ACTOR_ID,
      roles: [],
      permissions: [],
    }),
  };

  const service = new PatientsService(
    repository as PatientsRepository,
    requestContext as never,
    eventBus as never,
  );

  return { service, published, eventBus };
}

describe('patients.service.validation', () => {
  it('validateRegistrationFields rejects missing MRN', () => {
    assert.throws(
      () => validateRegistrationFields({ mrn: ' ', fullName: 'Jane', dateOfBirth: '1990-01-01' }),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it('validateMergeCandidates rejects self-merge', () => {
    const patient = samplePatient();
    assert.throws(
      () =>
        validateMergeCandidates(patient, patient, {
          sourcePatientId: PATIENT_ID,
          targetPatientId: PATIENT_ID,
        }),
      (error: unknown) => error instanceof ValidationError,
    );
  });
});

describe('PatientsService', () => {
  it('registerPatient creates patient and publishes PatientRegistered', async () => {
    const created = samplePatient();
    const { service, published } = createService({
      findByMrn: async () => null,
      createPatient: async () => created,
    });

    const result = await service.registerPatient({
      mrn: 'MRN-90001',
      fullName: 'Jane Doe',
      dateOfBirth: '1990-05-01',
    });

    assert.equal(result.patientId, PATIENT_ID);
    assert.ok(published.includes(PatientEventType.PatientRegistered));
  });

  it('registerPatient rejects duplicate MRN', async () => {
    const { service } = createService({
      findByMrn: async () => samplePatient(),
    });

    await assert.rejects(
      () =>
        service.registerPatient({
          mrn: 'MRN-10293',
          fullName: 'Jane Doe',
          dateOfBirth: '1990-05-01',
        }),
      (error: unknown) => error instanceof ConflictError,
    );
  });

  it('registerPatient rejects duplicate primary identifier', async () => {
    const { service } = createService({
      findByMrn: async () => null,
      findByIdentifier: async () => samplePatient(),
    });

    await assert.rejects(
      () =>
        service.registerPatient({
          mrn: 'MRN-90002',
          fullName: 'Jane Doe',
          dateOfBirth: '1990-05-01',
          identifiers: [{ type: 'national_id', value: 'US-123', isPrimary: true }],
        }),
      (error: unknown) => error instanceof ConflictError,
    );
  });

  it('registerPatient publishes allergy and preference events when provided', async () => {
    const created = samplePatient();
    const { service, published } = createService({
      findByMrn: async () => null,
      createPatient: async () => created,
    });

    await service.registerPatient({
      mrn: 'MRN-90003',
      fullName: 'Jane Doe',
      dateOfBirth: '1990-05-01',
      allergies: [{ allergen: 'Penicillin', type: 'drug', severity: 'severe' }],
      preferences: { language: 'en-US' },
    });

    assert.ok(published.includes(PatientEventType.PatientRegistered));
    assert.ok(published.includes(PatientEventType.PatientAllergyAdded));
    assert.ok(published.includes(PatientEventType.PatientPreferenceUpdated));
  });

  it('archivePatient rejects already archived patients', async () => {
    const { service } = createService({
      getPatient: async () => samplePatient({ deletedAt: '2026-07-10T00:00:00.000Z', status: 'inactive' }),
    });

    await assert.rejects(
      () => service.archivePatient(PATIENT_ID),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it('restorePatient rejects active patients', async () => {
    const { service } = createService({
      getPatient: async () => samplePatient(),
    });

    await assert.rejects(
      () => service.restorePatient(PATIENT_ID),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it('archivePatient publishes PatientArchived after successful archive', async () => {
    const archived = samplePatient({ deletedAt: '2026-07-16T12:00:00.000Z', status: 'inactive' });
    const { service, published } = createService({
      getPatient: async () => samplePatient(),
      archivePatient: async () => archived,
    });

    await service.archivePatient(PATIENT_ID);
    assert.ok(published.includes(PatientEventType.PatientArchived));
  });

  it('restorePatient publishes PatientRestored after successful restore', async () => {
    const restored = samplePatient();
    const { service, published } = createService({
      getPatient: async () =>
        samplePatient({ deletedAt: '2026-07-10T00:00:00.000Z', status: 'inactive' }),
      restorePatient: async () => restored,
    });

    await service.restorePatient(PATIENT_ID);
    assert.ok(published.includes(PatientEventType.PatientRestored));
  });

  it('validateMerge rejects archived source patient', async () => {
    const archived = samplePatient({
      patientId: '01930000-0000-7000-8000-000000000302',
      deletedAt: '2026-07-10T00:00:00.000Z',
    });
    const { service } = createService({
      getPatient: async (id: string) =>
        id === archived.patientId ? archived : samplePatient(),
    });

    await assert.rejects(
      () =>
        service.validateMerge({
          sourcePatientId: archived.patientId,
          targetPatientId: PATIENT_ID,
        }),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it('validateMerge returns candidates when valid', async () => {
    const source = samplePatient({ patientId: '01930000-0000-7000-8000-000000000302' });
    const target = samplePatient();
    const { service } = createService({
      getPatient: async (id: string) => (id === source.patientId ? source : target),
    });

    const result = await service.validateMerge({
      sourcePatientId: source.patientId,
      targetPatientId: target.patientId,
    });

    assert.equal(result.valid, true);
    assert.equal(result.sourcePatient.patientId, source.patientId);
    assert.equal(result.targetPatient.patientId, target.patientId);
  });

  it('addAllergy publishes PatientAllergyAdded', async () => {
    const allergy: PatientAllergy = {
      allergyId: '01930000-0000-7000-8000-000000000401',
      tenantId: TENANT_ID,
      patientId: PATIENT_ID,
      allergen: 'Penicillin',
      type: 'drug',
      severity: 'severe',
      notedAt: '2026-07-16T10:00:00.000Z',
      createdAt: '2026-07-16T10:00:00.000Z',
      updatedAt: '2026-07-16T10:00:00.000Z',
    };

    const { service, published } = createService({
      getPatient: async () => samplePatient(),
      addAllergy: async () => allergy,
    });

    await service.addAllergy(PATIENT_ID, {
      allergen: 'Penicillin',
      type: 'drug',
      severity: 'severe',
    });

    assert.ok(published.includes(PatientEventType.PatientAllergyAdded));
  });

  it('propagates repository NotFoundError', async () => {
    const { service } = createService({
      getPatient: async () => {
        throw new NotFoundError('Patient not found');
      },
    });

    await assert.rejects(
      () => service.getPatient(PATIENT_ID, { trackView: false }),
      (error: unknown) => error instanceof NotFoundError,
    );
  });

  it('updatePatient publishes PatientUpdated', async () => {
    const updated = samplePatient({ fullName: 'Sarah J.', version: 2 });
    const { service, published } = createService({
      getPatient: async () => samplePatient(),
      findByMrn: async () => null,
      updatePatient: async () => updated,
    });

    await service.updatePatient(PATIENT_ID, { fullName: 'Sarah J.' });
    assert.ok(published.includes(PatientEventType.PatientUpdated));
  });
});
