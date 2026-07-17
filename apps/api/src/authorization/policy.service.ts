import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import {
  type AbacPolicy,
  type AuthorizationResource,
  type AuthorizationSubject,
  type PolicyDecision,
  type PolicyEvaluationContext,
} from '@medease/auth';

export interface PolicyEvaluationResult {
  allowed: boolean;
  reason?: string;
}

const tenantIsolationPolicy: AbacPolicy = {
  name: 'tenant-isolation',
  evaluate({ subject, resource }: PolicyEvaluationContext): PolicyDecision {
    if (!resource?.tenantId) {
      return 'abstain';
    }

    return subject.tenantId === resource.tenantId ? 'allow' : 'deny';
  },
};

const facilityScopePolicy: AbacPolicy = {
  name: 'facility-scope',
  evaluate({ subject, resource }: PolicyEvaluationContext): PolicyDecision {
    if (subject.role === 'platform_admin') {
      return 'allow';
    }

    if (!subject.facilityId || !resource?.facilityId) {
      return 'abstain';
    }

    return subject.facilityId === resource.facilityId ? 'allow' : 'deny';
  },
};

const physicianAssignmentPolicy: AbacPolicy = {
  name: 'physician-assignment',
  evaluate({ subject, resource }: PolicyEvaluationContext): PolicyDecision {
    if (subject.role !== 'physician') {
      return 'abstain';
    }

    if (!resource?.assignedPhysicianId) {
      return 'abstain';
    }

    return resource.assignedPhysicianId === subject.userId ? 'allow' : 'deny';
  },
};

const facilityAdminUserScopePolicy: AbacPolicy = {
  name: 'facility-admin-user-scope',
  evaluate({ subject, resource }: PolicyEvaluationContext): PolicyDecision {
    if (subject.role !== 'facility_admin') {
      return 'abstain';
    }

    if (!resource?.facilityId || !subject.facilityId) {
      return 'abstain';
    }

    return resource.facilityId === subject.facilityId ? 'allow' : 'deny';
  },
};

const DEFAULT_POLICY_NAMES = [
  tenantIsolationPolicy.name,
  facilityScopePolicy.name,
  physicianAssignmentPolicy.name,
  facilityAdminUserScopePolicy.name,
];

@Injectable()
export class PolicyService {
  private readonly registry = new Map<string, AbacPolicy>([
    [tenantIsolationPolicy.name, tenantIsolationPolicy],
    [facilityScopePolicy.name, facilityScopePolicy],
    [physicianAssignmentPolicy.name, physicianAssignmentPolicy],
    [facilityAdminUserScopePolicy.name, facilityAdminUserScopePolicy],
  ]);

  evaluate(
    subject: AuthorizationSubject,
    action: string,
    resource?: AuthorizationResource,
    policyNames: string[] = DEFAULT_POLICY_NAMES,
  ): PolicyEvaluationResult {
    const context: PolicyEvaluationContext = { subject, action, resource };
    let explicitAllow = false;

    for (const name of policyNames) {
      const policy = this.registry.get(name);
      if (!policy) {
        continue;
      }

      const decision = policy.evaluate(context);
      if (decision === 'deny') {
        return { allowed: false, reason: name };
      }

      if (decision === 'allow') {
        explicitAllow = true;
      }
    }

    if (resource && !explicitAllow) {
      return { allowed: true };
    }

    return { allowed: true };
  }

  extractResourceFromRequest(
    request: Request,
  ): AuthorizationResource | undefined {
    const params = request.params ?? {};
    const body = (request.body ?? {}) as Record<string, unknown>;
    const query = (request.query ?? {}) as Record<string, unknown>;

    const resource: AuthorizationResource = {
      tenantId: asString(params.tenantId ?? body.tenantId ?? query.tenantId),
      facilityId: asString(
        params.facilityId ?? body.facilityId ?? query.facilityId,
      ),
      assignedPhysicianId: asString(
        params.assignedPhysicianId ??
          body.assignedPhysicianId ??
          query.assignedPhysicianId,
      ),
      ownerUserId: asString(params.userId ?? body.userId ?? query.userId),
    };

    if (Object.values(resource).every((value) => value === undefined)) {
      return undefined;
    }

    return resource;
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export {
  DEFAULT_POLICY_NAMES,
  facilityAdminUserScopePolicy,
  facilityScopePolicy,
  physicianAssignmentPolicy,
  tenantIsolationPolicy,
};
