import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertProviderFound<T>(
  provider: T | null | undefined,
  providerId?: string,
): asserts provider is T {
  if (!provider) {
    throw new NotFoundError('Directory provider not found', {
      details: providerId ? { providerId } : undefined,
    });
  }
}

export function mapDirectoryRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Directory resource not found', { cause: error });
  }
  throw error;
}

export const POPULAR_SEARCHES = [
  'Médecine générale',
  'Cardiologie',
  'Pharmacie',
  'Urgences',
  'Dentiste',
  'Pédiatrie',
] as const;

export function mapOpeningHours(
  value: unknown,
): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'string') {
      result[key] = entry;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}
