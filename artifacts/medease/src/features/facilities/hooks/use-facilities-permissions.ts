import { useAuth } from '@/services/auth/auth-context';
import type { FacilitiesPermissions } from '@/services/facilities/types';

export function useFacilitiesPermissions(): FacilitiesPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('facilities.read'),
    canWrite: permissions.includes('facilities.write'),
    canManageMaintenance: permissions.includes('facilities.maintenance'),
    canManageCalibration: permissions.includes('facilities.calibration'),
    canManageInspection: permissions.includes('facilities.inspection'),
    canManageUtilities: permissions.includes('facilities.utilities'),
    canManageAssets: permissions.includes('facilities.assets'),
    canViewAnalytics: permissions.includes('facilities.analytics'),
    canExport: permissions.includes('facilities.export'),
    canShare: permissions.includes('facilities.share'),
    canAdmin: permissions.includes('facilities.admin'),
  };
}
