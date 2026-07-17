import { useMemo } from 'react';
import { useSearchParams } from 'wouter';

import { useUrlFilters } from '@/shared/data/hooks/use-url-filters';
import type {
  MedicationCategory,
  MedicationFilters,
  MedicationSort,
} from '@/services/medical-library/medical-library.types';

const VALID_CATEGORIES: MedicationCategory[] = [
  'pain_relief',
  'antibiotics',
  'cardiology',
  'diabetes',
  'neurology',
  'respiratory',
  'dermatology',
  'vaccines',
  'psychiatry',
  'gastroenterology',
  'endocrinology',
  'ophthalmology',
  'ent',
  'urology',
  'emergency',
];

const VALID_SORTS: MedicationSort[] = [
  'alphabetical',
  'most_searched',
  'updated',
  'therapeutic_class',
  'manufacturer',
];

export function useMedicalLibraryFilters(
  defaultCategory?: MedicationCategory | 'all',
) {
  const url = useUrlFilters();
  const [searchParams] = useSearchParams();

  const view =
    (searchParams.get('view') as
      'cards' | 'table' | 'compact' | 'categories') || 'cards';
  const categoryParam =
    searchParams.get('category') ?? defaultCategory ?? 'all';
  const category = VALID_CATEGORIES.includes(
    categoryParam as MedicationCategory,
  )
    ? (categoryParam as MedicationCategory)
    : categoryParam === 'all'
      ? 'all'
      : (defaultCategory ?? 'all');

  const sort = VALID_SORTS.includes(url.sort as MedicationSort)
    ? (url.sort as MedicationSort)
    : 'alphabetical';

  const filters: MedicationFilters = useMemo(
    () => ({
      q: url.q || undefined,
      category: category === 'all' ? undefined : category,
      therapeuticClass: url.status || undefined,
      prescriptionRequired:
        searchParams.get('rx') === '1'
          ? true
          : searchParams.get('rx') === '0'
            ? false
            : undefined,
      overTheCounter: searchParams.get('otc') === '1',
      pediatric: searchParams.get('pediatric') === '1',
      geriatric: searchParams.get('geriatric') === '1',
      favoritesOnly: searchParams.get('favorites') === '1',
      sort,
      page: url.page,
      pageSize: url.pageSize,
    }),
    [url.q, url.status, url.page, url.pageSize, searchParams, sort, category],
  );

  return {
    filters,
    view,
    q: url.q,
    category,
    sort,
    therapeuticClass: url.status,
    favoritesOnly: searchParams.get('favorites') === '1',
    setSearch: (value: string) => url.setParam('q', value || null),
    setTherapeuticClass: (value: string) =>
      url.setParam('status', value || null),
    setSort: (value: MedicationSort) =>
      url.setParam('sort', value === 'alphabetical' ? null : value),
    setCategory: (value: string) =>
      url.setParam('category', value === 'all' ? null : value),
    setFavoritesOnly: (value: boolean) =>
      url.setParam('favorites', value ? '1' : null),
    setOverTheCounter: (value: boolean) =>
      url.setParam('otc', value ? '1' : null),
    setPrescriptionRequired: (value: boolean | null) =>
      url.setParam('rx', value === true ? '1' : value === false ? '0' : null),
    setPediatric: (value: boolean) =>
      url.setParam('pediatric', value ? '1' : null),
    setGeriatric: (value: boolean) =>
      url.setParam('geriatric', value ? '1' : null),
    setView: (value: string) =>
      url.setParam('view', value === 'cards' ? null : value),
    setPage: (page: number) => url.setParam('page', String(page)),
    setPageSize: (size: number) => url.setParam('pageSize', String(size)),
    clearFilters: url.clearFilters,
    setParam: url.setParam,
    page: url.page,
    pageSize: url.pageSize,
  };
}
