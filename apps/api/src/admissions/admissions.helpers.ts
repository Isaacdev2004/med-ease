import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertAdmissionFound<T>(
  admission: T | null | undefined,
  admissionId?: string,
): asserts admission is T {
  if (!admission) {
    throw new NotFoundError('Admission not found', {
      details: admissionId ? { admissionId } : undefined,
    });
  }
}

export function assertTransferFound<T>(
  transfer: T | null | undefined,
  transferId?: string,
): asserts transfer is T {
  if (!transfer) {
    throw new NotFoundError('Transfer not found', {
      details: transferId ? { transferId } : undefined,
    });
  }
}

export function mapAdmissionRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Admission resource not found', { cause: error });
  }
  throw error;
}
