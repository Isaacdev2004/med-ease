import type { AuditRecordPayload, AuditActionName } from '@medease/audit';
import type { QueueJobEnvelope } from '@medease/queue';
import { newId } from '@medease/uuid';
import type { Prisma, TransactionClient } from '@medease/prisma';

const IAM_ACTIONS = new Set([
  'create_user',
  'lock_account',
  'unlock_account',
  'assign_role',
  'remove_role',
  'create_policy',
  'enable_mfa',
  'disable_mfa',
  'revoke_session',
  'create_oauth_client',
  'rotate_api_key',
  'grant_consent',
  'revoke_consent',
  'delegate_access',
  'start_break_glass',
  'end_break_glass',
  'share',
]);

function resolveAuditAction(payload: AuditRecordPayload): AuditActionName {
  if (payload.auditAction) {
    return payload.auditAction;
  }

  const normalized = payload.action?.toUpperCase();
  if (
    normalized === 'CREATE' ||
    normalized === 'READ' ||
    normalized === 'UPDATE' ||
    normalized === 'DELETE' ||
    normalized === 'EXPORT' ||
    normalized === 'BREAK_GLASS' ||
    normalized === 'LOGIN' ||
    normalized === 'LOGOUT'
  ) {
    return normalized;
  }

  if (
    payload.action === 'start_break_glass' ||
    payload.action === 'end_break_glass'
  ) {
    return 'BREAK_GLASS';
  }

  if (
    payload.eventType === 'login_success' ||
    payload.eventType === 'login_failure'
  ) {
    return 'LOGIN';
  }

  if (payload.eventType === 'logout') {
    return 'LOGOUT';
  }

  return 'UPDATE';
}

export async function persistAuditRecord(
  tx: TransactionClient,
  envelope: QueueJobEnvelope<AuditRecordPayload>,
): Promise<void> {
  const payload = envelope.payload;
  const actorId = payload.actorId ?? envelope.actorId ?? newId();
  const tenantId = payload.tenantId ?? envelope.tenantId;

  switch (payload.kind) {
    case 'security_event': {
      if (!payload.eventType) {
        throw new Error('security_event payload requires eventType');
      }

      await tx.securityEvent.create({
        data: {
          id: newId(),
          tenantId:
            tenantId === envelope.tenantId ? tenantId : payload.tenantId,
          userId: payload.userId ?? envelope.actorId,
          sessionId: payload.sessionId ?? envelope.sessionId,
          eventType: payload.eventType,
          ipAddress: payload.ipAddress,
          userAgent: payload.userAgent,
          metadata: payload.metadata as Prisma.InputJsonValue | undefined,
        },
      });
      return;
    }

    case 'iam_audit_log': {
      if (!payload.action || !payload.resourceType || !payload.resourceId) {
        throw new Error(
          'iam_audit_log payload requires action, resourceType, and resourceId',
        );
      }

      await tx.iamAuditLog.create({
        data: {
          id: newId(),
          tenantId,
          action: payload.action,
          actorId,
          resourceType: payload.resourceType,
          resourceId: payload.resourceId,
          outcome: payload.outcome ?? 'success',
          ipAddress: payload.ipAddress,
        },
      });
      return;
    }

    case 'audit_log': {
      if (!payload.resourceType) {
        throw new Error('audit_log payload requires resourceType');
      }

      await tx.auditLog.create({
        data: {
          id: newId(),
          tenantId,
          facilityId: payload.facilityId ?? envelope.facilityId,
          actorId,
          action: resolveAuditAction(payload),
          resourceType: payload.resourceType,
          resourceId: payload.resourceId,
          patientId: payload.patientId,
          ipAddress: payload.ipAddress,
          userAgent: payload.userAgent,
          requestId: envelope.requestId,
          outcome: payload.outcome ?? 'success',
          metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue,
        },
      });
      return;
    }

    default:
      throw new Error(
        `Unknown audit record kind: ${(payload as AuditRecordPayload).kind}`,
      );
  }
}

export function isIamAuditAction(action: string | undefined): boolean {
  return action ? IAM_ACTIONS.has(action) : false;
}
