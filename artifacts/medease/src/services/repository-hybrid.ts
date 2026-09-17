/**
 * HTTP repository with local mock fallback (MVP codages pattern).
 * Ensures Répertoire / Bibliothèque / Pilulier search work when the API
 * is unreachable, unseeded, or the session token is not yet attached.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createHybridRepository<T extends Record<string, any>>(
  http: T,
  mock: T,
): T {
  return new Proxy(http, {
    get(target, prop: string | symbol) {
      if (typeof prop !== 'string') return undefined;

      const httpMethod = target[prop];
      const mockMethod = mock[prop];

      if (typeof httpMethod !== 'function') {
        return mockMethod ?? httpMethod;
      }

      return async (...args: unknown[]) => {
        try {
          const result = await httpMethod(...args);
          if (shouldFallbackToMock(prop, result)) {
            return mockMethod(...args);
          }
          return result;
        } catch {
          if (typeof mockMethod === 'function') {
            return mockMethod(...args);
          }
          throw new Error(`Repository method "${prop}" failed`);
        }
      };
    },
  });
}

function shouldFallbackToMock(method: string, result: unknown): boolean {
  if (method === 'search') {
    if (!result || typeof result !== 'object') return true;
    const row = result as { items?: unknown[]; total?: number };
    const items = Array.isArray(row.items) ? row.items : [];
    const total = typeof row.total === 'number' ? row.total : items.length;
    return total === 0 && items.length === 0;
  }

  if (method === 'getProvider' || method === 'getMedication') {
    return result == null;
  }

  if (method === 'getRelatedProviders' || method === 'getRelatedMedications') {
    return Array.isArray(result) && result.length === 0;
  }

  return false;
}
