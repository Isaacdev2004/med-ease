import { useAuth } from '@/services/auth/auth-context';
import type { InteropPermissions } from '@/services/interoperability/types';

export function useInteropPermissions(): InteropPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('interop.read'),
    canWrite: permissions.includes('interop.write'),
    canManageFhir: permissions.includes('interop.fhir'),
    canManageHl7: permissions.includes('interop.hl7'),
    canManageDicom: permissions.includes('interop.dicom'),
    canManageApi: permissions.includes('interop.api'),
    canManageMapping: permissions.includes('interop.mapping'),
    canViewAudit: permissions.includes('interop.audit'),
    canViewAnalytics: permissions.includes('interop.analytics'),
    canExport: permissions.includes('interop.export'),
    canShare: permissions.includes('interop.share'),
    canAdmin: permissions.includes('interop.admin'),
  };
}
