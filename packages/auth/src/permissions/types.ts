export type PermissionMode = 'all' | 'any';

export type PolicyDecision = 'allow' | 'deny' | 'abstain';

export interface EffectivePermissionSet {
  role: string;
  grants: readonly string[];
  denies: readonly string[];
  effective: readonly string[];
}

export interface AuthorizationSubject {
  userId: string;
  role: string;
  tenantId: string;
  organizationId: string;
  facilityId?: string;
  sessionId?: string;
  permissions?: string[];
}

export interface AuthorizationResource {
  tenantId?: string;
  facilityId?: string;
  assignedPhysicianId?: string;
  ownerUserId?: string;
  [key: string]: unknown;
}

export interface PolicyEvaluationContext {
  subject: AuthorizationSubject;
  action: string;
  resource?: AuthorizationResource;
}

export interface AbacPolicy {
  readonly name: string;
  evaluate(context: PolicyEvaluationContext): PolicyDecision;
}

export interface PermissionRequirement {
  permissions: string[];
  mode: PermissionMode;
  policies?: string[];
}
