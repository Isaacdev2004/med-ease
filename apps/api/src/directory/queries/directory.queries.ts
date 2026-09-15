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
    if (filters.type === 'facility') {
      where.type = { in: ['facility', 'nursing_home', 'medical_center'] };
    } else {
      where.type = filters.type;
    }
  }

  const and: Prisma.DirectoryProviderWhereInput[] = [];

  if (filters.specialty) {
    and.push({
      OR: [
        { specialty: { contains: filters.specialty, mode: 'insensitive' } },
        {
          medicalSpecialty: {
            contains: filters.specialty,
            mode: 'insensitive',
          },
        },
      ],
    });
  }

  if (filters.department) {
    where.department = {
      contains: filters.department,
      mode: 'insensitive',
    };
  }

  if (filters.city) {
    where.city = { contains: filters.city, mode: 'insensitive' };
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
    where.availability = {
      in: [
        'Open now',
        '24/7 dispatch',
        'Ouvert maintenant',
        'Disponible aujourd’hui',
        'Dispatch 24/7',
      ],
    };
  }

  if (filters.favoritesOnly) {
    where.id = { in: favoriteProviderIds ?? [] };
  }

  if (filters.q) {
    and.push({
      OR: [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { specialty: { contains: filters.q, mode: 'insensitive' } },
        { medicalSpecialty: { contains: filters.q, mode: 'insensitive' } },
        { title: { contains: filters.q, mode: 'insensitive' } },
        { facilityType: { contains: filters.q, mode: 'insensitive' } },
        { city: { contains: filters.q, mode: 'insensitive' } },
        { department: { contains: filters.q, mode: 'insensitive' } },
        { finessNumber: { contains: filters.q, mode: 'insensitive' } },
        { availability: { contains: filters.q, mode: 'insensitive' } },
        { services: { has: filters.q } },
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
