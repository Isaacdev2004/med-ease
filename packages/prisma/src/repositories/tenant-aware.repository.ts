import { requireTenantId } from '@medease/observability';

/**
 * Base class for repositories that derive tenant scope from request context.
 * Row-level isolation is enforced in E2-04; until then, avoid accepting tenantId from callers.
 */
export abstract class TenantAwareRepository {
  protected get tenantId(): string {
    return requireTenantId();
  }
}
