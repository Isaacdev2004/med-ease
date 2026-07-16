import { Injectable } from '@nestjs/common';

import {
  getRequestContext,
  mergeRequestContext,
  MissingRequestContextError,
  MissingTenantContextError,
  requireRequestContext,
  requireTenantId,
  type RequestContext,
} from '@medease/observability';

@Injectable()
export class RequestContextService {
  get(): RequestContext | undefined {
    return getRequestContext();
  }

  require(): RequestContext {
    return requireRequestContext();
  }

  getTenantId(): string | undefined {
    return getRequestContext()?.tenantId;
  }

  requireTenantId(): string {
    return requireTenantId();
  }

  merge(partial: Partial<RequestContext>): RequestContext {
    const merged = mergeRequestContext(partial);
    if (!merged) {
      throw new MissingRequestContextError();
    }
    return merged;
  }

  hasTenant(): boolean {
    return Boolean(getRequestContext()?.tenantId);
  }

  assertTenant(): void {
    if (!this.hasTenant()) {
      throw new MissingTenantContextError();
    }
  }
}
