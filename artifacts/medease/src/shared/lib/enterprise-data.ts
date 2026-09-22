/** Safely coerce unknown API/hybrid values into an array. */
export function ensureArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const items = (value as { items?: unknown }).items;
    if (Array.isArray(items)) return items as T[];
  }
  return [];
}

/** Extract list items from paginated query results or raw arrays. */
export function pageItems<T = unknown>(
  data: unknown,
  fallback: T[] = [],
): T[] {
  const items = ensureArray<T>(data);
  return items.length > 0 ? items : fallback;
}

/** Limit list rendering without throwing when the source is not an array. */
export function sliceItems<T = unknown>(value: unknown, limit: number): T[] {
  return ensureArray<T>(value).slice(0, limit);
}

/** Format KPI counts when live API fields are missing. */
export function formatCount(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString();
}

/** Format enum-like status labels without crashing on undefined. */
export function formatStatus(value: string | null | undefined): string {
  return (value ?? 'unknown').replace(/_/g, ' ');
}

export function isPaginatedResult(
  value: unknown,
): value is { items: unknown[]; total?: number } {
  return (
    value != null &&
    typeof value === 'object' &&
    Array.isArray((value as { items?: unknown }).items)
  );
}

export function isEmptyPaginatedResult(value: unknown): boolean {
  if (!isPaginatedResult(value)) return false;
  const total =
    typeof value.total === 'number' ? value.total : value.items.length;
  return total === 0 && value.items.length === 0;
}
