import type { MedicationFilters } from '@medease/medical-library-contract';
import type { Prisma } from '@medease/prisma';

export function buildMedicationCatalogWhere(
  tenantId: string,
  filters: MedicationFilters = {},
  favoriteUserId?: string,
): Prisma.MedicationCatalogWhereInput {
  const where: Prisma.MedicationCatalogWhereInput = { tenantId };

  if (filters.category && filters.category !== 'all') {
    where.category = filters.category;
  }
  if (filters.therapeuticClass) {
    where.therapeuticClass = filters.therapeuticClass;
  }
  if (filters.atcCode) {
    where.atcCode = { startsWith: filters.atcCode, mode: 'insensitive' };
  }
  if (filters.prescriptionRequired !== undefined) {
    where.prescriptionRequired = filters.prescriptionRequired;
  }
  if (filters.overTheCounter) {
    where.prescriptionRequired = false;
  }
  if (filters.route) {
    where.route = filters.route;
  }
  if (filters.manufacturer) {
    where.manufacturer = filters.manufacturer;
  }
  if (filters.pregnancySafety) {
    where.pregnancySafety = filters.pregnancySafety;
  }
  if (filters.pediatric) {
    where.pediatricApproved = true;
  }
  if (filters.geriatric) {
    where.geriatricApproved = true;
  }
  if (filters.controlledSubstance) {
    where.controlledSubstance = true;
  }
  if (filters.available !== undefined) {
    where.available = filters.available;
  }
  if (filters.favoritesOnly && favoriteUserId) {
    where.favorites = {
      some: {
        tenantId,
        userId: favoriteUserId,
      },
    };
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { brandName: { contains: filters.q, mode: 'insensitive' } },
      { genericName: { contains: filters.q, mode: 'insensitive' } },
      { atcCode: { contains: filters.q, mode: 'insensitive' } },
      { therapeuticClass: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export function buildMedicationCatalogOrderBy(
  sort?: MedicationFilters['sort'],
): Prisma.MedicationCatalogOrderByWithRelationInput[] {
  switch (sort) {
    case 'most_searched':
      return [{ searchCount: 'desc' }, { name: 'asc' }];
    case 'updated':
      return [{ updatedAt: 'desc' }];
    case 'therapeutic_class':
      return [{ therapeuticClass: 'asc' }, { name: 'asc' }];
    case 'manufacturer':
      return [{ manufacturer: 'asc' }, { name: 'asc' }];
    case 'alphabetical':
    default:
      return [{ name: 'asc' }];
  }
}
