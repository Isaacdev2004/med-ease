export {
  type AuthErrorCode,
  type AuthSessionDto,
  type AuthUserDto,
  type AuthUserStatus,
  AUTH_ERROR_CODES,
  type IdentityRole,
  type JwtAccessPayload,
  type LoginResultDto,
  mapUserStatusToFrontend,
  type OrganizationDto,
  REFRESH_COOKIE_NAME,
} from './types';

export {
  generateRefreshToken,
  hashPassword,
  hashRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from './password';

export {
  ALL_PERMISSIONS,
  PermissionEngine,
  ROLE_DENY_RULES,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  defaultPermissionEngine,
  evaluatePermissionRequirement,
  expandPermissions,
  getDenyRulesForRole,
  getPermissionsForRole,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  normalizePermission,
  permissionMatches,
  resolveEffectivePermissions,
  type AbacPolicy,
  type AuthorizationResource,
  type AuthorizationSubject,
  type EffectivePermissionSet,
  type Permission,
  type PermissionMode,
  type PermissionRequirement,
  type PolicyDecision,
  type PolicyEvaluationContext,
} from './permissions';

export { parseDurationToMs, parseDurationToSeconds } from './duration';
