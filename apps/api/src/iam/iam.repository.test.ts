import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ALL_PERMISSIONS } from '@medease/auth';
import { toPaginatedResult } from '@medease/prisma';

import {
  matchQ,
  mapUserStatus,
  permissionModule,
  toContractPaginated,
} from './iam.helpers';
import { mapPermission, mapPolicy, mapSession, mapUser } from './iam.mapper';

describe('iam.helpers', () => {
  it('matchQ returns true when query is empty', () => {
    assert.equal(matchQ(undefined, 'Alice', 'bob@example.com'), true);
  });

  it('matchQ matches case-insensitively', () => {
    assert.equal(matchQ('ALICE', 'Alice Smith'), true);
    assert.equal(matchQ('zzz', 'Alice Smith'), false);
  });

  it('toContractPaginated strips totalPages', () => {
    const result = toContractPaginated(
      toPaginatedResult([{ id: '1' }], 1, 1, 25),
    );
    assert.deepEqual(result, {
      items: [{ id: '1' }],
      total: 1,
      page: 1,
      pageSize: 25,
    });
    assert.equal('totalPages' in result, false);
  });

  it('mapUserStatus maps known prisma statuses', () => {
    assert.equal(mapUserStatus('active'), 'active');
    assert.equal(mapUserStatus('locked'), 'locked');
    assert.equal(mapUserStatus('pending'), 'pending');
  });

  it('permissionModule derives module prefix', () => {
    assert.equal(permissionModule('iam.read'), 'iam');
    assert.equal(permissionModule('patients.write'), 'patients');
  });
});

describe('iam.mapper permissions', () => {
  it('paginates ALL_PERMISSIONS consistently with mapper', () => {
    const mapped = ALL_PERMISSIONS.map((name, index) =>
      mapPermission(name, index),
    );
    assert.equal(mapped.length, ALL_PERMISSIONS.length);
    assert.equal(mapped[0]?.name, ALL_PERMISSIONS[0]);
    assert.equal(mapped[0]?.module, permissionModule(ALL_PERMISSIONS[0]!));
  });
});

describe('iam.mapper entities', () => {
  it('mapUser combines identity role and assignments', () => {
    const user = mapUser({
      id: '11111111-1111-1111-1111-111111111111',
      tenantId: '22222222-2222-2222-2222-222222222222',
      organizationId: '33333333-3333-3333-3333-333333333333',
      email: 'user@example.com',
      passwordHash: 'hash',
      fullName: 'Test User',
      role: 'physician',
      status: 'active',
      locale: 'en-US',
      timezone: 'UTC',
      avatarUrl: null,
      facilityId: null,
      mfaEnabled: true,
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date('2026-07-16T10:00:00.000Z'),
      createdAt: new Date('2026-07-01T10:00:00.000Z'),
      updatedAt: new Date('2026-07-16T10:00:00.000Z'),
      roleAssignments: [
        {
          userId: '11111111-1111-1111-1111-111111111111',
          roleId: '44444444-4444-4444-4444-444444444444',
          assignedAt: new Date(),
          role: {
            id: '44444444-4444-4444-4444-444444444444',
            name: 'Custom Role',
            description: '',
            tenantId: null,
            isSystem: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
    });

    assert.equal(user.userId, '11111111-1111-1111-1111-111111111111');
    assert.equal(user.displayName, 'Test User');
    assert.deepEqual(user.roles, [
      'physician',
      '44444444-4444-4444-4444-444444444444',
      'Custom Role',
    ]);
    assert.equal(user.mfaEnabled, true);
  });

  it('mapSession maps prisma session fields', () => {
    const session = mapSession({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      userId: '11111111-1111-1111-1111-111111111111',
      tenantId: '22222222-2222-2222-2222-222222222222',
      deviceId: 'device-1',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
      status: 'revoked',
      refreshFamilyId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      rememberMe: false,
      startedAt: new Date('2026-07-16T08:00:00.000Z'),
      lastActivityAt: new Date('2026-07-16T09:00:00.000Z'),
      expiresAt: new Date('2026-07-16T12:00:00.000Z'),
      revokedAt: new Date('2026-07-16T09:30:00.000Z'),
    });

    assert.equal(session.sessionId, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    assert.equal(session.status, 'revoked');
    assert.equal(session.ipAddress, '127.0.0.1');
  });

  it('mapPolicy maps json conditions to string array', () => {
    const policy = mapPolicy({
      id: 'pol-1',
      tenantId: null,
      name: 'Policy',
      description: 'desc',
      effect: 'allow',
      resource: 'iam/*',
      action: 'read',
      conditions: ['business_hours'],
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    assert.deepEqual(policy.conditions, ['business_hours']);
    assert.equal(policy.policyId, 'pol-1');
  });
});
