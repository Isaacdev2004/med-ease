import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { ResolvedAuthorizationContext } from '../permission.service';

export const CurrentPermissions = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ResolvedAuthorizationContext => {
    const request = context.switchToHttp().getRequest<{ authorization?: ResolvedAuthorizationContext }>();
    if (!request.authorization) {
      throw new Error('Authorization context is not available on this request');
    }
    return request.authorization;
  },
);
