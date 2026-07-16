import type { Permission } from '@/config/permissions/permissions';
import type { PortalId } from '@/config/routes';
import type { UserRole } from '@/types/auth';

export type { Permission } from '@/config/permissions/permissions';
export {
  ALL_PERMISSIONS,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '@/config/permissions/permissions';
export {
  getPermissionsForRole,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
} from '@/config/permissions/role-permissions';
export {
  getPortalForRole,
  getRoleForPortal,
  portalRoleMap,
} from '@/config/permissions/portal-roles';

/** Maps each role to its primary portal. MVP roles are mutually exclusive. */
export const rolePortalAccess: Record<UserRole, PortalId> = {
  platform_admin: 'admin',
  facility_admin: 'facility',
  physician: 'professional',
  pharmacist: 'pharmacy',
  transport_dispatcher: 'transport',
  patient: 'patient',
};

export function canAccessPortal(role: UserRole, portalId: PortalId): boolean {
  return rolePortalAccess[role] === portalId;
}

/** Feature-to-permission requirements for authorization checks. */
export const featurePermissions: Record<string, Permission[]> = {
  bedManagement: ['beds.manage'],
  patientProfile: ['patients.read'],
  patientWrite: ['patients.write'],
  reportsExport: ['reports.export'],
  settingsManage: ['settings.manage'],
  userManagement: ['users.read'],
};
