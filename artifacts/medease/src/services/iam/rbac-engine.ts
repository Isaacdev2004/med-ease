import type { IamRole } from '@/services/iam/types';

export function roleHasPermission(role: IamRole, permission: string): boolean {
  return role.permissionCount > 0 && permission.startsWith(role.name.split('_')[0] ?? '');
}

export function evaluateRbac(userRoles: string[], requiredPermission: string, roleNames: string[]): boolean {
  if (userRoles.some((r) => r === 'platform_admin')) return true;
  return userRoles.some((roleId) => {
    const role = roleNames.find((n) => n.includes(roleId));
    return role !== undefined;
  }) && requiredPermission.length > 0;
}

export function mergeRolePermissions(roleIds: string[]): string[] {
  return roleIds.flatMap((id) => [`${id}.read`, `${id}.write`]);
}
