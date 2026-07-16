import { Injectable } from '@nestjs/common';

import {
  PermissionEngine,
  resolveEffectivePermissions,
  type AuthorizationResource,
  type AuthorizationSubject,
  type EffectivePermissionSet,
  type IdentityRole,
  type JwtAccessPayload,
  type PermissionMode,
  type PermissionRequirement,
} from '@medease/auth';

export interface ResolvedAuthorizationContext {
  subject: AuthorizationSubject;
  permissions: EffectivePermissionSet;
}

interface CachedPermissionEntry {
  role: IdentityRole;
  jwtPermissions: string;
  permissions: EffectivePermissionSet;
}

@Injectable()
export class PermissionService {
  private readonly engine = new PermissionEngine();
  private readonly cache = new Map<string, CachedPermissionEntry>();

  resolveForUser(user: JwtAccessPayload): ResolvedAuthorizationContext {
    const permissions = this.getEffectivePermissions(user);
    return {
      subject: this.toSubject(user),
      permissions,
    };
  }

  getEffectivePermissions(user: JwtAccessPayload): EffectivePermissionSet {
    const jwtPermissions = (user.permissions ?? []).join('|');
    const cached = user.sessionId ? this.cache.get(user.sessionId) : undefined;

    if (cached && cached.role === user.role && cached.jwtPermissions === jwtPermissions) {
      return cached.permissions;
    }

    const permissions = this.engine.resolveEffectivePermissions({
      role: user.role,
      jwtPermissions: user.permissions,
    });

    if (user.sessionId) {
      this.cache.set(user.sessionId, {
        role: user.role,
        jwtPermissions,
        permissions,
      });
    }

    return permissions;
  }

  isAuthorized(
    user: JwtAccessPayload,
    requirement: PermissionRequirement,
  ): boolean {
    const { permissions } = this.resolveForUser(user);
    return this.engine.isAuthorized(
      permissions.effective,
      requirement.permissions,
      requirement.mode,
      permissions.denies,
    );
  }

  invalidateSession(sessionId: string): void {
    this.cache.delete(sessionId);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  private toSubject(user: JwtAccessPayload): AuthorizationSubject {
    return {
      userId: user.sub,
      role: user.role,
      tenantId: user.tenantId,
      organizationId: user.organizationId,
      facilityId: user.facilityId,
      sessionId: user.sessionId,
      permissions: user.permissions,
    };
  }
}

export function buildPolicyContext(
  subject: AuthorizationSubject,
  action: string,
  resource?: AuthorizationResource,
) {
  return { subject, action, resource };
}

export function evaluateRequirementMode(
  mode: PermissionMode,
  results: boolean[],
): boolean {
  if (results.length === 0) {
    return true;
  }

  return mode === 'any' ? results.some(Boolean) : results.every(Boolean);
}
