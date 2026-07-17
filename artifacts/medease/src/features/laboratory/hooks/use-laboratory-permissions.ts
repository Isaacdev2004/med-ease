import { useAuth } from '@/services/auth/auth-context';

export interface LaboratoryPermissions {
  canView: boolean;
  canOrder: boolean;
  canCancel: boolean;
  canCollectSpecimen: boolean;
  canVerify: boolean;
  canApprove: boolean;
  canRelease: boolean;
  canExport: boolean;
  canShare: boolean;
  canViewAnalytics: boolean;
  canAdmin: boolean;
}

export function useLaboratoryPermissions(): LaboratoryPermissions {
  const { permissions } = useAuth();
  const canRead = permissions.includes('laboratory.read');
  const canWrite = permissions.includes('laboratory.write');
  const canVerify = permissions.includes('laboratory.verify');
  const canApprove = permissions.includes('laboratory.approve');
  const canExport = permissions.includes('laboratory.export');
  const canShare = permissions.includes('laboratory.share');
  const canAdmin = permissions.includes('laboratory.admin');

  return {
    canView: canRead,
    canOrder: canWrite,
    canCancel: canWrite,
    canCollectSpecimen: canWrite,
    canVerify: canVerify || canWrite,
    canApprove: canApprove || canWrite,
    canRelease: canApprove || canWrite,
    canExport: canExport,
    canShare: canShare,
    canViewAnalytics:
      canRead && (canAdmin || permissions.includes('reports.export')),
    canAdmin: canAdmin,
  };
}
