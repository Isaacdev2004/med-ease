/** Case-insensitive in-memory filter for mock repositories and post-fetch filtering. */
export function matchQuery(q: string | undefined, ...fields: (string | undefined)[]): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((field) => field?.toLowerCase().includes(lower));
}

/** Prisma string filter for case-insensitive contains search. */
export function insensitiveContains(value: string) {
  return { contains: value, mode: 'insensitive' as const };
}

export function buildOrContains(fields: string[], query: string) {
  return fields.map((field) => ({ [field]: insensitiveContains(query) }));
}
