import { createDomainEvent, type DomainEvent, type DomainEventContext } from '../domain-event';

export const UserEventType = {
  UserCreated: 'UserCreated',
  UserAccountLocked: 'UserAccountLocked',
  UserAccountUnlocked: 'UserAccountUnlocked',
  RoleAssigned: 'RoleAssigned',
  RoleRemoved: 'RoleRemoved',
  PolicyCreated: 'PolicyCreated',
  MfaEnabled: 'MfaEnabled',
  MfaDisabled: 'MfaDisabled',
  SessionRevoked: 'SessionRevoked',
  OAuthClientCreated: 'OAuthClientCreated',
  ApiKeyRotated: 'ApiKeyRotated',
  ConsentGranted: 'ConsentGranted',
  ConsentRevoked: 'ConsentRevoked',
  AccessDelegated: 'AccessDelegated',
  BreakGlassStarted: 'BreakGlassStarted',
  BreakGlassEnded: 'BreakGlassEnded',
  DataExported: 'DataExported',
  EntityShared: 'EntityShared',
  UserLoggedIn: 'UserLoggedIn',
  UserLoginFailed: 'UserLoginFailed',
  UserLoggedOut: 'UserLoggedOut',
  TokenRefreshed: 'TokenRefreshed',
  AccountLocked: 'AccountLocked',
} as const;

export type UserEventTypeName = (typeof UserEventType)[keyof typeof UserEventType];

export type ResourceEventPayload = {
  resourceType: string;
  resourceId: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
};

export type AuthEventPayload = {
  tenantId?: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
};

export type ExportEventPayload = {
  resourceType: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
};

function resourceEvent(
  type: UserEventTypeName,
  payload: ResourceEventPayload,
  context?: DomainEventContext,
): DomainEvent {
  return createDomainEvent(type, payload, {
    ...context,
    tenantId: context?.tenantId ?? payload.tenantId,
  });
}

function authEvent(
  type: UserEventTypeName,
  payload: AuthEventPayload,
  context?: DomainEventContext,
): DomainEvent {
  return createDomainEvent(type, payload, {
    ...context,
    tenantId: context?.tenantId ?? payload.tenantId,
    userId: context?.userId ?? payload.userId,
  });
}

/** User and IAM domain events. */
export const UserEvents = {
  userCreated: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.UserCreated, payload, context),

  userAccountLocked: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.UserAccountLocked, payload, context),

  userAccountUnlocked: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.UserAccountUnlocked, payload, context),

  roleAssigned: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.RoleAssigned, payload, context),

  roleRemoved: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.RoleRemoved, payload, context),

  policyCreated: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.PolicyCreated, payload, context),

  mfaEnabled: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.MfaEnabled, payload, context),

  mfaDisabled: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.MfaDisabled, payload, context),

  sessionRevoked: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.SessionRevoked, payload, context),

  oauthClientCreated: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.OAuthClientCreated, payload, context),

  apiKeyRotated: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.ApiKeyRotated, payload, context),

  consentGranted: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.ConsentGranted, payload, context),

  consentRevoked: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.ConsentRevoked, payload, context),

  accessDelegated: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.AccessDelegated, payload, context),

  breakGlassStarted: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.BreakGlassStarted, payload, context),

  breakGlassEnded: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.BreakGlassEnded, payload, context),

  dataExported: (payload: ExportEventPayload, context?: DomainEventContext) =>
    createDomainEvent(UserEventType.DataExported, payload, {
      ...context,
      tenantId: context?.tenantId ?? payload.tenantId,
    }),

  entityShared: (payload: ResourceEventPayload, context?: DomainEventContext) =>
    resourceEvent(UserEventType.EntityShared, payload, context),

  userLoggedIn: (payload: AuthEventPayload, context?: DomainEventContext) =>
    authEvent(UserEventType.UserLoggedIn, payload, context),

  userLoginFailed: (payload: AuthEventPayload, context?: DomainEventContext) =>
    authEvent(UserEventType.UserLoginFailed, payload, context),

  userLoggedOut: (payload: AuthEventPayload, context?: DomainEventContext) =>
    authEvent(UserEventType.UserLoggedOut, payload, context),

  tokenRefreshed: (payload: AuthEventPayload, context?: DomainEventContext) =>
    authEvent(UserEventType.TokenRefreshed, payload, context),

  accountLocked: (payload: AuthEventPayload, context?: DomainEventContext) =>
    authEvent(UserEventType.AccountLocked, payload, context),
};
