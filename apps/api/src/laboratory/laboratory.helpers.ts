import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertLabOrderFound<T>(
  order: T | null | undefined,
  orderId?: string,
): asserts order is T {
  if (!order) {
    throw new NotFoundError('Lab order not found', {
      details: orderId ? { orderId } : undefined,
    });
  }
}

export function assertLabReportFound<T>(
  report: T | null | undefined,
  reportId?: string,
): asserts report is T {
  if (!report) {
    throw new NotFoundError('Lab report not found', {
      details: reportId ? { reportId } : undefined,
    });
  }
}

export function mapLaboratoryRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Laboratory resource not found', { cause: error });
  }
  throw error;
}
