import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import type { JwtAccessPayload } from '@medease/auth';

import { TenantResolver } from './tenant.resolver';

type AuthenticatedRequest = Request & { user?: JwtAccessPayload };

/**
 * Applies tenant context when an upstream guard or strategy has attached `req.user`.
 * Primary tenant resolution for JWT routes happens in JwtAuthGuard; this middleware
 * supports future session/cookie auth paths that populate user before handlers run.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantResolver: TenantResolver) {}

  use(
    request: AuthenticatedRequest,
    _response: Response,
    next: NextFunction,
  ): void {
    if (request.user) {
      this.tenantResolver.applyFromJwt(request.user);
    }
    next();
  }
}
