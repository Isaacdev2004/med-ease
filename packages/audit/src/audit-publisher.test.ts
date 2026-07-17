import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  runWithRequestContext,
  createBaseRequestContext,
} from '@medease/observability';
import type { QueueJobEnvelope } from '@medease/queue';

import { AuditEvents } from './audit-events';
import { auditContextForAuth, SYSTEM_ACTOR_ID } from './audit-context';
import { AuditPublisher } from './audit-publisher';
import type { AuditRecordPayload } from './audit-types';

describe('AuditPublisher', () => {
  it('enqueues domain events with request context fields', async () => {
    const enqueued: Array<{
      jobName: string;
      envelope: QueueJobEnvelope<AuditRecordPayload>;
    }> = [];

    const publisher = new AuditPublisher(async (jobName, envelope) => {
      enqueued.push({ jobName, envelope });
    });

    await runWithRequestContext(
      {
        ...createBaseRequestContext({
          requestId: 'req-1',
          correlationId: 'corr-1',
        }),
        tenantId: 'tenant-a',
        userId: 'user-a',
        organizationId: 'org-a',
        roles: ['platform_admin'],
        permissions: ['iam.admin'],
      },
      async () => {
        await publisher.publish(
          AuditEvents.roleAssigned({
            action: 'assign_role',
            resourceType: 'role',
            resourceId: 'role-1',
            tenantId: 'tenant-a',
          }),
        );
      },
    );

    assert.equal(enqueued.length, 1);
    assert.equal(enqueued[0]?.jobName, 'RoleAssigned');
    assert.equal(enqueued[0]?.envelope.correlationId, 'corr-1');
    assert.equal(enqueued[0]?.envelope.requestId, 'req-1');
    assert.equal(enqueued[0]?.envelope.actorId, 'user-a');
    assert.equal(enqueued[0]?.envelope.payload.kind, 'iam_audit_log');
    assert.equal(enqueued[0]?.envelope.payload.action, 'assign_role');
  });

  it('supports auth context overrides before tenant ALS is set', async () => {
    const enqueued: QueueJobEnvelope<AuditRecordPayload>[] = [];
    const publisher = new AuditPublisher(async (_jobName, envelope) => {
      enqueued.push(envelope);
    });

    await publisher.publish(
      AuditEvents.userLoggedIn(
        {
          tenantId: 'tenant-b',
          userId: 'user-b',
          sessionId: 'session-b',
          ipAddress: '127.0.0.1',
        },
        auditContextForAuth({
          tenantId: 'tenant-b',
          userId: 'user-b',
          sessionId: 'session-b',
          correlationId: 'corr-auth',
          requestId: 'req-auth',
          ipAddress: '127.0.0.1',
        }),
      ),
    );

    assert.equal(enqueued[0]?.correlationId, 'corr-auth');
    assert.equal(enqueued[0]?.payload.kind, 'security_event');
    assert.equal(enqueued[0]?.payload.eventType, 'login_success');
    assert.equal(enqueued[0]?.actorId, 'user-b');
  });

  it('falls back to system actor when context is missing', async () => {
    const enqueued: QueueJobEnvelope<AuditRecordPayload>[] = [];
    const publisher = new AuditPublisher(async (_jobName, envelope) => {
      enqueued.push(envelope);
    });

    await publisher.publish(
      AuditEvents.userLoginFailed({ metadata: { email: 'a@b.com' } }),
    );

    assert.equal(enqueued[0]?.actorId, SYSTEM_ACTOR_ID);
    assert.equal(enqueued[0]?.payload.eventType, 'login_failure');
  });
});
