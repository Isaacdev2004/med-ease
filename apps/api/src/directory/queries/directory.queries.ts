import type { DirectoryFilters } from '@medease/directory-contract';
import type { Prisma } from '@medease/prisma';

export function buildDirectoryListWhere(
  tenantId: string,
  filters: DirectoryFilters = {},
  favoriteProviderIds?: string[],
): Prisma.DirectoryProviderWhereInput {
  const where: Prisma.DirectoryProviderWhereInput = {
    tenantId,
    active: true,
  };

  if (filters.type && filters.type !== 'all') {
    where.type = filters.type;
  }

  const and: Prisma.DirectoryProviderWhereInput[] = [];

  if (filters.specialty) {
    and.push({
      OR: [
        { specialty: filters.specialty },
        { medicalSpecialty: filters.specialty },
      ],
    });
  }

  if (filters.department) {
    where.department = filters.department;
  }

  if (filters.city) {
    where.city = { equals: filters.city, mode: 'insensitive' };
  }

  if (filters.postalCode) {
    where.postalCode = { startsWith: filters.postalCode };
  }

  if (filters.teleconsultation) {
    where.teleconsultation = true;
  }

  if (filters.emergency) {
    where.emergencyServices = true;
  }

  if (typeof filters.distanceMax === 'number') {
    where.distanceKm = { lte: filters.distanceMax };
  }

  if (filters.openNow) {
    where.availability = { in: ['Open now', '24/7 dispatch'] };
  }

  if (filters.favoritesOnly) {
    where.id = { in: favoriteProviderIds ?? [] };
  }

  if (filters.q) {
    and.push({
      OR: [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { specialty: { contains: filters.q, mode: 'insensitive' } },
        { city: { contains: filters.q, mode: 'insensitive' } },
        { finessNumber: { contains: filters.q, mode: 'insensitive' } },
      ],
    });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

export function buildDirectoryOrderBy(
  sort?: DirectoryFilters['sort'],
): Prisma.DirectoryProviderOrderByWithRelationInput[] {
  switch (sort) {
    case 'distance':
      return [{ distanceKm: 'asc' }, { name: 'asc' }];
    case 'alphabetical':
      return [{ name: 'asc' }];
    case 'availability':
      return [{ availability: 'asc' }, { name: 'asc' }];
    case 'updated':
      return [{ updatedAt: 'desc' }];
    case 'relevance':
    default:
      return [{ name: 'asc' }];
  }
}
