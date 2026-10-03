import {
  isEmptyPaginatedResult,
  isPaginatedResult,
} from '@/shared/lib/enterprise-data';

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
          const result = await httpMethod.apply(target, args);
          if (shouldFallbackToMock(prop, result)) {
            if (typeof mockMethod !== 'function') return result;
            return mockMethod.apply(mock, args);
          }
          return result;
        } catch (error) {
          if (typeof mockMethod === 'function') {
            return mockMethod.apply(mock, args);
          }
          throw error instanceof Error
            ? error
            : new Error(`Repository method "${prop}" failed`);
        }
      };
    },
  });
}

function shouldFallbackToMock(method: string, result: unknown): boolean {
  if (method === 'dashboard' || method === 'analytics') {
    if (result == null || typeof result !== 'object') return true;
    const row = result as Record<string, unknown>;
    const arrays = Object.values(row).filter(Array.isArray) as unknown[][];
    const numbers = Object.values(row).filter(
      (value) => typeof value === 'number',
    ) as number[];
    const allArraysEmpty =
      arrays.length === 0 || arrays.every((entry) => entry.length === 0);
    const allNumbersZero =
      numbers.length === 0 || numbers.every((value) => value === 0);
    return allArraysEmpty && allNumbersZero;
  }

  if (isEmptyPaginatedResult(result)) {
    return true;
  }

  if (isPaginatedResult(result)) {
    return false;
  }

  if (method === 'search') {
    if (!result || typeof result !== 'object') return true;
    const row = result as {
      items?: unknown[];
      total?: number;
      medications?: unknown[];
      prescriptions?: unknown[];
    };
    if ('medications' in row || 'prescriptions' in row) {
      const medications = Array.isArray(row.medications) ? row.medications : [];
      const prescriptions = Array.isArray(row.prescriptions)
        ? row.prescriptions
        : [];
      return medications.length === 0 && prescriptions.length === 0;
    }
    const items = Array.isArray(row.items) ? row.items : [];
    const total = typeof row.total === 'number' ? row.total : items.length;
    return total === 0 && items.length === 0;
  }

  if (
    method.startsWith('create') ||
    method.startsWith('cancel') ||
    method.startsWith('renew') ||
    method.startsWith('approve') ||
    method.startsWith('reject') ||
    method === 'logDose' ||
    method === 'dispense' ||
    method === 'administer'
  ) {
    return result == null;
  }

  if (
    (method.startsWith('list') ||
      method.startsWith('search') ||
      method.startsWith('get')) &&
    Array.isArray(result) &&
    result.length === 0
  ) {
    return true;
  }

  if (method === 'getPatient') {
    return result == null;
  }

  if (method === 'getProvider' || method === 'getMedication') {
    return result == null;
  }

  if (method === 'getDashboard') {
    if (result == null) return true;
    const dash = result as {
      recentObservations?: unknown[];
      activeAlerts?: number;
    };
    const observations = Array.isArray(dash.recentObservations)
      ? dash.recentObservations
      : [];
    return observations.length === 0 && (dash.activeAlerts ?? 0) === 0;
  }

  if (
    method === 'listVitals' ||
    method === 'listObservations' ||
    method === 'listAlerts'
  ) {
    if (!result || typeof result !== 'object') return true;
    const row = result as { items?: unknown[] };
    return !Array.isArray(row.items) || row.items.length === 0;
  }

  if (method === 'getRelatedProviders' || method === 'getRelatedMedications') {
    return Array.isArray(result) && result.length === 0;
  }

  if (
    method === 'getUpcoming' ||
    method === 'getPast' ||
    method === 'getToday' ||
    method === 'getTelemedicine' ||
    method === 'getAll'
  ) {
    return !Array.isArray(result) || result.length === 0;
  }

  if (method === 'getById') {
    return result == null;
  }

  if (method === 'getWaitlist' || method === 'getQueue') {
    return !Array.isArray(result) || result.length === 0;
  }

  return false;
}
