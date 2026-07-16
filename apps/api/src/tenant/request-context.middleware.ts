import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { CORRELATION_ID_HEADER, REQUEST_ID_HEADER } from '@medease/constants';
import { createRequestId } from '@medease/logger';
import { createBaseRequestContext, runWithRequestContext } from '@medease/observability';

/**
 * Establishes AsyncLocalStorage request context before guards run.
 * Tenant fields are populated later by JwtAuthGuard via TenantResolver.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = createRequestId(request.headers[REQUEST_ID_HEADER] as string | undefined);
    const correlationId = createRequestId(
      (request.headers[CORRELATION_ID_HEADER] as string | undefined) ?? requestId,
    );

    request.headers[REQUEST_ID_HEADER] = requestId;
    request.headers[CORRELATION_ID_HEADER] = correlationId;
    response.setHeader(REQUEST_ID_HEADER, requestId);
    response.setHeader(CORRELATION_ID_HEADER, correlationId);

    const context = createBaseRequestContext({ requestId, correlationId });
    runWithRequestContext(context, () => next());
  }
}
