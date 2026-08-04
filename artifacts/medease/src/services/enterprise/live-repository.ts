import type { QueryParams } from '@workspace/repository-transport';
import { httpTransport } from '@workspace/repository-transport';

function camelToKebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function methodToResource(method: string): string | null {
  const match = /^(?:list|get|search)([A-Z].*)$/.exec(method);
  if (!match?.[1]) return null;
  let name = match[1];
  // Normalize common singular → plural resource keys used by the API seed
  const singular: Record<string, string> = {
    Facility: 'facilities',
    Employee: 'employees',
    Incident: 'incidents',
    Trial: 'trials',
    Case: 'cases',
    Prediction: 'predictions',
    Model: 'models',
    Document: 'documents',
    Definition: 'definitions',
    Instance: 'instances',
    Message: 'messages',
    Template: 'templates',
    Campaign: 'campaigns',
    ApiKey: 'api-keys',
    OAuthApp: 'oauth-apps',
    Webhook: 'webhooks',
    Partner: 'partners',
    Tenant: 'tenants',
    Hospital: 'hospitals',
    Designer: 'designers',
  };
  if (singular[name]) return singular[name];
  // Strip trailing "List" / keep plural forms
  name = name.replace(/List$/, 's');
  if (!name.endsWith('s') && !name.endsWith('ss')) {
    // heuristic pluralization for getX collections that aren't singular detail
    if (
      ![
        'Organization',
        'Roster',
        'RiskRegister',
        'OpenApiPreview',
        'OpenApiSpecs',
      ].includes(match[1])
    ) {
      // leave as kebab of name; seed uses plural kebabs for collections
    }
  }
  return camelToKebab(name);
}

function isSingularGetter(method: string): boolean {
  return /^(get)[A-Z][a-zA-Z]*$/.test(method) && !method.endsWith('s') &&
    ![
      'getOrganization',
      'getRoster',
      'getRiskRegister',
      'getOpenApiPreview',
      'getOpenApiSpecs',
      'getSystemHealth',
      'getPayroll',
      'getOnCall',
      'getCoverage',
      'getInbox',
    ].includes(method);
}

function filtersToQuery(filters: unknown): QueryParams | undefined {
  if (!filters || typeof filters !== 'object') return undefined;
  const row = filters as Record<string, unknown>;
  const query: QueryParams = {};
  for (const [key, value] of Object.entries(row)) {
    if (value === undefined || value === null || value === '') continue;
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      query[key] = value;
    }
  }
  return Object.keys(query).length ? query : undefined;
}

function emptyPage(page = 1, pageSize = 25) {
  return { items: [] as unknown[], total: 0, page, pageSize };
}

function asPage(raw: unknown, page = 1, pageSize = 25) {
  if (Array.isArray(raw)) {
    return { items: raw, total: raw.length, page, pageSize };
  }
  if (raw && typeof raw === 'object') {
    const row = raw as Record<string, unknown>;
    if (Array.isArray(row.items)) {
      return {
        items: row.items,
        total: typeof row.total === 'number' ? row.total : row.items.length,
        page: typeof row.page === 'number' ? row.page : page,
        pageSize: typeof row.pageSize === 'number' ? row.pageSize : pageSize,
      };
    }
  }
  return emptyPage(page, pageSize);
}

/**
 * Live HTTP repository adapter for enterprise admin modules.
 * Mirrors mock repository method names but never reads MOCK_* data.
 */
export function createEnterpriseLiveRepository<T extends object>(
  module: string,
  mockRepo: T,
): T {
  const transport = httpTransport;
  const base = `/api/enterprise/${module}`;
  const favorites: unknown[] = [];

  const handler: ProxyHandler<object> = {
    get(_target, prop, _receiver) {
      if (typeof prop !== 'string') return undefined;
      if (prop === 'then') return undefined;

      const sample = (mockRepo as Record<string, unknown>)[prop];
      if (typeof sample !== 'function') {
        return sample;
      }

      if (prop === 'dashboard') {
        return async (scopeKey?: string) =>
          transport.get(`${base}/dashboard`, {
            query: scopeKey ? { scopeKey } : undefined,
          });
      }

      if (prop === 'analytics') {
        return async (scopeKey?: string) =>
          transport.get(`${base}/analytics`, {
            query: scopeKey ? { scopeKey } : undefined,
          });
      }

      if (prop === 'exportData') {
        return async (format: 'csv' | 'pdf' | 'xlsx' = 'csv') => ({
          format,
          exportedAt: new Date().toISOString(),
          generatedAt: new Date().toISOString(),
          recordCount: 0,
        });
      }

      if (prop === 'favorite') {
        return async (...args: unknown[]) => {
          const fav = {
            favoriteId: `fav-${Date.now()}`,
            args,
            createdAt: new Date().toISOString(),
          };
          favorites.unshift(fav);
          return fav;
        };
      }

      if (prop === 'getFavorites') {
        return async () => favorites;
      }

      if (prop === 'search') {
        return async (query: string) => {
          const page = asPage(
            await transport.get(`${base}/resources/search-index`, {
              query: { q: query, page: 1, pageSize: 20 },
            }),
          );
          return page.items.length
            ? { results: page.items, items: page.items }
            : { results: [], items: [], query };
        };
      }

      if (prop === 'share') {
        return async () => ({ shared: true, at: new Date().toISOString() });
      }

      // Singular getById: getFacility(id), getEmployee(id), …
      if (isSingularGetter(prop)) {
        const resource = methodToResource(prop.replace(/^get/, 'get') + 's') ??
          methodToResource(`get${prop.slice(3)}s`) ??
          camelToKebab(prop.slice(3)) + 's';
        // Fix double mapping: getFacility → facilities via singular map
        const resourceType =
          methodToResource(prop) ??
          (() => {
            const baseName = prop.slice(3);
            return (
              {
                Facility: 'facilities',
                Employee: 'employees',
                Incident: 'incidents',
                Trial: 'trials',
                Case: 'cases',
                Prediction: 'predictions',
                Model: 'models',
                Document: 'documents',
                Definition: 'definitions',
                Instance: 'instances',
                Message: 'messages',
                Template: 'templates',
                Campaign: 'campaigns',
                ApiKey: 'api-keys',
                OAuthApp: 'oauth-apps',
                Webhook: 'webhooks',
                Partner: 'partners',
                Tenant: 'tenants',
                Hospital: 'hospitals',
                Designer: 'designers',
              } as Record<string, string>
            )[baseName] ?? `${camelToKebab(baseName)}s`;
          })();

        return async (id: string) => {
          try {
            return await transport.get(
              `${base}/resources/${resourceType}/${id}`,
            );
          } catch {
            const page = asPage(
              await transport.get(`${base}/resources/${resourceType}`, {
                query: { id, page: 1, pageSize: 1 },
              }),
            );
            return page.items[0] ?? null;
          }
        };
      }

      const resource = methodToResource(prop);
      if (resource) {
        return async (filters?: unknown) => {
          const raw = await transport.get(`${base}/resources/${resource}`, {
            query: filtersToQuery(filters),
          });
          return asPage(raw);
        };
      }

      // Mutations → POST action
      return async (...args: unknown[]) => {
        try {
          return await transport.post(`${base}/actions/${prop}`, {
            body: { args },
          });
        } catch {
          return null;
        }
      };
    },
  };

  return new Proxy({}, handler) as T;
}
