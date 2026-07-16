import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@workspace/repository-transport/errors';

import {
  buildExportResult,
  isPrismaNotFoundError,
  isPrismaUniqueConstraintError,
  toContractPaginated,
} from '@medease/prisma';

export { buildExportResult, toContractPaginated };

export function assertPatientFound<T>(
  patient: T | null | undefined,
  patientId?: string,
): asserts patient is T {
  if (!patient) {
    throw new NotFoundError('Patient not found', {
      details: patientId ? { patientId } : undefined,
    });
  }
}

export function mapPatientRepositoryError(error: unknown): never {
  if (isPrismaUniqueConstraintError(error)) {
    throw new ConflictError('Patient record conflict', { cause: error });
  }

  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Patient not found', { cause: error });
  }

  throw error;
}

export function assertValidPagination(page: number, pageSize: number): void {
  if (!Number.isFinite(page) || page < 1 || !Number.isFinite(pageSize) || pageSize < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }
}
