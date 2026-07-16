import { mergeRequestContext, type RequestContext } from '../context';

/** JWT access-token claims used to populate tenant request context. */
export interface JwtTenantClaims {
  sub: string;
  tenantId: string;
  organizationId: string;
  facilityId?: string;
  sessionId?: string;
  role: string;
  permissions: string[];
}

export function tenantContextFromJwt(
  payload: JwtTenantClaims,
  ids?: Pick<RequestContext, 'requestId' | 'correlationId'>,
): Partial<RequestContext> {
  return {
    requestId: ids?.requestId,
    correlationId: ids?.correlationId,
    userId: payload.sub,
    tenantId: payload.tenantId,
    organizationId: payload.organizationId,
    facilityId: payload.facilityId,
    sessionId: payload.sessionId,
    roles: [payload.role],
    permissions: payload.permissions,
  };
}

export function applyTenantContextFromJwt(
  payload: JwtTenantClaims,
  ids?: Pick<RequestContext, 'requestId' | 'correlationId'>,
): RequestContext | undefined {
  return mergeRequestContext(tenantContextFromJwt(payload, ids));
}

export interface JobEnvelopeContextSource {
  tenantId: string;
  facilityId?: string;
  correlationId: string;
  requestId?: string;
  actorId?: string;
  organizationId?: string;
  roles?: string[];
  permissions?: string[];
  sessionId?: string;
  departmentId?: string;
}

export function requestContextFromJobEnvelope(
  envelope: JobEnvelopeContextSource,
): RequestContext {
  return {
    requestId: envelope.requestId ?? envelope.correlationId,
    correlationId: envelope.correlationId,
    userId: envelope.actorId,
    tenantId: envelope.tenantId,
    organizationId: envelope.organizationId,
    facilityId: envelope.facilityId,
    departmentId: envelope.departmentId,
    sessionId: envelope.sessionId,
    roles: envelope.roles ?? [],
    permissions: envelope.permissions ?? [],
  };
}

export function envelopeFieldsFromRequestContext(
  context: RequestContext,
  source: string,
  eventType: string,
  payload: unknown,
) {
  return {
    tenantId: context.tenantId ?? '00000000-0000-7000-8000-000000000001',
    organizationId: context.organizationId,
    facilityId: context.facilityId,
    departmentId: context.departmentId,
    correlationId: context.correlationId,
    requestId: context.requestId,
    actorId: context.userId,
    sessionId: context.sessionId,
    roles: context.roles,
    permissions: context.permissions,
    source,
    eventType,
    payload,
  };
}
