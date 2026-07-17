import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Reflector } from '@nestjs/core';
import type { ExecutionContext } from '@nestjs/common';

import type { JwtAccessPayload, PermissionRequirement } from '@medease/auth';

import {
  AuthenticationRequiredException,
  AuthorizationHttpException,
} from './authorization.exceptions';
import {
  IS_PUBLIC_KEY,
  PERMISSIONS_KEY,
} from './decorators/require-permission.decorator';
import { PermissionsGuard } from './guards/permissions.guard';
import { PermissionService } from './permission.service';
import { PolicyService } from './policy.service';

function createContext(input: {
  user?: JwtAccessPayload;
  requirement?: PermissionRequirement;
  isPublic?: boolean;
  params?: Record<string, string>;
}): ExecutionContext {
  const request = {
    user: input.user,
    params: input.params ?? {},
    body: {},
    query: {},
  };

  const handler = () => undefined;
  const classRef = class TestController {};

  const _reflector = new Reflector();
  if (input.requirement) {
    Reflect.defineMetadata(PERMISSIONS_KEY, input.requirement, handler);
  }
  if (input.isPublic) {
    Reflect.defineMetadata(IS_PUBLIC_KEY, true, handler);
  }

  return {
    getHandler: () => handler,
    getClass: () => classRef,
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function physicianUser(): JwtAccessPayload {
  return {
    sub: 'physician-1',
    email: 'doctor@medease.health',
    role: 'physician',
    tenantId: 'tenant-a',
    organizationId: 'org-a',
    permissions: [],
    sessionId: 'session-1',
    deviceTrust: false,
  };
}

describe('PermissionsGuard', () => {
  const guard = new PermissionsGuard(
    new Reflector(),
    new PermissionService(),
    new PolicyService(),
  );

  it('allows public routes without authentication', () => {
    const allowed = guard.canActivate(
      createContext({
        isPublic: true,
        requirement: { permissions: ['patients.read'], mode: 'all' },
      }),
    );

    assert.equal(allowed, true);
  });

  it('allows routes without permission metadata', () => {
    const allowed = guard.canActivate(createContext({ user: physicianUser() }));
    assert.equal(allowed, true);
  });

  it('rejects anonymous requests for protected permissions', () => {
    assert.throws(
      () =>
        guard.canActivate(
          createContext({
            requirement: { permissions: ['patients.read'], mode: 'all' },
          }),
        ),
      AuthenticationRequiredException,
    );
  });

  it('allows an authorized permission', () => {
    const allowed = guard.canActivate(
      createContext({
        user: physicianUser(),
        requirement: { permissions: ['patients.read'], mode: 'all' },
      }),
    );

    assert.equal(allowed, true);
  });

  it('rejects missing permissions with 403', () => {
    assert.throws(
      () =>
        guard.canActivate(
          createContext({
            user: physicianUser(),
            requirement: { permissions: ['iam.admin'], mode: 'all' },
          }),
        ),
      AuthorizationHttpException,
    );
  });

  it('supports ANY mode permission requirements', () => {
    const allowed = guard.canActivate(
      createContext({
        user: physicianUser(),
        requirement: {
          permissions: ['iam.admin', 'patients.read'],
          mode: 'any',
        },
      }),
    );

    assert.equal(allowed, true);
  });

  it('denies cross-tenant ABAC access when resource tenant differs', () => {
    assert.throws(
      () =>
        guard.canActivate(
          createContext({
            user: physicianUser(),
            requirement: {
              permissions: ['patients.read'],
              mode: 'all',
              policies: ['tenant-isolation'],
            },
            params: { tenantId: 'tenant-b' },
          }),
        ),
      AuthorizationHttpException,
    );
  });
});
