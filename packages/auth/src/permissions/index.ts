export {
  ALL_PERMISSIONS,
  hasAllPermissions as catalogHasAllPermissions,
  hasAnyPermission as catalogHasAnyPermission,
  hasPermission as catalogHasPermission,
  type Permission,
} from './catalog';

export { ROLE_DENY_RULES, getDenyRulesForRole } from './deny-rules';

export {
  PermissionEngine,
  defaultPermissionEngine,
  evaluatePermissionRequirement,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  normalizePermission,
  permissionMatches,
  resolveEffectivePermissions,
} from './engine';

export { ROLE_HIERARCHY, ROLE_PERMISSIONS, getPermissionsForRole } from './role-permissions';

export type {
  AbacPolicy,
  AuthorizationResource,
  AuthorizationSubject,
  EffectivePermissionSet,
  PermissionMode,
  PermissionRequirement,
  PolicyDecision,
  PolicyEvaluationContext,
} from './types';

/** @deprecated Use resolveEffectivePermissions / PermissionEngine instead. */
export function expandPermissions(permissions: string[]): string[] {
  if (permissions.includes('*')) {
    return ['*'];
  }
  return permissions;
}
