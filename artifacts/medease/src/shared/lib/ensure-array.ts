/** Normalize API payloads that may be arrays, paginated lists, or single records. */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value == null) {
    return [];
  }

  if (typeof value === 'object') {
    const row = value as Record<string, unknown>;
    for (const key of ['items', 'value', 'data', 'results'] as const) {
      const nested = row[key];
      if (Array.isArray(nested)) {
        return nested as T[];
      }
    }

    // Single entity object returned instead of a list (e.g. one address row).
    return [value as T];
  }

  return [];
}

/** Safe display label for enum-like API strings. */
export function formatEnumLabel(
  value: string | undefined | null,
  separator = '_',
): string {
  return (value ?? 'unknown').replaceAll(separator, ' ');
}
