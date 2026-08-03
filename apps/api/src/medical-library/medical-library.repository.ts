import { Injectable } from '@nestjs/common';

import type {
  MedicationCategory,
  MedicationCategoryInfo,
  MedicationFilters,
  MedicationLibraryStats,
  MedicationRecord,
  MedicationRoute,
  MedicationSearchResult,
  MedicalLibraryRepositoryContract,
} from '@medease/medical-library-contract';
import {
  MEDICATION_CATEGORIES,
  MEDICATION_CATEGORY_LABELS,
} from '@medease/medical-library-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertMedicationFound,
  mapMedicalLibraryRepositoryError,
  POPULAR_MEDICATIONS,
  toContractPaginated,
} from './medical-library.helpers';
import {
  mapCategory,
  mapMedicationCatalog,
  mapRoute,
} from './mappers/medical-library.mapper';
import {
  buildMedicationCatalogOrderBy,
  buildMedicationCatalogWhere,
} from './queries/medical-library.queries';

@Injectable()
export class MedicalLibraryRepository
  extends TenantAwareRepository
  implements MedicalLibraryRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  search(filters: MedicationFilters = {}): Promise<MedicationSearchResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const favoriteUserId = filters.favoritesOnly
      ? this.actorId()
      : undefined;
    const where = buildMedicationCatalogWhere(
      this.tenantId,
      filters,
      favoriteUserId,
    );
    const orderBy = buildMedicationCatalogOrderBy(filters.sort);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total, facetRows] = await Promise.all([
        tx.medicationCatalog.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        tx.medicationCatalog.count({ where }),
        tx.medicationCatalog.findMany({
          where: { tenantId: this.tenantId },
          select: {
            category: true,
            therapeuticClass: true,
            manufacturer: true,
            route: true,
          },
        }),
      ]);

      const paginated = toContractPaginated(
        toPaginatedResult(
          items.map(mapMedicationCatalog),
          total,
          page,
          pageSize,
        ),
      );

      return {
        ...paginated,
        facets: buildFacets(facetRows),
      };
    });
  }

  async getById(id: string): Promise<MedicationRecord> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.medicationCatalog.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertMedicationFound(row, id);
      return mapMedicationCatalog(row);
    });
  }

  getRelated(id: string): Promise<MedicationRecord[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.medicationCatalog.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertMedicationFound(row, id);

      const relatedIds = row.relatedMedicationIds ?? [];
      const related = await tx.medicationCatalog.findMany({
        where: {
          tenantId: this.tenantId,
          id: { not: id },
          OR: [
            ...(relatedIds.length ? [{ id: { in: relatedIds } }] : []),
            { category: row.category },
          ],
        },
        take: 4,
        orderBy: [{ searchCount: 'desc' }, { name: 'asc' }],
      });

      return related.map(mapMedicationCatalog);
    });
  }

  getCategories(): Promise<MedicationCategoryInfo[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const grouped = await tx.medicationCatalog.groupBy({
        by: ['category'],
        where: { tenantId: this.tenantId },
        _count: { _all: true },
      });

      const counts = new Map(
        grouped.map((row) => [row.category, row._count._all]),
      );

      return MEDICATION_CATEGORIES.map((id) => {
        const label = MEDICATION_CATEGORY_LABELS[id];
        return {
          id,
          label,
          description: `Browse ${label.toLowerCase()} medications`,
          count: counts.get(id) ?? 0,
        };
      });
    });
  }

  getStats(userId: string): Promise<MedicationLibraryStats> {
    return this.prisma.runInTransaction(async (tx) => {
      const [
        total,
        prescription,
        overTheCounter,
        categoryGroups,
        favorites,
      ] = await Promise.all([
        tx.medicationCatalog.count({ where: { tenantId: this.tenantId } }),
        tx.medicationCatalog.count({
          where: { tenantId: this.tenantId, prescriptionRequired: true },
        }),
        tx.medicationCatalog.count({
          where: { tenantId: this.tenantId, prescriptionRequired: false },
        }),
        tx.medicationCatalog.groupBy({
          by: ['category'],
          where: { tenantId: this.tenantId },
        }),
        tx.medicationLibraryFavorite.count({
          where: { tenantId: this.tenantId, userId },
        }),
      ]);

      return {
        total,
        prescription,
        overTheCounter,
        categories: categoryGroups.length,
        favorites,
      };
    });
  }

  listFavorites(userId: string): Promise<MedicationRecord[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const favorites = await tx.medicationLibraryFavorite.findMany({
        where: { tenantId: this.tenantId, userId },
        include: { medication: true },
        orderBy: [{ createdAt: 'desc' }],
      });
      return favorites.map((favorite) =>
        mapMedicationCatalog(favorite.medication),
      );
    });
  }

  async toggleFavorite(
    userId: string,
    medicationId: string,
  ): Promise<boolean> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const medication = await tx.medicationCatalog.findFirst({
          where: { id: medicationId, tenantId: this.tenantId },
          select: { id: true },
        });
        assertMedicationFound(medication, medicationId);

        const existing = await tx.medicationLibraryFavorite.findFirst({
          where: {
            tenantId: this.tenantId,
            userId,
            medicationId,
          },
        });

        if (existing) {
          await tx.medicationLibraryFavorite.delete({
            where: { id: existing.id },
          });
          return false;
        }

        await tx.medicationLibraryFavorite.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            userId,
            medicationId,
          },
        });
        return true;
      });
    } catch (error) {
      mapMedicalLibraryRepositoryError(error);
    }
  }

  getSuggestions(q: string): Promise<string[]> {
    const query = q.trim();
    if (!query) {
      return Promise.resolve([...POPULAR_MEDICATIONS].slice(0, 5));
    }

    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.medicationCatalog.findMany({
        where: {
          tenantId: this.tenantId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { brandName: { contains: query, mode: 'insensitive' } },
            { genericName: { contains: query, mode: 'insensitive' } },
            { atcCode: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 40,
        orderBy: [{ searchCount: 'desc' }, { name: 'asc' }],
        select: {
          name: true,
          brandName: true,
          genericName: true,
          atcCode: true,
          activeIngredients: true,
        },
      });

      const lower = query.toLowerCase();
      const matches = new Set<string>();
      for (const row of rows) {
        if (row.name.toLowerCase().includes(lower)) matches.add(row.name);
        if (row.brandName?.toLowerCase().includes(lower)) {
          matches.add(row.brandName);
        }
        if (row.genericName.toLowerCase().includes(lower)) {
          matches.add(row.genericName);
        }
        if (row.atcCode.toLowerCase().includes(lower)) {
          matches.add(`${row.name} (${row.atcCode})`);
        }
        for (const ingredient of row.activeIngredients ?? []) {
          if (ingredient.toLowerCase().includes(lower)) {
            matches.add(ingredient);
          }
        }
        if (matches.size >= 6) break;
      }
      return [...matches].slice(0, 6);
    });
  }

  getPopular(): Promise<string[]> {
    return Promise.resolve([...POPULAR_MEDICATIONS]);
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}

function buildFacets(
  rows: Array<{
    category: string;
    therapeuticClass: string;
    manufacturer: string | null;
    route: string;
  }>,
): MedicationSearchResult['facets'] {
  const categories = new Set<MedicationCategory>();
  const therapeuticClasses = new Set<string>();
  const manufacturers = new Set<string>();
  const routes = new Set<MedicationRoute>();

  for (const row of rows) {
    categories.add(mapCategory(row.category));
    therapeuticClasses.add(row.therapeuticClass);
    if (row.manufacturer) manufacturers.add(row.manufacturer);
    routes.add(mapRoute(row.route));
  }

  return {
    categories: [...categories],
    therapeuticClasses: [...therapeuticClasses].sort(),
    manufacturers: [...manufacturers].sort(),
    routes: [...routes],
  };
}
