import { envelopeFieldsFromRequestContext, getRequestContext, type RequestContext } from '@medease/observability';
import { PLATFORM_TENANT_ID, type CreateEnvelopeInput } from '@medease/queue';
import { newId } from '@medease/uuid';

import type { AuditContext, AuditDomainEvent, AuditRecordPayload } from './audit-types';

export const SYSTEM_ACTOR_ID = '00000000-0000-7000-8000-000000000099';

export function auditContextFromRequest(
  partial?: Partial<AuditContext>,
): AuditContext {
  const request = getRequestContext();
  const base = request ? requestContextToAuditContext(request) : fallbackAuditContext();

  return {
    ...base,
    ...partial,
    tenantId: partial?.tenantId ?? base.tenantId,
    correlationId: partial?.correlationId ?? base.correlationId,
    actorId: partial?.actorId ?? base.actorId ?? SYSTEM_ACTOR_ID,
  };
}

export function auditContextForAuth(input: {
  tenantId?: string;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}): AuditContext {
  const request = getRequestContext();

  return {
    tenantId: input.tenantId ?? request?.tenantId ?? PLATFORM_TENANT_ID,
    organizationId: request?.organizationId,
    facilityId: request?.facilityId,
    departmentId: request?.departmentId,
    correlationId: input.correlationId ?? request?.correlationId ?? newId(),
    requestId: input.requestId ?? request?.requestId,
    actorId: input.userId ?? request?.userId ?? SYSTEM_ACTOR_ID,
    sessionId: input.sessionId ?? request?.sessionId,
    roles: request?.roles ?? [],
    permissions: request?.permissions ?? [],
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  };
}

export function envelopeInputFromAuditEvent(
  source: string,
  event: AuditDomainEvent,
): CreateEnvelopeInput<AuditRecordPayload> {
  const context = event.context
    ? auditContextFromRequest(event.context)
    : auditContextFromRequest();

  const requestContext: RequestContext = {
    requestId: context.requestId ?? context.correlationId,
    correlationId: context.correlationId,
    userId: context.actorId,
    tenantId: context.tenantId,
    organizationId: context.organizationId,
    facilityId: context.facilityId,
    departmentId: context.departmentId,
    sessionId: context.sessionId,
    roles: context.roles ?? [],
    permissions: context.permissions ?? [],
  };

  const envelope = envelopeFieldsFromRequestContext(
    requestContext,
    source,
    event.eventType,
    {
      ...event.payload,
      ipAddress: event.payload.ipAddress ?? context.ipAddress,
      userAgent: event.payload.userAgent ?? context.userAgent,
      tenantId: event.payload.tenantId ?? context.tenantId,
      facilityId: event.payload.facilityId ?? context.facilityId,
      actorId: event.payload.actorId ?? context.actorId,
    },
  );

  return envelope as CreateEnvelopeInput<AuditRecordPayload>;
}

function requestContextToAuditContext(request: RequestContext): AuditContext {
  return {
    tenantId: request.tenantId ?? PLATFORM_TENANT_ID,
    organizationId: request.organizationId,
    facilityId: request.facilityId,
    departmentId: request.departmentId,
    correlationId: request.correlationId,
    requestId: request.requestId,
    actorId: request.userId,
    sessionId: request.sessionId,
    roles: request.roles,
    permissions: request.permissions,
  };
}

function fallbackAuditContext(): AuditContext {
  return {
    tenantId: PLATFORM_TENANT_ID,
    correlationId: newId(),
    actorId: SYSTEM_ACTOR_ID,
    roles: [],
    permissions: [],
  };
}
