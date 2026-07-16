import type { PortalId } from '@/config/routes';
import type { UserRole } from '@/types/auth';
import { rolePortalAccess } from '@/config/permissions';

export const portalRoleMap: Record<PortalId, UserRole> = {
  patient: 'patient',
  professional: 'physician',
  facility: 'facility_admin',
  pharmacy: 'pharmacist',
  transport: 'transport_dispatcher',
  admin: 'platform_admin',
};

export function getRoleForPortal(portalId: PortalId): UserRole {
  return portalRoleMap[portalId];
}

export function getPortalForRole(role: UserRole): PortalId {
  return rolePortalAccess[role];
}
