import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { requestContextFromJobEnvelope } from '@medease/observability';

describe('Worker queue context propagation', () => {
  it('preserves correlation and tenant fields from envelope', () => {
    const ctx = requestContextFromJobEnvelope({
      tenantId: 'tenant-worker',
      organizationId: 'org-worker',
      correlationId: 'corr-worker',
      requestId: 'req-worker',
      actorId: 'user-worker',
      roles: ['physician'],
      permissions: ['patients.read'],
    });

    assert.equal(ctx.correlationId, 'corr-worker');
    assert.equal(ctx.requestId, 'req-worker');
    assert.equal(ctx.tenantId, 'tenant-worker');
    assert.equal(ctx.userId, 'user-worker');
    assert.deepEqual(ctx.roles, ['physician']);
  });
});
