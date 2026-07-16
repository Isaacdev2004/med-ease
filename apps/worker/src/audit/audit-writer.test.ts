import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { AuditRecordPayload } from '@medease/audit';
import type { QueueJobEnvelope } from '@medease/queue';

import { isIamAuditAction, persistAuditRecord } from './audit-writer.js';

describe('audit-writer', () => {
  it('recognizes IAM audit action slugs', () => {
    assert.equal(isIamAuditAction('assign_role'), true);
    assert.equal(isIamAuditAction('READ'), false);
  });

  it('routes security_event payloads to securityEvent.create', async () => {
    const calls: string[] = [];
    const tx = {
      securityEvent: {
        create: async () => {
          calls.push('security_event');
        },
      },
      iamAuditLog: { create: async () => calls.push('iam_audit_log') },
      auditLog: { create: async () => calls.push('audit_log') },
    };

    const envelope = {
      id: 'env-1',
      tenantId: 'tenant-1',
      correlationId: 'corr-1',
      source: 'medease-api',
      eventType: 'UserLoggedIn',
      createdAt: new Date().toISOString(),
      actorId: 'user-1',
      payload: {
        kind: 'security_event',
        eventType: 'login_success',
        userId: 'user-1',
      } satisfies AuditRecordPayload,
    } satisfies QueueJobEnvelope<AuditRecordPayload>;

    await persistAuditRecord(tx as never, envelope);
    assert.deepEqual(calls, ['security_event']);
  });

  it('routes iam_audit_log payloads to iamAuditLog.create', async () => {
    const calls: string[] = [];
    const tx = {
      securityEvent: { create: async () => calls.push('security_event') },
      iamAuditLog: {
        create: async () => {
          calls.push('iam_audit_log');
        },
      },
      auditLog: { create: async () => calls.push('audit_log') },
    };

    const envelope = {
      id: 'env-2',
      tenantId: 'tenant-1',
      correlationId: 'corr-2',
      source: 'medease-api',
      eventType: 'RoleAssigned',
      createdAt: new Date().toISOString(),
      actorId: 'admin-1',
      payload: {
        kind: 'iam_audit_log',
        action: 'assign_role',
        resourceType: 'role',
        resourceId: 'role-1',
      } satisfies AuditRecordPayload,
    } satisfies QueueJobEnvelope<AuditRecordPayload>;

    await persistAuditRecord(tx as never, envelope);
    assert.deepEqual(calls, ['iam_audit_log']);
  });
});
