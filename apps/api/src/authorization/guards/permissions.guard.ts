import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import type { JwtAccessPayload, PermissionRequirement } from '@medease/auth';

import {
  AuthenticationRequiredException,
  AuthorizationHttpException,
} from '../authorization.exceptions';
import {
  IS_PUBLIC_KEY,
  PERMISSIONS_KEY,
} from '../decorators/require-permission.decorator';
import { PermissionService } from '../permission.service';
import { PolicyService } from '../policy.service';

type AuthorizedRequest = Request & {
  user?: JwtAccessPayload;
  authorization?: ReturnType<PermissionService['resolveForUser']>;
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    private readonly policyService: PolicyService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requirement = this.reflector.getAllAndOverride<
      PermissionRequirement | undefined
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const user = request.user;

    if (!user) {
      throw new AuthenticationRequiredException();
    }

    if (!this.permissionService.isAuthorized(user, requirement)) {
      throw new AuthorizationHttpException();
    }

    const resolved = this.permissionService.resolveForUser(user);
    request.authorization = resolved;

    const resource = this.policyService.extractResourceFromRequest(request);
    const policyResult = this.policyService.evaluate(
      resolved.subject,
      requirement.permissions.join(','),
      resource,
      requirement.policies,
    );

    if (!policyResult.allowed) {
      throw new AuthorizationHttpException(
        policyResult.reason
          ? `Access denied by policy "${policyResult.reason}".`
          : undefined,
      );
    }

    return true;
  }
}
