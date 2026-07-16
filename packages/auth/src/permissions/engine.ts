import { getDenyRulesForRole } from './deny-rules';
import { getPermissionsForRole } from './role-permissions';
import type { EffectivePermissionSet, PermissionMode } from './types';
import type { IdentityRole } from '../types';

export function normalizePermission(permission: string): string {
  return permission.trim().toLowerCase();
}

/** Returns true when a granted permission satisfies a required permission (supports `*` and `namespace.*`). */
export function permissionMatches(granted: string, required: string): boolean {
  const grant = normalizePermission(granted);
  const need = normalizePermission(required);

  if (grant === '*' || grant === need) {
    return true;
  }

  if (grant.endsWith('.*')) {
    const prefix = grant.slice(0, -1);
    return need.startsWith(prefix);
  }

  return false;
}

export function isDenied(required: string, denies: readonly string[]): boolean {
  return denies.some((deny) => permissionMatches(deny, required));
}

export function hasPermission(grants: readonly string[], required: string, denies: readonly string[] = []): boolean {
  if (isDenied(required, denies)) {
    return false;
  }

  return grants.some((grant) => permissionMatches(grant, required));
}

export function hasAllPermissions(
  grants: readonly string[],
  required: readonly string[],
  denies: readonly string[] = [],
): boolean {
  return required.every((permission) => hasPermission(grants, permission, denies));
}

export function hasAnyPermission(
  grants: readonly string[],
  required: readonly string[],
  denies: readonly string[] = [],
): boolean {
  return required.some((permission) => hasPermission(grants, permission, denies));
}

export function evaluatePermissionRequirement(
  grants: readonly string[],
  required: readonly string[],
  mode: PermissionMode,
  denies: readonly string[] = [],
): boolean {
  if (required.length === 0) {
    return true;
  }

  if (mode === 'any') {
    return hasAnyPermission(grants, required, denies);
  }

  return hasAllPermissions(grants, required, denies);
}

function dedupe(values: string[]): string[] {
  return [...new Set(values.map(normalizePermission))];
}

function applyDenyRules(grants: string[], denies: string[]): string[] {
  return grants.filter((grant) => !denies.some((deny) => permissionMatches(deny, grant)));
}

export function resolveEffectivePermissions(input: {
  role: IdentityRole;
  jwtPermissions?: string[];
  explicitGrants?: string[];
  explicitDenies?: string[];
}): EffectivePermissionSet {
  const roleGrants = getPermissionsForRole(input.role);
  const grants = dedupe([
    ...roleGrants,
    ...(input.jwtPermissions ?? []),
    ...(input.explicitGrants ?? []),
  ]);
  const denies = dedupe([
    ...getDenyRulesForRole(input.role),
    ...(input.explicitDenies ?? []),
  ]);
  const effective = applyDenyRules(grants, denies);

  return {
    role: input.role,
    grants,
    denies,
    effective,
  };
}

export class PermissionEngine {
  resolveEffectivePermissions = resolveEffectivePermissions;

  isAuthorized(
    effective: readonly string[],
    required: string | readonly string[],
    mode: PermissionMode = 'all',
    denies: readonly string[] = [],
  ): boolean {
    const requiredList = typeof required === 'string' ? [required] : [...required];
    return evaluatePermissionRequirement(effective, requiredList, mode, denies);
  }
}

export const defaultPermissionEngine = new PermissionEngine();
