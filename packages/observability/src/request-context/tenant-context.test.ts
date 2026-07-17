import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createBaseRequestContext,
  getRequestContext,
  requireTenantId,
  runWithRequestContext,
} from '../context';
import { applyTenantContextFromJwt, requestContextFromJobEnvelope } from './tenant-context';

describe('RequestContext', () => {
  it('creates base context for unauthenticated requests', () => {
    runWithRequestContext(
      createBaseRequestContext({ requestId: 'req-1', correlationId: 'corr-1' }),
      () => {
        const ctx = getRequestContext();
        assert.equal(ctx?.requestId, 'req-1');
        assert.equal(ctx?.tenantId, undefined);
        assert.throws(() => requireTenantId());
      },
    );
  });

  it('merges tenant context from JWT payload', () => {
    runWithRequestContext(
      createBaseRequestContext({ requestId: 'req-1', correlationId: 'corr-1' }),
      () => {
        applyTenantContextFromJwt({
          sub: 'user-1',
          tenantId: 'tenant-1',
          organizationId: 'org-1',
          permissions: ['patients.read'],
          sessionId: 'session-1',
          role: 'physician',
        });

        const ctx = getRequestContext();
        assert.equal(ctx?.userId, 'user-1');
        assert.equal(ctx?.tenantId, 'tenant-1');
        assert.equal(requireTenantId(), 'tenant-1');
        assert.deepEqual(ctx?.roles, ['physician']);
      },
    );
  });

  it('maps queue envelope fields to request context', () => {
    const ctx = requestContextFromJobEnvelope({
      tenantId: 'tenant-1',
      correlationId: 'corr-job',
      requestId: 'req-job',
      actorId: 'user-1',
      facilityId: 'facility-1',
    });

    assert.equal(ctx.tenantId, 'tenant-1');
    assert.equal(ctx.correlationId, 'corr-job');
    assert.equal(ctx.userId, 'user-1');
  });
});
