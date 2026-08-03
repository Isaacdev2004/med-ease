import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertStudyFound<T>(
  study: T | null | undefined,
  studyId?: string,
): asserts study is T {
  if (!study) {
    throw new NotFoundError('Radiology study not found', {
      details: studyId ? { studyId } : undefined,
    });
  }
}

export function assertOrderFound<T>(
  order: T | null | undefined,
  orderId?: string,
): asserts order is T {
  if (!order) {
    throw new NotFoundError('Radiology order not found', {
      details: orderId ? { orderId } : undefined,
    });
  }
}

export function assertReportFound<T>(
  report: T | null | undefined,
  reportId?: string,
): asserts report is T {
  if (!report) {
    throw new NotFoundError('Radiology report not found', {
      details: reportId ? { reportId } : undefined,
    });
  }
}

export function mapRadiologyRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Radiology resource not found', { cause: error });
  }
  throw error;
}
