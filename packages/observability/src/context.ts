import { AsyncLocalStorage } from 'node:async_hooks';

/** Platform-wide request context — single source of truth per HTTP request or worker job. */
export interface RequestContext {
  requestId: string;
  correlationId: string;
  userId?: string;
  tenantId?: string;
  organizationId?: string;
  facilityId?: string;
  departmentId?: string;
  sessionId?: string;
  roles: string[];
  permissions: string[];
  traceId?: string;
  spanId?: string;
}

/** @deprecated Use RequestContext */
export type ObservabilityContext = Pick<
  RequestContext,
  'requestId' | 'correlationId' | 'traceId' | 'spanId' | 'tenantId' | 'userId'
> & { actorId?: string };

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(
  context: RequestContext,
  fn: () => T,
): T {
  return storage.run(context, fn);
}

/** @deprecated Use runWithRequestContext */
export const runWithContext = runWithRequestContext;

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

/** @deprecated Use getRequestContext */
export const getContext = getRequestContext;

export function mergeRequestContext(
  partial: Partial<RequestContext>,
): RequestContext | undefined {
  const current = storage.getStore();
  if (!current) {
    return undefined;
  }

  Object.assign(current, {
    ...partial,
    roles: partial.roles ?? current.roles,
    permissions: partial.permissions ?? current.permissions,
  });

  return current;
}

export function createBaseRequestContext(input: {
  requestId: string;
  correlationId: string;
}): RequestContext {
  return {
    requestId: input.requestId,
    correlationId: input.correlationId,
    roles: [],
    permissions: [],
  };
}

export function getLogBindings(): Record<string, string | undefined> {
  const ctx = getRequestContext();
  if (!ctx) {
    return {};
  }

  return {
    requestId: ctx.requestId,
    correlationId: ctx.correlationId,
    traceId: ctx.traceId,
    spanId: ctx.spanId,
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    organizationId: ctx.organizationId,
    facilityId: ctx.facilityId,
    departmentId: ctx.departmentId,
    sessionId: ctx.sessionId,
  };
}

export class MissingRequestContextError extends Error {
  constructor(message = 'Request context is not available') {
    super(message);
    this.name = 'MissingRequestContextError';
  }
}

export class MissingTenantContextError extends Error {
  constructor(message = 'Tenant context is not available for this request') {
    super(message);
    this.name = 'MissingTenantContextError';
  }
}

export function requireRequestContext(): RequestContext {
  const ctx = getRequestContext();
  if (!ctx) {
    throw new MissingRequestContextError();
  }
  return ctx;
}

export function requireTenantId(): string {
  const tenantId = getRequestContext()?.tenantId;
  if (!tenantId) {
    throw new MissingTenantContextError();
  }
  return tenantId;
}
