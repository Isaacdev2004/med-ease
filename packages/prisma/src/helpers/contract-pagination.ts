import type { PaginatedResult } from './pagination';

/** Strip backend-only pagination metadata before returning contract DTOs. */
export function toContractPaginated<T>(
  result: PaginatedResult<T>,
): Pick<PaginatedResult<T>, 'items' | 'page' | 'pageSize' | 'total'> {
  const { items, page, pageSize, total } = result;
  return { items, page, pageSize, total };
}
