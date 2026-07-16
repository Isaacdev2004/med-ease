import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Prisma } from '@medease/prisma';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@workspace/repository-transport/errors';

import {
  assertPatientFound,
  assertValidPagination,
  mapPatientRepositoryError,
  toContractPaginated,
} from './patients.helpers';
import {
  mapPatient,
  mapPatientAllergy,
  mapPatientIdentifier,
  mapPatientStatus,
} from './mappers/patient.mapper';
import {
  buildPatientExportWhere,
  buildPatientListWhere,
  buildPatientSearchWhere,
} from './queries/patient.queries';
import { toPaginatedResult } from '@medease/prisma';

const TENANT_ID = '01930000-0000-7000-8000-000000000001';

describe('patients.helpers', () => {
  it('assertPatientFound throws NotFoundError when patient is missing', () => {
    assert.throws(
      () => assertPatientFound(null, 'patient-1'),
      (error: unknown) =>
        error instanceof NotFoundError && (error as NotFoundError).name === 'NotFoundError',
    );
  });

  it('mapPatientRepositoryError maps unique constraint to ConflictError', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '6.19.3',
    });

    assert.throws(
      () => mapPatientRepositoryError(prismaError),
      (error: unknown) => error instanceof ConflictError,
    );
  });

  it('mapPatientRepositoryError maps P2025 to NotFoundError', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '6.19.3',
    });

    assert.throws(
      () => mapPatientRepositoryError(prismaError),
      (error: unknown) => error instanceof NotFoundError,
    );
  });

  it('assertValidPagination rejects invalid page values', () => {
    assert.throws(
      () => assertValidPagination(0, 25),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it('toContractPaginated strips totalPages', () => {
    const result = toContractPaginated(
      toPaginatedResult([{ patientId: '1' }], 1, 1, 25),
    );
    assert.deepEqual(result, {
      items: [{ patientId: '1' }],
      total: 1,
      page: 1,
      pageSize: 25,
    });
    assert.equal('totalPages' in result, false);
  });
});

describe('patient.mapper', () => {
  it('mapPatient maps prisma fields to contract shape', () => {
    const mapped = mapPatient({
      id: '01930000-0000-7000-8000-000000000301',
      tenantId: TENANT_ID,
      facilityId: null,
      userId: '01930000-0000-7000-8000-000000000106',
      mrn: 'MRN-10293',
      fullName: 'Sarah Jenkins',
      dateOfBirth: new Date('1985-03-14'),
      gender: 'female',
      status: 'active',
      primaryProviderId: null,
      fhirResourceId: '01930000-0000-7000-8000-000000000301',
      createdBy: '01930000-0000-7000-8000-000000000101',
      updatedBy: null,
      createdAt: new Date('2026-07-01T10:00:00.000Z'),
      updatedAt: new Date('2026-07-16T10:00:00.000Z'),
      deletedAt: null,
      version: 1,
    });

    assert.equal(mapped.patientId, '01930000-0000-7000-8000-000000000301');
    assert.equal(mapped.dateOfBirth, '1985-03-14');
    assert.equal(mapped.gender, 'female');
    assert.equal(mapped.version, 1);
  });

  it('mapPatientStatus defaults unknown values to active', () => {
    assert.equal(mapPatientStatus('active'), 'active');
    assert.equal(mapPatientStatus('unknown-status'), 'active');
  });

  it('mapPatientIdentifier maps identifier fields', () => {
    const mapped = mapPatientIdentifier({
      id: '01930000-0000-7000-8000-000000003011',
      tenantId: TENANT_ID,
      patientId: '01930000-0000-7000-8000-000000000301',
      type: 'mrn',
      value: 'MRN-10293',
      system: null,
      isPrimary: true,
      createdAt: new Date('2026-07-01T10:00:00.000Z'),
      updatedAt: new Date('2026-07-16T10:00:00.000Z'),
    });

    assert.equal(mapped.identifierId, '01930000-0000-7000-8000-000000003011');
    assert.equal(mapped.type, 'mrn');
    assert.equal(mapped.isPrimary, true);
  });

  it('mapPatientAllergy maps allergy fields', () => {
    const mapped = mapPatientAllergy({
      id: '01930000-0000-7000-8000-000000000401',
      tenantId: TENANT_ID,
      patientId: '01930000-0000-7000-8000-000000000301',
      allergen: 'Penicillin',
      type: 'drug',
      severity: 'severe',
      reaction: 'Anaphylaxis',
      notedAt: new Date('2026-07-01T10:00:00.000Z'),
      createdAt: new Date('2026-07-01T10:00:00.000Z'),
      updatedAt: new Date('2026-07-16T10:00:00.000Z'),
    });

    assert.equal(mapped.allergen, 'Penicillin');
    assert.equal(mapped.severity, 'severe');
  });
});

describe('patient.queries', () => {
  it('buildPatientListWhere scopes by tenant and excludes archived by default', () => {
    const where = buildPatientListWhere(TENANT_ID, { status: 'active' });
    assert.equal(where.tenantId, TENANT_ID);
    assert.equal(where.deletedAt, null);
    assert.equal(where.status, 'active');
  });

  it('buildPatientListWhere includes archived when requested', () => {
    const where = buildPatientListWhere(TENANT_ID, { includeArchived: true });
    assert.equal(where.deletedAt, undefined);
  });

  it('buildPatientSearchWhere adds text search OR clauses', () => {
    const where = buildPatientSearchWhere(TENANT_ID, { q: 'Sarah' });
    assert.ok(Array.isArray(where.OR));
    assert.ok(where.OR!.length >= 3);
  });

  it('buildPatientExportWhere excludes archived patients', () => {
    const where = buildPatientExportWhere(TENANT_ID, { facilityId: 'facility-1' });
    assert.equal(where.tenantId, TENANT_ID);
    assert.equal(where.deletedAt, null);
    assert.equal(where.facilityId, 'facility-1');
  });
});

describe('PatientsRepository', () => {
  it('searchPatients rejects empty query via ValidationError', async () => {
    const { PatientsRepository } = await import('./patients.repository');

    const repository = new PatientsRepository({
      runInTransaction: async () => {
        throw new Error('should not run transaction');
      },
    } as never);

    Object.defineProperty(repository, 'tenantId', {
      get: () => TENANT_ID,
    });

    try {
      await repository.searchPatients({ q: '   ' });
      assert.fail('Expected ValidationError');
    } catch (error) {
      assert.equal((error as Error).name, 'ValidationError');
      assert.match((error as Error).message, /Search query is required/);
    }
  });
});
