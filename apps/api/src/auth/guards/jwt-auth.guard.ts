import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { JwtAccessPayload } from '@medease/auth';

import { TenantResolver } from '../../tenant/tenant.resolver';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly tenantResolver: TenantResolver) {
    super();
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
