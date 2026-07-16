import type { PaginatedResult } from './pagination';

/** Strip backend-only pagination metadata before returning contract DTOs. */
export function toContractPaginated<T>(
  result: PaginatedResult<T>,
): Pick<PaginatedResult<T>, 'items' | 'page' | 'pageSize' | 'total'> {
  const { totalPages: _totalPages, ...contract } = result;
  return contract;
}
