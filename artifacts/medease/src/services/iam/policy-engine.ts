import { evaluateAbac } from '@/services/iam/abac-engine';
import { evaluateRbac } from '@/services/iam/rbac-engine';
import type { AbacContext, IamPolicy } from '@/services/iam/types';

export function evaluateAccess(
  userRoles: string[],
  requiredPermission: string,
  policies: IamPolicy[],
  context: AbacContext,
  roleNames: string[],
): 'allow' | 'deny' {
  const denyPolicy = policies.find(
    (p) => p.effect === 'deny' && p.enabled && evaluateAbac(p, context),
  );
  if (denyPolicy) return 'deny';
  if (evaluateRbac(userRoles, requiredPermission, roleNames)) return 'allow';
  const allowPolicy = policies.find(
    (p) => p.effect === 'allow' && p.enabled && evaluateAbac(p, context),
  );
  return allowPolicy ? 'allow' : 'deny';
}
