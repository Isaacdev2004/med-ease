/** Where the audit worker persists the record. */
export type AuditRecordKind = 'audit_log' | 'iam_audit_log' | 'security_event';

export type AuditOutcome = 'success' | 'failure';

export type AuditActionName =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'BREAK_GLASS'
  | 'LOGIN'
  | 'LOGOUT';

export type SecurityEventTypeName =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'token_refresh'
  | 'token_reuse_detected'
  | 'session_revoked'
  | 'account_locked'
  | 'account_unlocked'
  | 'password_changed';

/** Payload written by the audit worker — no PHI values in metadata. */
export interface AuditRecordPayload {
  kind: AuditRecordKind;
  outcome?: AuditOutcome;
  /** IAM-style action slug (create_user) or enum name (CREATE). */
  action?: string;
  auditAction?: AuditActionName;
  resourceType?: string;
  resourceId?: string;
  patientId?: string;
  tenantId?: string;
  facilityId?: string;
  actorId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  eventType?: SecurityEventTypeName;
  userId?: string;
  sessionId?: string;
}

export interface AuditContext {
  tenantId: string;
  organizationId?: string;
  facilityId?: string;
  departmentId?: string;
  correlationId: string;
  requestId?: string;
  actorId?: string;
  sessionId?: string;
  roles?: string[];
  permissions?: string[];
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditDomainEvent {
  /** Immutable domain event name, e.g. UserLoggedIn, RoleAssigned. */
  eventType: string;
  payload: AuditRecordPayload;
  /** Override ALS context (auth flows before tenant context is set). */
  context?: Partial<AuditContext>;
}
