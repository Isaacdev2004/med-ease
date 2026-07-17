import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { JwtAccessPayload } from '@medease/auth';

import { PermissionService } from './permission.service';
import {
  facilityAdminUserScopePolicy,
  facilityScopePolicy,
  physicianAssignmentPolicy,
  PolicyService,
  tenantIsolationPolicy,
} from './policy.service';

function sampleUser(
  overrides: Partial<JwtAccessPayload> = {},
): JwtAccessPayload {
  return {
    sub: 'user-1',
    email: 'doctor@medease.health',
    role: 'physician',
    tenantId: 'tenant-a',
    organizationId: 'org-a',
    facilityId: 'facility-a',
    permissions: [],
    sessionId: 'session-1',
    deviceTrust: false,
    ...overrides,
  };
}

describe('PermissionService', () => {
  it('caches effective permissions per session', () => {
    const service = new PermissionService();
    const user = sampleUser();

    const first = service.getEffectivePermissions(user);
    const second = service.getEffectivePermissions(user);

    assert.equal(first, second);
    assert.equal(first.effective.includes('patients.read'), true);
  });

  it('invalidates cached permissions on logout', () => {
    const service = new PermissionService();
    const user = sampleUser();

    const first = service.getEffectivePermissions(user);
    service.invalidateSession(user.sessionId);
    const second = service.getEffectivePermissions(user);

    assert.notEqual(first, second);
    assert.deepEqual(first.effective, second.effective);
  });

  it('authorizes wildcard finance permissions for platform admin', () => {
    const service = new PermissionService();
    const allowed = service.isAuthorized(
      sampleUser({ role: 'platform_admin' }),
      {
        permissions: ['finance.admin'],
        mode: 'all',
      },
    );

    assert.equal(allowed, true);
  });

  it('denies missing permissions', () => {
    const service = new PermissionService();
    const allowed = service.isAuthorized(
      sampleUser({ role: 'transport_dispatcher' }),
      {
        permissions: ['patients.write'],
        mode: 'all',
      },
    );

    assert.equal(allowed, false);
  });
});

describe('PolicyService', () => {
  const policyService = new PolicyService();

  it('denies cross-tenant resource access', () => {
    const result = policyService.evaluate(
      {
        userId: 'user-1',
        role: 'physician',
        tenantId: 'tenant-a',
        organizationId: 'org-a',
      },
      'patients.read',
      { tenantId: 'tenant-b' },
      [tenantIsolationPolicy.name],
    );

    assert.equal(result.allowed, false);
    assert.equal(result.reason, 'tenant-isolation');
  });

  it('allows platform admin to bypass facility restrictions', () => {
    const result = policyService.evaluate(
      {
        userId: 'admin-1',
        role: 'platform_admin',
        tenantId: 'tenant-a',
        organizationId: 'org-a',
        facilityId: 'facility-a',
      },
      'users.read',
      { facilityId: 'facility-b' },
      [facilityScopePolicy.name],
    );

    assert.equal(result.allowed, true);
  });

  it('denies facility admin access outside their facility', () => {
    const result = policyService.evaluate(
      {
        userId: 'admin-1',
        role: 'facility_admin',
        tenantId: 'tenant-a',
        organizationId: 'org-a',
        facilityId: 'facility-a',
      },
      'users.write',
      { facilityId: 'facility-b' },
      [facilityAdminUserScopePolicy.name],
    );

    assert.equal(result.allowed, false);
  });

  it('allows physician access only to assigned patients', () => {
    const allow = policyService.evaluate(
      {
        userId: 'physician-1',
        role: 'physician',
        tenantId: 'tenant-a',
        organizationId: 'org-a',
      },
      'patients.write',
      { assignedPhysicianId: 'physician-1' },
      [physicianAssignmentPolicy.name],
    );

    const deny = policyService.evaluate(
      {
        userId: 'physician-1',
        role: 'physician',
        tenantId: 'tenant-a',
        organizationId: 'org-a',
      },
      'patients.write',
      { assignedPhysicianId: 'physician-2' },
      [physicianAssignmentPolicy.name],
    );

    assert.equal(allow.allowed, true);
    assert.equal(deny.allowed, false);
  });
});
