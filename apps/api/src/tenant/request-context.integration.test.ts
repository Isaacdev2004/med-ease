import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { JwtAccessPayload } from '@medease/auth';
import {
  createBaseRequestContext,
  getRequestContext,
  requireTenantId,
  runWithRequestContext,
} from '@medease/observability';

import { TenantResolver } from './tenant.resolver';
import { RequestContextService } from './request-context.service';

const sampleJwt: JwtAccessPayload = {
  sub: 'user-123',
  email: 'doctor@medease.health',
  role: 'physician',
  tenantId: 'tenant-abc',
  organizationId: 'org-abc',
  facilityId: 'facility-abc',
  permissions: ['patients.read'],
  sessionId: 'session-abc',
  deviceTrust: false,
};

describe('Tenant request context integration', () => {
  it('populates tenant context after JWT resolution', () => {
    const requestContext = new RequestContextService();
    const tenantResolver = new TenantResolver(requestContext);

    runWithRequestContext(
      createBaseRequestContext({ requestId: 'req-1', correlationId: 'corr-1' }),
      () => {
        tenantResolver.applyFromJwt(sampleJwt);

        const ctx = getRequestContext();
        assert.equal(ctx?.requestId, 'req-1');
        assert.equal(ctx?.correlationId, 'corr-1');
        assert.equal(ctx?.userId, 'user-123');
        assert.equal(ctx?.tenantId, 'tenant-abc');
        assert.equal(requireTenantId(), 'tenant-abc');
        assert.deepEqual(ctx?.roles, ['physician']);
        assert.deepEqual(ctx?.permissions, ['patients.read']);
      },
    );
  });

  it('leaves tenant unset for unauthenticated base context', () => {
    runWithRequestContext(
      createBaseRequestContext({ requestId: 'req-2', correlationId: 'corr-2' }),
      () => {
        const ctx = getRequestContext();
        assert.equal(ctx?.tenantId, undefined);
        assert.equal(ctx?.userId, undefined);
      },
    );
  });

  it('preserves correlation id when mapping to queue envelope fields', async () => {
    const { envelopeFieldsFromRequestContext } = await import('@medease/observability');

    runWithRequestContext(
      createBaseRequestContext({ requestId: 'req-3', correlationId: 'corr-3' }),
      () => {
        const requestContext = new RequestContextService();
        const tenantResolver = new TenantResolver(requestContext);
        tenantResolver.applyFromJwt(sampleJwt);

        const envelope = envelopeFieldsFromRequestContext(
          requestContext.require(),
          'api',
          'patient.created',
          { id: 'patient-1' },
        );

        assert.equal(envelope.correlationId, 'corr-3');
        assert.equal(envelope.requestId, 'req-3');
        assert.equal(envelope.tenantId, 'tenant-abc');
        assert.equal(envelope.actorId, 'user-123');
      },
    );
  });
});
