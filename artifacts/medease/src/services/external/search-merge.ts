import type { DirectoryProvider, DirectorySearchResult } from '@/services/directory/directory.types';
import type {
  MedicationRecord,
  MedicationSearchResult,
} from '@/services/medical-library/medical-library.types';

function dedupeByKey<T>(
  items: T[],
  keyFn: (item: T) => string,
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function mergeMedicationSearchResults(
  primary: MedicationSearchResult,
  extras: MedicationRecord[],
  page: number,
  pageSize: number,
): MedicationSearchResult {
  const merged = dedupeByKey(
    [...primary.items, ...extras],
    (m) => m.bdpmId ?? m.id,
  );

  const start = (page - 1) * pageSize;
  const items = merged.slice(start, start + pageSize);

  return {
    ...primary,
    items,
    total: merged.length,
    page,
    pageSize,
  };
}

export function mergeDirectorySearchResults(
  primary: DirectorySearchResult,
  extras: DirectoryProvider[],
  page: number,
  pageSize: number,
): DirectorySearchResult {
  const merged = dedupeByKey(
    [...primary.items, ...extras],
    (p) => p.finessNumber ?? p.id,
  );

  const start = (page - 1) * pageSize;
  const items = merged.slice(start, start + pageSize);

  return {
    ...primary,
    items,
    total: Math.max(primary.total, merged.length),
    page,
    pageSize,
  };
}
