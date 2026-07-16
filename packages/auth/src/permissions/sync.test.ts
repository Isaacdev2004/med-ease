import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import type { IdentityRole } from '../types';
import { ALL_PERMISSIONS } from './catalog';
import { ROLE_PERMISSIONS, getPermissionsForRole } from './role-permissions';

const repoRoot = join(__dirname, '../../../..');
const frontendPermissionsPath = join(
  repoRoot,
  'artifacts/medease/src/config/permissions/permissions.ts',
);
const frontendRolePermissionsPath = join(
  repoRoot,
  'artifacts/medease/src/config/permissions/role-permissions.ts',
);

const ROLES: IdentityRole[] = [
  'platform_admin',
  'facility_admin',
  'physician',
  'pharmacist',
  'transport_dispatcher',
  'patient',
];

function extractQuotedPermissions(source: string): string[] {
  const matches = source.matchAll(/'([a-zA-Z0-9.*-]+)'/g);
  return [...matches]
    .map((match) => match[1])
    .filter((value) => value.includes('.') || value === '*');
}

function extractRolePermissions(source: string, role: IdentityRole): string[] {
  const match = source.match(new RegExp(`${role}:\\s*\\[([\\s\\S]*?)\\],`));
  if (!match) {
    return [];
  }

  return extractQuotedPermissions(match[1]);
}

describe('Frontend permission synchronization', () => {
  it('keeps ALL_PERMISSIONS aligned with the frozen frontend catalog', () => {
    const frontendSource = readFileSync(frontendPermissionsPath, 'utf8');
    const frontendPermissions = new Set(extractQuotedPermissions(frontendSource));
    const backendPermissions = new Set(ALL_PERMISSIONS);

    const missingInBackend = [...frontendPermissions].filter(
      (permission) => !backendPermissions.has(permission as (typeof ALL_PERMISSIONS)[number]),
    );
    const extraInBackend = [...backendPermissions].filter((permission) => !frontendPermissions.has(permission));

    assert.deepEqual(missingInBackend, [], `Missing in backend: ${missingInBackend.join(', ')}`);
    assert.deepEqual(extraInBackend, [], `Extra in backend: ${extraInBackend.join(', ')}`);
  });

  it('keeps ROLE_PERMISSIONS aligned with the frozen frontend matrix', () => {
    const frontendSource = readFileSync(frontendRolePermissionsPath, 'utf8');

    for (const role of ROLES) {
      const frontendPermissions = extractRolePermissions(frontendSource, role);
      const backendPermissions = getPermissionsForRole(role);
      assert.deepEqual(
        [...backendPermissions].sort(),
        [...frontendPermissions].sort(),
        `Role mismatch: ${role}`,
      );
    }
  });

  it('only assigns known catalog permissions to roles', () => {
    const catalog = new Set<string>(ALL_PERMISSIONS);

    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      for (const permission of permissions) {
        assert.equal(
          catalog.has(permission as (typeof ALL_PERMISSIONS)[number]),
          true,
          `Unknown permission "${permission}" on role "${role}"`,
        );
      }
    }
  });
});
