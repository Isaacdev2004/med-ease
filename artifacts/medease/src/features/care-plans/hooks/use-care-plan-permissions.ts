import { useAuth } from '@/services/auth/auth-context';

export interface CarePlanPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canAssignTasks: boolean;
  canCompleteTasks: boolean;
  canViewAnalytics: boolean;
  canManagePathways: boolean;
}

export function useCarePlanPermissions(): CarePlanPermissions {
  const { user, permissions } = useAuth();
  const role = user?.role;
  const canRead = permissions.includes('care-plans.read');
  const canWrite = permissions.includes('care-plans.write');

  if (role === 'patient') {
    return {
      canView: canRead,
      canCreate: false,
      canEdit: false,
      canAssignTasks: false,
      canCompleteTasks: canRead,
      canViewAnalytics: false,
      canManagePathways: false,
    };
  }

  if (role === 'physician') {
    return {
      canView: canRead,
      canCreate: canWrite,
      canEdit: canWrite,
      canAssignTasks: canWrite,
      canCompleteTasks: canRead,
      canViewAnalytics: canRead,
      canManagePathways: canRead,
    };
  }

  if (role === 'facility_admin') {
    return {
      canView: canRead,
      canCreate: false,
      canEdit: false,
      canAssignTasks: canWrite,
      canCompleteTasks: canRead,
      canViewAnalytics: permissions.includes('reports.export'),
      canManagePathways: false,
    };
  }

  if (role === 'platform_admin') {
    return {
      canView: canRead,
      canCreate: canWrite,
      canEdit: canWrite,
      canAssignTasks: canWrite,
      canCompleteTasks: canWrite,
      canViewAnalytics: permissions.includes('reports.export'),
      canManagePathways: canWrite,
    };
  }

  return {
    canView: false,
    canCreate: false,
    canEdit: false,
    canAssignTasks: false,
    canCompleteTasks: false,
    canViewAnalytics: false,
    canManagePathways: false,
  };
}
