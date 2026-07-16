import { useAuth } from '@/services/auth/auth-context';

export interface AppointmentPermissions {
  canView: boolean;
  canBook: boolean;
  canManage: boolean;
  canCheckIn: boolean;
  canManageSchedule: boolean;
  canViewAnalytics: boolean;
  canManageQueue: boolean;
}

export function useAppointmentPermissions(): AppointmentPermissions {
  const { user, permissions } = useAuth();
  const role = user?.role;
  const hasManage = permissions.includes('appointments.manage');

  if (role === 'patient') {
    return {
      canView: hasManage,
      canBook: hasManage,
      canManage: false,
      canCheckIn: false,
      canManageSchedule: false,
      canViewAnalytics: false,
      canManageQueue: false,
    };
  }

  if (role === 'physician') {
    return {
      canView: hasManage,
      canBook: hasManage,
      canManage: hasManage,
      canCheckIn: hasManage,
      canManageSchedule: hasManage,
      canViewAnalytics: hasManage,
      canManageQueue: hasManage,
    };
  }

  if (role === 'facility_admin') {
    return {
      canView: permissions.includes('patients.read'),
      canBook: permissions.includes('patients.write'),
      canManage: permissions.includes('patients.write'),
      canCheckIn: permissions.includes('patients.write'),
      canManageSchedule: permissions.includes('patients.write'),
      canViewAnalytics: permissions.includes('reports.export'),
      canManageQueue: permissions.includes('patients.write'),
    };
  }

  if (role === 'platform_admin') {
    return {
      canView: hasManage,
      canBook: hasManage,
      canManage: hasManage,
      canCheckIn: hasManage,
      canManageSchedule: hasManage,
      canViewAnalytics: permissions.includes('reports.export'),
      canManageQueue: hasManage,
    };
  }

  return {
    canView: false,
    canBook: false,
    canManage: false,
    canCheckIn: false,
    canManageSchedule: false,
    canViewAnalytics: false,
    canManageQueue: false,
  };
}
