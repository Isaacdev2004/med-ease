import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toPrismaRequestContext } from './request-context';

describe('toPrismaRequestContext', () => {
  it('returns null when tenantId is missing', () => {
    assert.equal(
      toPrismaRequestContext({
        requestId: 'req-1',
        correlationId: 'corr-1',
        roles: [],
        permissions: [],
      }),
      null,
    );
  });

  it('maps tenant context fields for platform.set_request_context', () => {
    assert.deepEqual(
      toPrismaRequestContext({
        requestId: 'req-1',
        correlationId: 'corr-1',
        tenantId: 'tenant-1',
        userId: 'user-1',
        facilityId: 'facility-1',
        roles: ['physician'],
        permissions: ['patients.read'],
      }),
      {
        tenantId: 'tenant-1',
        facilityId: 'facility-1',
        userId: 'user-1',
        role: 'physician',
      },
    );
  });
});
