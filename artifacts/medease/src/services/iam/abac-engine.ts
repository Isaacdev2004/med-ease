import type { AbacContext, IamPolicy } from '@/services/iam/types';

export type { AbacContext };

export function evaluateAbac(policy: IamPolicy, context: AbacContext): boolean {
  if (!policy.enabled) return false;
  if (
    policy.conditions?.includes('business_hours') &&
    (context.timeOfDay ?? 12) < 8
  )
    return false;
  if (
    policy.conditions?.includes('tenant_match') &&
    policy.tenantId &&
    policy.tenantId !== context.tenantId
  )
    return false;
  return policy.effect === 'allow';
}

export function policyMatchesResource(
  policy: IamPolicy,
  resource: string,
  action: string,
): boolean {
  return (
    policy.resource === '*' ||
    (policy.resource === resource &&
      (policy.action === '*' || policy.action === action))
  );
}
