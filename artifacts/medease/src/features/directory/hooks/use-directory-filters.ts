import { useMemo } from 'react';
import { useSearchParams } from 'wouter';

import { useUrlFilters } from '@/shared/data/hooks/use-url-filters';
import type {
  DirectoryFilters,
  DirectorySort,
  ProviderType,
} from '@/services/directory/directory.types';

const VALID_TYPES: ProviderType[] = [
  'professional',
  'facility',
  'pharmacy',
  'transport',
  'nursing_home',
  'medical_center',
];

const VALID_SORTS: DirectorySort[] = [
  'relevance',
  'distance',
  'alphabetical',
  'availability',
  'updated',
];

export function useDirectoryFilters(defaultType?: ProviderType | 'all') {
  const url = useUrlFilters();
  const [searchParams] = useSearchParams();

  const view =
    (searchParams.get('view') as 'cards' | 'table' | 'compact' | 'map') ||
    'cards';
  const typeParam = searchParams.get('type') ?? defaultType ?? 'all';
  const type = VALID_TYPES.includes(typeParam as ProviderType)
    ? (typeParam as ProviderType)
    : typeParam === 'all'
      ? 'all'
      : (defaultType ?? 'all');

  const sort = VALID_SORTS.includes(url.sort as DirectorySort)
    ? (url.sort as DirectorySort)
    : 'relevance';

  const filters: DirectoryFilters = useMemo(
    () => ({
      q: url.q || undefined,
      type: type === 'all' ? undefined : type,
      specialty: url.status || undefined,
      department: searchParams.get('department') ?? undefined,
      city: searchParams.get('city') ?? undefined,
      postalCode: searchParams.get('postal') ?? undefined,
      teleconsultation: searchParams.get('tele') === '1',
      emergency: searchParams.get('emergency') === '1',
      openNow: searchParams.get('open') === '1',
      favoritesOnly: searchParams.get('favorites') === '1',
      sort,
      page: url.page,
      pageSize: url.pageSize,
    }),
    [url.q, url.status, url.page, url.pageSize, searchParams, sort, type],
  );

  return {
    filters,
    view,
    q: url.q,
    type,
    sort,
    specialty: url.status,
    department: searchParams.get('department') ?? '',
    city: searchParams.get('city') ?? '',
    favoritesOnly: searchParams.get('favorites') === '1',
    setSearch: (value: string) => url.setParam('q', value || null),
    setSpecialty: (value: string) => url.setParam('status', value || null),
    setSort: (value: DirectorySort) =>
      url.setParam('sort', value === 'relevance' ? null : value),
    setType: (value: string) =>
      url.setParam('type', value === 'all' ? null : value),
    setDepartment: (value: string) => url.setParam('department', value || null),
    setCity: (value: string) => url.setParam('city', value || null),
    setFavoritesOnly: (value: boolean) =>
      url.setParam('favorites', value ? '1' : null),
    setView: (value: string) =>
      url.setParam('view', value === 'cards' ? null : value),
    setTeleconsultation: (value: boolean) =>
      url.setParam('tele', value ? '1' : null),
    setEmergency: (value: boolean) =>
      url.setParam('emergency', value ? '1' : null),
    setOpenNow: (value: boolean) => url.setParam('open', value ? '1' : null),
    setPage: (page: number) => url.setParam('page', String(page)),
    setPageSize: (size: number) => url.setParam('pageSize', String(size)),
    clearFilters: url.clearFilters,
    setParam: url.setParam,
    page: url.page,
    pageSize: url.pageSize,
  };
}
