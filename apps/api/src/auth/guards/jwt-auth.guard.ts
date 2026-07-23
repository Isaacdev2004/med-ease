import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import type { JwtAccessPayload } from '@medease/auth';

import { IS_PUBLIC_KEY } from '../../authorization/decorators/require-permission.decorator';
import { TenantResolver } from '../../tenant/tenant.resolver';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantResolver: TenantResolver,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtAccessPayload>(
    err: Error | null,
    user: TUser | false,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    const resolved = super.handleRequest(
      err,
      user,
      info,
      context,
      status,
    ) as TUser;

    if (resolved && typeof resolved === 'object' && 'tenantId' in resolved) {
      this.tenantResolver.applyFromJwt(resolved as unknown as JwtAccessPayload);
    }

    return resolved;
  }
}
