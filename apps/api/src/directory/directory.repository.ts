import { Injectable } from '@nestjs/common';

import type {
  DirectoryFilters,
  DirectoryProvider,
  DirectoryRepositoryContract,
  DirectorySearchResult,
  DirectoryStats,
} from '@medease/directory-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertProviderFound,
  mapDirectoryRepositoryError,
  POPULAR_SEARCHES,
  toContractPaginated,
} from './directory.helpers';
import { mapDirectoryProvider } from './mappers/directory.mapper';
import {
  buildDirectoryListWhere,
  buildDirectoryOrderBy,
} from './queries/directory.queries';

function uniqueSorted(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
    .sort((a, b) => a.localeCompare(b, 'fr'));
}

@Injectable()
export class DirectoryRepository
  extends TenantAwareRepository
  implements DirectoryRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  search(filters: DirectoryFilters = {}): Promise<DirectorySearchResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const orderBy = buildDirectoryOrderBy(filters.sort);
    const userId = this.requestContext.require().userId;

    return this.prisma.runInTransaction(async (tx) => {
      let favoriteProviderIds: string[] | undefined;
      if (filters.favoritesOnly && userId) {
        const favorites = await tx.directoryFavorite.findMany({
          where: { tenantId: this.tenantId, userId },
          select: { providerId: true },
        });
        favoriteProviderIds = favorites.map((row) => row.providerId);
      }

      const where = buildDirectoryListWhere(
        this.tenantId,
        filters,
        favoriteProviderIds,
      );

      const [items, total, facetRows] = await Promise.all([
        tx.directoryProvider.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        tx.directoryProvider.count({ where }),
        tx.directoryProvider.findMany({
          where: { tenantId: this.tenantId, active: true },
          select: {
            specialty: true,
            medicalSpecialty: true,
            department: true,
            city: true,
          },
        }),
      ]);

      const paginated = toContractPaginated(
        toPaginatedResult(items.map(mapDirectoryProvider), total, page, pageSize),
      );

      return {
        ...paginated,
        facets: {
          specialties: uniqueSorted(
            facetRows.flatMap((row) => [row.specialty, row.medicalSpecialty]),
          ),
          departments: uniqueSorted(facetRows.map((row) => row.department)),
          cities: uniqueSorted(facetRows.map((row) => row.city)),
        },
      };
    });
  }

  async getById(id: string): Promise<DirectoryProvider> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.directoryProvider.findFirst({
        where: { id, tenantId: this.tenantId, active: true },
      });
      assertProviderFound(row, id);
      return mapDirectoryProvider(row);
    });
  }

  getRelated(id: string): Promise<DirectoryProvider[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const provider = await tx.directoryProvider.findFirst({
        where: { id, tenantId: this.tenantId, active: true },
      });
      assertProviderFound(provider, id);

      const relatedIds = [
        ...provider.associatedFacilityIds,
        ...provider.relatedProfessionalIds,
      ].filter((relatedId) => relatedId !== id);

      if (relatedIds.length > 0) {
        const related = await tx.directoryProvider.findMany({
          where: {
            tenantId: this.tenantId,
            active: true,
            id: { in: relatedIds },
          },
          orderBy: [{ name: 'asc' }],
        });
        return related.map(mapDirectoryProvider);
      }

      const related = await tx.directoryProvider.findMany({
        where: {
          tenantId: this.tenantId,
          active: true,
          id: { not: id },
          type: provider.type,
          city: provider.city,
        },
        orderBy: [{ name: 'asc' }],
        take: 4,
      });
      return related.map(mapDirectoryProvider);
    });
  }

  getStats(userId: string): Promise<DirectoryStats> {
    return this.prisma.runInTransaction(async (tx) => {
      const baseWhere = { tenantId: this.tenantId, active: true };
      const [total, professionals, facilities, pharmacies, transport, favorites] =
        await Promise.all([
          tx.directoryProvider.count({ where: baseWhere }),
          tx.directoryProvider.count({
            where: { ...baseWhere, type: 'professional' },
          }),
          tx.directoryProvider.count({
            where: { ...baseWhere, type: 'facility' },
          }),
          tx.directoryProvider.count({
            where: { ...baseWhere, type: 'pharmacy' },
          }),
          tx.directoryProvider.count({
            where: { ...baseWhere, type: 'transport' },
          }),
          tx.directoryFavorite.count({
            where: { tenantId: this.tenantId, userId },
          }),
        ]);

      return {
        total,
        professionals,
        facilities,
        pharmacies,
        transport,
        favorites,
      };
    });
  }

  listFavorites(userId: string): Promise<DirectoryProvider[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const favorites = await tx.directoryFavorite.findMany({
        where: { tenantId: this.tenantId, userId },
        include: { provider: true },
        orderBy: [{ createdAt: 'desc' }],
      });

      return favorites
        .filter((row) => row.provider.active)
        .map((row) => mapDirectoryProvider(row.provider));
    });
  }

  async toggleFavorite(userId: string, providerId: string): Promise<boolean> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const provider = await tx.directoryProvider.findFirst({
          where: { id: providerId, tenantId: this.tenantId, active: true },
          select: { id: true },
        });
        assertProviderFound(provider, providerId);

        const existing = await tx.directoryFavorite.findFirst({
          where: {
            tenantId: this.tenantId,
            userId,
            providerId,
          },
        });

        if (existing) {
          await tx.directoryFavorite.delete({ where: { id: existing.id } });
          return false;
        }

        await tx.directoryFavorite.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            userId,
            providerId,
          },
        });
        return true;
      });
    } catch (error) {
      mapDirectoryRepositoryError(error);
    }
  }

  getSuggestions(q: string): Promise<string[]> {
    const query = q.trim();
    if (!query) {
      return Promise.resolve([...POPULAR_SEARCHES].slice(0, 5));
    }

    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.directoryProvider.findMany({
        where: {
          tenantId: this.tenantId,
          active: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { specialty: { contains: query, mode: 'insensitive' } },
            { medicalSpecialty: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          name: true,
          specialty: true,
          medicalSpecialty: true,
          facilityType: true,
          city: true,
        },
        take: 40,
        orderBy: [{ name: 'asc' }],
      });

      const matches = new Set<string>();
      const lower = query.toLowerCase();

      for (const row of rows) {
        if (row.name.toLowerCase().includes(lower)) {
          matches.add(row.name);
        }
        if (row.specialty?.toLowerCase().includes(lower)) {
          matches.add(row.specialty);
        }
        if (row.medicalSpecialty?.toLowerCase().includes(lower)) {
          matches.add(row.medicalSpecialty);
        }
        if (row.city.toLowerCase().includes(lower)) {
          matches.add(
            `${row.specialty ?? row.facilityType ?? 'Provider'} ${row.city}`,
          );
        }
        if (matches.size >= 6) break;
      }

      return [...matches].slice(0, 6);
    });
  }

  getPopularSearches(): Promise<string[]> {
    return Promise.resolve([...POPULAR_SEARCHES]);
  }
}
