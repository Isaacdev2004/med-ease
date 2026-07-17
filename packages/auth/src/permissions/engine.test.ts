import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  evaluatePermissionRequirement,
  hasPermission,
  permissionMatches,
  resolveEffectivePermissions,
} from './engine';

describe('PermissionEngine', () => {
  it('matches wildcard namespace permissions', () => {
    assert.equal(permissionMatches('finance.*', 'finance.read'), true);
    assert.equal(permissionMatches('finance.*', 'finance.admin'), true);
    assert.equal(permissionMatches('finance.*', 'patients.read'), false);
    assert.equal(permissionMatches('*', 'anything.here'), true);
  });

  it('allows a granted permission', () => {
    assert.equal(
      hasPermission(['patients.read', 'patients.write'], 'patients.read'),
      true,
    );
    assert.equal(hasPermission(['patients.read'], 'patients.write'), false);
  });

  it('applies deny rules with higher precedence than grants', () => {
    const effective = resolveEffectivePermissions({ role: 'patient' });
    assert.equal(
      hasPermission(effective.effective, 'patients.read', effective.denies),
      true,
    );
    assert.equal(
      hasPermission(effective.effective, 'patients.write', effective.denies),
      false,
    );
  });

  it('evaluates ALL mode requirements', () => {
    const grants = ['patients.read', 'patients.write'];
    assert.equal(
      evaluatePermissionRequirement(
        grants,
        ['patients.read', 'patients.write'],
        'all',
      ),
      true,
    );
    assert.equal(
      evaluatePermissionRequirement(
        grants,
        ['patients.read', 'appointments.manage'],
        'all',
      ),
      false,
    );
  });

  it('evaluates ANY mode requirements', () => {
    const grants = ['patients.read'];
    assert.equal(
      evaluatePermissionRequirement(
        grants,
        ['patients.read', 'appointments.manage'],
        'any',
      ),
      true,
    );
    assert.equal(
      evaluatePermissionRequirement(
        grants,
        ['appointments.manage', 'users.write'],
        'any',
      ),
      false,
    );
  });

  it('resolves physician role permissions from the synced frontend matrix', () => {
    const effective = resolveEffectivePermissions({ role: 'physician' });
    assert.equal(
      hasPermission(effective.effective, 'patients.read', effective.denies),
      true,
    );
    assert.equal(
      hasPermission(
        effective.effective,
        'medications.prescribe',
        effective.denies,
      ),
      true,
    );
    assert.equal(
      hasPermission(effective.effective, 'iam.admin', effective.denies),
      false,
    );
  });

  it('grants platform admin access to tenant-scoped admin permissions', () => {
    const effective = resolveEffectivePermissions({ role: 'platform_admin' });
    assert.equal(
      hasPermission(effective.effective, 'platform.admin', effective.denies),
      true,
    );
    assert.equal(
      hasPermission(effective.effective, 'iam.admin', effective.denies),
      true,
    );
  });
});
