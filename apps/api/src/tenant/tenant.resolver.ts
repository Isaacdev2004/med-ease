import { Injectable } from '@nestjs/common';

import type { JwtAccessPayload } from '@medease/auth';
import {
  tenantContextFromJwt,
  type RequestContext,
} from '@medease/observability';

import { RequestContextService } from './request-context.service';

@Injectable()
export class TenantResolver {
  constructor(private readonly requestContext: RequestContextService) {}

  resolveFromJwt(payload: JwtAccessPayload): Partial<RequestContext> {
    const current = this.requestContext.get();
    return tenantContextFromJwt(
      payload,
      current
        ? { requestId: current.requestId, correlationId: current.correlationId }
        : undefined,
    );
  }

  applyFromJwt(payload: JwtAccessPayload): RequestContext {
    return this.requestContext.merge(this.resolveFromJwt(payload));
  }
}
