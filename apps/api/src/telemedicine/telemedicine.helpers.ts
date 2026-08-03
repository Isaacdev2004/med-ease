import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertSessionFound<T>(
  session: T | null | undefined,
  sessionId?: string,
): asserts session is T {
  if (!session) {
    throw new NotFoundError('Telemedicine session not found', {
      details: sessionId ? { sessionId } : undefined,
    });
  }
}

export function assertWaitingEntryFound<T>(
  entry: T | null | undefined,
  entryId?: string,
): asserts entry is T {
  if (!entry) {
    throw new NotFoundError('Waiting room entry not found', {
      details: entryId ? { entryId } : undefined,
    });
  }
}

export function mapTelemedicineRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Telemedicine resource not found', {
      cause: error,
    });
  }
  throw error;
}
