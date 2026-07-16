import { useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

interface UseTableStateOptions<T> {
  data: T[];
  sort?: string;
  dir?: SortDirection;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  getSearchText?: (row: T) => string;
  getSortValue?: (row: T, column: string) => string | number;
  filterFn?: (row: T) => boolean;
}

/** Client-side search, filter, sort, and pagination — server-pagination ready via same shape. */
export function useTableState<T>({
  data,
  sort,
  dir = 'asc',
  page = 1,
  pageSize = 25,
  searchQuery = '',
  getSearchText,
  getSortValue,
  filterFn,
}: UseTableStateOptions<T>) {
  return useMemo(() => {
    let rows = [...data];

    if (searchQuery.trim() && getSearchText) {
      const query = searchQuery.trim().toLowerCase();
      rows = rows.filter((row) => getSearchText(row).toLowerCase().includes(query));
    }

    if (filterFn) {
      rows = rows.filter(filterFn);
    }

    if (sort && getSortValue) {
      rows.sort((a, b) => {
        const left = getSortValue(a, sort);
        const right = getSortValue(b, sort);
        if (left === right) return 0;
        if (left < right) return dir === 'asc' ? -1 : 1;
        return dir === 'asc' ? 1 : -1;
      });
    }

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    return {
      rows: pageRows,
      total,
      totalPages,
      page: safePage,
      pageSize,
      from: total === 0 ? 0 : start + 1,
      to: Math.min(start + pageSize, total),
    };
  }, [data, dir, filterFn, getSearchText, getSortValue, page, pageSize, searchQuery, sort]);
}
