import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'wouter';

import { DEFAULT_PAGE_SIZE } from '@/services/api/cache-config';

export interface UrlFilterDefaults {
  q?: string;
  status?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
  page?: string;
  pageSize?: string;
}

/** Keeps search, filters, sort, and pagination synchronized with URL parameters. */
export function useUrlFilters(defaults: UrlFilterDefaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = useMemo(
    () => ({
      q: searchParams.get('q') ?? defaults.q ?? '',
      status: searchParams.get('status') ?? defaults.status ?? '',
      sort: searchParams.get('sort') ?? defaults.sort ?? '',
      dir: (searchParams.get('dir') ?? defaults.dir ?? 'asc') as 'asc' | 'desc',
      page: Number(searchParams.get('page') ?? defaults.page ?? '1'),
      pageSize: Number(
        searchParams.get('pageSize') ?? defaults.pageSize ?? String(DEFAULT_PAGE_SIZE),
      ),
    }),
    [defaults, searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        if (key !== 'page') {
          next.delete('page');
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const setMany = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        for (const [key, value] of Object.entries(updates)) {
          if (!value) next.delete(key);
          else next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      ['q', 'status', 'sort', 'dir', 'page'].forEach((key) => next.delete(key));
      return next;
    });
  }, [setSearchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (values.q) count += 1;
    if (values.status) count += 1;
    return count;
  }, [values.q, values.status]);

  return {
    ...values,
    setParam,
    setMany,
    clearFilters,
    activeFilterCount,
  };
}
