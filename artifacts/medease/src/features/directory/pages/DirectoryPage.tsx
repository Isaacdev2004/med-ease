import { useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Search } from 'lucide-react';

import { DirectoryFilters } from '@/features/directory/components/DirectoryFilters';
import { DirectoryMapPlaceholder } from '@/features/directory/components/DirectoryMapPlaceholder';
import { DirectorySearch } from '@/features/directory/components/DirectorySearch';
import { DirectoryStatsPanel } from '@/features/directory/components/DirectoryStats';
import { DirectoryToolbar } from '@/features/directory/components/DirectoryToolbar';
import { ProviderCard } from '@/features/directory/components/ProviderCard';
import { ProviderTable } from '@/features/directory/components/ProviderTable';
import { useDirectoryFilters } from '@/features/directory/hooks/use-directory-filters';
import { useDirectory, useDirectoryStats, useFavorites } from '@/features/directory/hooks/use-directory';
import {
  getCategoryFromPath,
} from '@/features/directory/utils/directory-path';
import { useAuth } from '@/services/auth/auth-context';
import {
  DataPageLayout,
  FilterChips,
} from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/utils';

const CATEGORY_TABS = [
  { label: 'All', segment: '' },
  { label: 'Professionals', segment: 'professionals' },
  { label: 'Facilities', segment: 'facilities' },
  { label: 'Pharmacies', segment: 'pharmacies' },
  { label: 'Transport', segment: 'transport' },
] as const;

export default function DirectoryPage() {
  const [location] = useLocation();
  const { user, permissions } = useAuth();
  const categoryFromPath = getCategoryFromPath(location);
  const portalBase = '';
  const filterState = useDirectoryFilters(categoryFromPath === 'all' ? undefined : categoryFromPath);
  const query = useDirectory(filterState.filters);
  const statsQuery = useDirectoryStats();
  const favoritesQuery = useFavorites();

  const favoriteIds = useMemo(
    () => new Set((favoritesQuery.data ?? []).map((item) => item.id)),
    [favoritesQuery.data],
  );

  const activeFilters = useMemo(() => {
    const chips = [];
    if (filterState.q) chips.push({ key: 'q', label: 'Search', value: filterState.q });
    if (filterState.specialty) {
      chips.push({ key: 'status', label: 'Specialty', value: filterState.specialty });
    }
    if (filterState.department) {
      chips.push({ key: 'department', label: 'Department', value: filterState.department });
    }
    if (filterState.city) chips.push({ key: 'city', label: 'City', value: filterState.city });
    if (filterState.favoritesOnly) {
      chips.push({ key: 'favorites', label: 'Favorites', value: 'Yes' });
    }
    return chips;
  }, [filterState]);

  const activeFilterCount = activeFilters.length;
  const providers = query.data?.items ?? [];
  const showExport = permissions.includes('reports.export') || user?.role === 'platform_admin';

  const exportRows = providers.map((provider) => ({
    name: provider.name,
    type: provider.type,
    city: provider.address.city,
    department: provider.address.department,
    phone: provider.phone ?? '',
  }));

  const directoryHref = `${portalBase}/directory`;

  return (
    <DataPageLayout
      title="Healthcare Services Directory"
      subtitle="Find professionals, facilities, pharmacies, and transport providers across France."
      lastUpdated={
        query.dataUpdatedAt ? new Date(query.dataUpdatedAt).toLocaleString() : undefined
      }
      metrics={<DirectoryStatsPanel stats={statsQuery.data} loading={statsQuery.isLoading} />}
      toolbar={
        <DirectoryToolbar
          search={
            <DirectorySearch
              defaultValue={filterState.q}
              onSearch={filterState.setSearch}
              loading={query.isFetching}
            />
          }
          filters={
            <DirectoryFilters
              specialty={filterState.specialty}
              department={filterState.department}
              city={filterState.city}
              sort={filterState.sort}
              type={filterState.type}
              favoritesOnly={filterState.favoritesOnly}
              teleconsultation={filterState.filters.teleconsultation ?? false}
              emergency={filterState.filters.emergency ?? false}
              openNow={filterState.filters.openNow ?? false}
              facets={query.data?.facets}
              activeCount={activeFilterCount}
              onSpecialtyChange={filterState.setSpecialty}
              onDepartmentChange={filterState.setDepartment}
              onCityChange={filterState.setCity}
              onSortChange={filterState.setSort}
              onTypeChange={filterState.setType}
              onFavoritesChange={filterState.setFavoritesOnly}
              onTeleconsultationChange={filterState.setTeleconsultation}
              onEmergencyChange={filterState.setEmergency}
              onOpenNowChange={filterState.setOpenNow}
            />
          }
          view={filterState.view}
          onViewChange={(view) => filterState.setView(view)}
          onRefresh={() => void query.refetch()}
          refreshing={query.isFetching}
          exportRows={exportRows}
          showExport={showExport}
        />
      }
      filters={
        <>
          <Tabs value={location.split('/').pop() === 'directory' ? '' : (location.split('/').pop() ?? '')}>
            <TabsList className="mb-4 flex flex-wrap h-auto">
              {CATEGORY_TABS.map((tab) => {
                const href = tab.segment ? `${directoryHref}/${tab.segment}` : directoryHref;
                const isActive = tab.segment
                  ? location.endsWith(`/${tab.segment}`)
                  : location.endsWith('/directory') || location.match(/\/directory\/?$/);
                return (
                  <TabsTrigger key={tab.label} value={tab.segment} asChild>
                    <Link
                      href={href}
                      className={cn(isActive && 'data-[state=active]:bg-background')}
                    >
                      {tab.label}
                    </Link>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <FilterChips
            filters={activeFilters}
            onRemove={(key) => {
              if (key === 'department') filterState.setDepartment('');
              else if (key === 'city') filterState.setCity('');
              else if (key === 'favorites') filterState.setFavoritesOnly(false);
              else filterState.setParam(key, null);
            }}
            onClearAll={filterState.clearFilters}
          />
        </>
      }
    >
      {filterState.view === 'map' ? (
        <DirectoryMapPlaceholder providers={providers} portalBase={portalBase} />
      ) : filterState.view === 'table' ? (
        <ProviderTable
          providers={providers}
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
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <EmptyState
          icon={Search}
          title={filterState.favoritesOnly ? 'No favorites yet' : 'No providers found'}
          description={
            filterState.favoritesOnly
              ? 'Save providers to quickly access them from your directory.'
              : 'Try adjusting your search or filters to find healthcare providers.'
          }
        />
      ) : filterState.view === 'compact' ? (
        <div className="space-y-2">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              portalBase={portalBase}
              isFavorite={favoriteIds.has(provider.id)}
              compact
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              portalBase={portalBase}
              isFavorite={favoriteIds.has(provider.id)}
            />
          ))}
        </div>
      )}

      {filterState.view !== 'table' && providers.length > 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Showing {providers.length} of {query.data?.total ?? 0} providers
        </p>
      ) : null}
    </DataPageLayout>
  );
}
