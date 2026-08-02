import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertMedicationFound<T>(
  medication: T | null | undefined,
  medicationId?: string,
): asserts medication is T {
  if (!medication) {
    throw new NotFoundError('Medication not found', {
      details: medicationId ? { medicationId } : undefined,
    });
  }
}

export function assertPrescriptionFound<T>(
  prescription: T | null | undefined,
  prescriptionId?: string,
): asserts prescription is T {
  if (!prescription) {
    throw new NotFoundError('Prescription not found', {
      details: prescriptionId ? { prescriptionId } : undefined,
    });
  }
}

export function assertRefillFound<T>(
  refill: T | null | undefined,
  refillId?: string,
): asserts refill is T {
  if (!refill) {
    throw new NotFoundError('Refill request not found', {
      details: refillId ? { refillId } : undefined,
    });
  }
}

export function mapMedicationRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Medication resource not found', { cause: error });
  }

  throw error;
}

export function toDateOnlyIso(value: Date): string {
  return value.toISOString().slice(0, 10);
}
