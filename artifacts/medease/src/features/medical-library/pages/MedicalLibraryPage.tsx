import { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, Search } from 'lucide-react';

import { CategoryGrid } from '@/features/medical-library/components/CategoryGrid';
import { ComparisonDrawer } from '@/features/medical-library/components/ComparisonDrawer';
import { MedicationCard } from '@/features/medical-library/components/MedicationCard';
import { MedicationFilters } from '@/features/medical-library/components/MedicationFilters';
import { MedicationSearch } from '@/features/medical-library/components/MedicationSearch';
import { MedicationStats } from '@/features/medical-library/components/MedicationStats';
import { MedicationTable } from '@/features/medical-library/components/MedicationTable';
import { MedicationToolbar } from '@/features/medical-library/components/MedicationToolbar';
import { useMedicalLibraryFilters } from '@/features/medical-library/hooks/use-medical-library-filters';
import {
  useMedicalLibrary,
  useMedicalLibraryStats,
  useMedicationCategories,
  useMedicationFavorites,
} from '@/features/medical-library/hooks/use-medical-library';
import { getCategoryFromPath } from '@/features/medical-library/utils/medical-library-path';
import { useAuth } from '@/services/auth/auth-context';
import { DataPageLayout, FilterChips } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';

export default function MedicalLibraryPage() {
  const [location] = useLocation();
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePrimary, setComparePrimary] = useState<MedicationRecord | null>(null);
  const { user, permissions } = useAuth();
  const portalBase = '';
  const pathCategory = getCategoryFromPath(location);
  const filterState = useMedicalLibraryFilters();
  const query = useMedicalLibrary(filterState.filters);
  const statsQuery = useMedicalLibraryStats();
  const categoriesQuery = useMedicationCategories();
  const favoritesQuery = useMedicationFavorites();

  const favoriteIds = useMemo(
    () => new Set((favoritesQuery.data ?? []).map((m) => m.id)),
    [favoritesQuery.data],
  );

  const activeFilters = useMemo(() => {
    const chips = [];
    if (filterState.q) chips.push({ key: 'q', label: 'Search', value: filterState.q });
    if (filterState.therapeuticClass) {
      chips.push({ key: 'status', label: 'Class', value: filterState.therapeuticClass });
    }
    if (filterState.favoritesOnly) chips.push({ key: 'favorites', label: 'Favorites', value: 'Yes' });
    return chips;
  }, [filterState]);

  const medications = query.data?.items ?? [];
  const showExport = permissions.includes('reports.export') || user?.role === 'platform_admin';
  const showCategories = filterState.view === 'categories' || pathCategory === 'categories';
  const libraryHref = `${portalBase}/medical-library`;

  const openCompare = (medication: MedicationRecord) => {
    setComparePrimary(medication);
    setCompareOpen(true);
  };

  return (
    <DataPageLayout
      title="Medical Library"
      subtitle="Centralized medication reference — BDPM-ready knowledge base for all Med-ease portals."
      lastUpdated={query.dataUpdatedAt ? new Date(query.dataUpdatedAt).toLocaleString() : undefined}
      metrics={<MedicationStats stats={statsQuery.data} loading={statsQuery.isLoading} />}
      toolbar={
        <MedicationToolbar
          search={
            <MedicationSearch
              defaultValue={filterState.q}
              onSearch={filterState.setSearch}
              loading={query.isFetching}
            />
          }
          filters={
            <MedicationFilters
              therapeuticClass={filterState.therapeuticClass}
              category={filterState.category}
              sort={filterState.sort}
              favoritesOnly={filterState.favoritesOnly}
              overTheCounter={filterState.filters.overTheCounter ?? false}
              pediatric={filterState.filters.pediatric ?? false}
              geriatric={filterState.filters.geriatric ?? false}
              facets={query.data?.facets}
              activeCount={activeFilters.length}
              onTherapeuticClassChange={filterState.setTherapeuticClass}
              onCategoryChange={filterState.setCategory}
              onSortChange={filterState.setSort}
              onFavoritesChange={filterState.setFavoritesOnly}
              onOverTheCounterChange={filterState.setOverTheCounter}
              onPediatricChange={filterState.setPediatric}
              onGeriatricChange={filterState.setGeriatric}
            />
          }
          view={filterState.view}
          onViewChange={(view) => filterState.setView(view)}
          onRefresh={() => void query.refetch()}
          refreshing={query.isFetching}
          exportRows={medications.map((m) => ({
            name: m.name,
            brand: m.brandName ?? '',
            strength: m.strength,
            atc: m.atcCode,
          }))}
          showExport={showExport}
        />
      }
      filters={
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={libraryHref}>All</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`${libraryHref}/categories`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Categories
              </Link>
            </Button>
          </div>
          <FilterChips
            filters={activeFilters}
            onRemove={(key) => {
              if (key === 'favorites') filterState.setFavoritesOnly(false);
              else filterState.setParam(key, null);
            }}
            onClearAll={filterState.clearFilters}
          />
        </>
      }
    >
      {showCategories ? (
        categoriesQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <CategoryGrid categories={categoriesQuery.data ?? []} portalBase={portalBase} />
        )
      ) : filterState.view === 'table' ? (
        <MedicationTable
          medications={medications}
          portalBase={portalBase}
          loading={query.isLoading}
          error={query.isError}
          onRetry={() => void query.refetch()}
          searchQuery={filterState.q}
          page={filterState.page}
          pageSize={filterState.pageSize}
          total={query.data?.total ?? 0}
          onPageChange={filterState.setPage}
          onPageSizeChange={filterState.setPageSize}
        />
      ) : query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : medications.length === 0 ? (
        <EmptyState
          icon={Search}
          title={filterState.favoritesOnly ? 'No favorites yet' : 'No medications found'}
          description="Try adjusting your search or filters."
        />
      ) : filterState.view === 'compact' ? (
        <div className="space-y-2">
          {medications.map((med) => (
            <MedicationCard key={med.id} medication={med} portalBase={portalBase} isFavorite={favoriteIds.has(med.id)} compact onCompare={openCompare} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {medications.map((med) => (
            <MedicationCard key={med.id} medication={med} portalBase={portalBase} isFavorite={favoriteIds.has(med.id)} onCompare={openCompare} />
          ))}
        </div>
      )}

      {!showCategories && filterState.view !== 'table' && medications.length > 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Showing {medications.length} of {query.data?.total ?? 0} medications
        </p>
      ) : null}

      <ComparisonDrawer
        open={compareOpen}
        onOpenChange={setCompareOpen}
        primary={comparePrimary}
        candidates={medications}
      />
    </DataPageLayout>
  );
}
