import { useAuth } from '@/services/auth/auth-context';

export interface RadiologyPermissions {
  canView: boolean;
  canOrder: boolean;
  canReport: boolean;
  canAnnotate: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export function useRadiologyPermissions(): RadiologyPermissions {
  const { user, permissions } = useAuth();
  const role = user?.role;

  const canView = permissions.includes('radiology.read');
  const canWrite = permissions.includes('radiology.write');
  const canReport = permissions.includes('radiology.report');
  const canAnnotate = permissions.includes('radiology.annotate');
  const canExport = permissions.includes('radiology.export');
  const canShare = permissions.includes('radiology.share');
  const canAdmin = permissions.includes('radiology.admin');

  if (role === 'patient') {
    return {
      canView: canView,
      canOrder: false,
      canReport: false,
      canAnnotate: false,
      canExport: canExport,
      canShare: false,
      canAdmin: false,
    };
  }

  if (role === 'physician') {
    return {
      canView: canView,
      canOrder: canWrite,
      canReport: canReport,
      canAnnotate: canAnnotate,
      canExport: canExport,
      canShare: canShare,
      canAdmin: false,
    };
  }

  if (role === 'facility_admin') {
    return {
      canView: canView,
      canOrder: false,
      canReport: canReport,
      canAnnotate: canAnnotate,
      canExport: canExport,
      canShare: canShare,
      canAdmin: false,
    };
  }

  if (role === 'platform_admin') {
    return {
      canView: canView,
      canOrder: canWrite,
      canReport: canReport,
      canAnnotate: canAnnotate,
      canExport: canExport,
      canShare: canShare,
      canAdmin: canAdmin,
    };
  }

  return {
    canView: false,
    canOrder: false,
    canReport: false,
    canAnnotate: false,
    canExport: false,
    canShare: false,
    canAdmin: false,
  };
}
