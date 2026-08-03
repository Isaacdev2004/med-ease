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

export function mapMedicalLibraryRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Medical library resource not found', {
      cause: error,
    });
  }
  throw error;
}

export const POPULAR_MEDICATIONS = [
  'Paracetamol',
  'Metformin',
  'Atorvastatin',
  'Amoxicillin',
  'Ibuprofen',
  'Omeprazole',
] as const;
