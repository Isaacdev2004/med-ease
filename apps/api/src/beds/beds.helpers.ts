import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertBedFound<T>(
  bed: T | null | undefined,
  bedId?: string,
): asserts bed is T {
  if (!bed) {
    throw new NotFoundError('Bed not found', {
      details: bedId ? { bedId } : undefined,
    });
  }
}

export function mapBedRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Bed resource not found', { cause: error });
  }
  throw error;
}
