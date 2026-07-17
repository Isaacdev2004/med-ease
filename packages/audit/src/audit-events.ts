import type {
  AuditContext,
  AuditDomainEvent,
  SecurityEventTypeName,
} from './audit-types';

type IamAuditInput = {
  action: string;
  resourceType: string;
  resourceId: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
};

function iamAuditEvent(
  eventType: string,
  input: IamAuditInput,
  context?: Partial<AuditContext>,
): AuditDomainEvent {
  return {
    eventType,
    context,
    payload: {
      kind: 'iam_audit_log',
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      tenantId: input.tenantId,
      outcome: 'success',
      metadata: input.metadata,
    },
  };
}

function securityEvent(
  eventType: string,
  securityEventType: SecurityEventTypeName,
  input: {
    tenantId?: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  },
  context?: Partial<AuditContext>,
): AuditDomainEvent {
  return {
    eventType,
    context,
    payload: {
      kind: 'security_event',
      eventType: securityEventType,
      tenantId: input.tenantId,
      userId: input.userId,
      sessionId: input.sessionId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata: input.metadata,
      outcome: securityEventType === 'login_failure' ? 'failure' : 'success',
    },
  };
}

/** Factory functions for immutable domain audit events. */
export const AuditEvents = {
  userLoggedIn: (
    input: Parameters<typeof securityEvent>[2],
    context?: Partial<AuditContext>,
  ) => securityEvent('UserLoggedIn', 'login_success', input, context),

  userLoginFailed: (
    input: Parameters<typeof securityEvent>[2],
    context?: Partial<AuditContext>,
  ) => securityEvent('UserLoginFailed', 'login_failure', input, context),

  userLoggedOut: (
    input: Parameters<typeof securityEvent>[2],
    context?: Partial<AuditContext>,
  ) => securityEvent('UserLoggedOut', 'logout', input, context),

  tokenRefreshed: (
    input: Parameters<typeof securityEvent>[2],
    context?: Partial<AuditContext>,
  ) => securityEvent('TokenRefreshed', 'token_refresh', input, context),

  accountLocked: (
    input: Parameters<typeof securityEvent>[2],
    context?: Partial<AuditContext>,
  ) => securityEvent('AccountLocked', 'account_locked', input, context),

  userCreated: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent('UserCreated', input, context),

  accountLockedIam: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'AccountLocked',
      { ...input, action: 'lock_account' },
      context,
    ),

  accountUnlocked: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'AccountUnlocked',
      { ...input, action: 'unlock_account' },
      context,
    ),

  roleAssigned: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent('RoleAssigned', { ...input, action: 'assign_role' }, context),

  roleRemoved: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent('RoleRemoved', { ...input, action: 'remove_role' }, context),

  policyCreated: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'PolicyCreated',
      { ...input, action: 'create_policy' },
      context,
    ),

  mfaEnabled: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent('MfaEnabled', { ...input, action: 'enable_mfa' }, context),

  mfaDisabled: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent('MfaDisabled', { ...input, action: 'disable_mfa' }, context),

  sessionRevoked: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'SessionRevoked',
      { ...input, action: 'revoke_session' },
      context,
    ),

  oauthClientCreated: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'OAuthClientCreated',
      { ...input, action: 'create_oauth_client' },
      context,
    ),

  apiKeyRotated: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'ApiKeyRotated',
      { ...input, action: 'rotate_api_key' },
      context,
    ),

  consentGranted: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'ConsentGranted',
      { ...input, action: 'grant_consent' },
      context,
    ),

  consentRevoked: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'ConsentRevoked',
      { ...input, action: 'revoke_consent' },
      context,
    ),

  accessDelegated: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'AccessDelegated',
      { ...input, action: 'delegate_access' },
      context,
    ),

  breakGlassStarted: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'BreakGlassStarted',
      { ...input, action: 'start_break_glass' },
      context,
    ),

  breakGlassEnded: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent(
      'BreakGlassEnded',
      { ...input, action: 'end_break_glass' },
      context,
    ),

  entityShared: (input: IamAuditInput, context?: Partial<AuditContext>) =>
    iamAuditEvent('EntityShared', { ...input, action: 'share' }, context),

  /** Clinical patient audit events (Epic 3). */
  patientViewed: (input: {
    patientId: string;
    resourceType: string;
    resourceId?: string;
    tenantId?: string;
    facilityId?: string;
  }) =>
    ({
      eventType: 'PatientViewed',
      payload: {
        kind: 'audit_log',
        auditAction: 'READ',
        action: 'READ',
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        patientId: input.patientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  patientRegistered: (input: {
    patientId: string;
    tenantId?: string;
    facilityId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'PatientRegistered',
      payload: {
        kind: 'audit_log',
        auditAction: 'CREATE',
        action: 'register_patient',
        resourceType: 'patient',
        resourceId: input.patientId,
        patientId: input.patientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        metadata: input.metadata,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  patientUpdated: (input: {
    patientId: string;
    tenantId?: string;
    facilityId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'PatientUpdated',
      payload: {
        kind: 'audit_log',
        auditAction: 'UPDATE',
        action: 'update_patient',
        resourceType: 'patient',
        resourceId: input.patientId,
        patientId: input.patientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        metadata: input.metadata,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  patientArchived: (input: {
    patientId: string;
    tenantId?: string;
    facilityId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'PatientArchived',
      payload: {
        kind: 'audit_log',
        auditAction: 'UPDATE',
        action: 'archive_patient',
        resourceType: 'patient',
        resourceId: input.patientId,
        patientId: input.patientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        metadata: input.metadata,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  patientRestored: (input: {
    patientId: string;
    tenantId?: string;
    facilityId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'PatientRestored',
      payload: {
        kind: 'audit_log',
        auditAction: 'UPDATE',
        action: 'restore_patient',
        resourceType: 'patient',
        resourceId: input.patientId,
        patientId: input.patientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        metadata: input.metadata,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  patientMerged: (input: {
    sourcePatientId: string;
    targetPatientId: string;
    tenantId?: string;
    facilityId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'PatientMerged',
      payload: {
        kind: 'audit_log',
        auditAction: 'UPDATE',
        action: 'merge_patient',
        resourceType: 'patient',
        resourceId: input.targetPatientId,
        patientId: input.targetPatientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        metadata: {
          ...input.metadata,
          sourcePatientId: input.sourcePatientId,
          targetPatientId: input.targetPatientId,
        },
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  patientAllergyAdded: (input: {
    patientId: string;
    tenantId?: string;
    facilityId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'PatientAllergyAdded',
      payload: {
        kind: 'audit_log',
        auditAction: 'CREATE',
        action: 'add_patient_allergy',
        resourceType: 'patient_allergy',
        resourceId: input.patientId,
        patientId: input.patientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        metadata: input.metadata,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  patientPreferenceUpdated: (input: {
    patientId: string;
    tenantId?: string;
    facilityId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'PatientPreferenceUpdated',
      payload: {
        kind: 'audit_log',
        auditAction: 'UPDATE',
        action: 'update_patient_preference',
        resourceType: 'patient_preference',
        resourceId: input.patientId,
        patientId: input.patientId,
        tenantId: input.tenantId,
        facilityId: input.facilityId,
        metadata: input.metadata,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,

  dataExported: (input: {
    resourceType: string;
    resourceId?: string;
    tenantId?: string;
    metadata?: Record<string, unknown>;
  }) =>
    ({
      eventType: 'DataExported',
      payload: {
        kind: 'audit_log',
        auditAction: 'EXPORT',
        action: 'EXPORT',
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        tenantId: input.tenantId,
        metadata: input.metadata,
        outcome: 'success',
      },
    }) satisfies AuditDomainEvent,
};
