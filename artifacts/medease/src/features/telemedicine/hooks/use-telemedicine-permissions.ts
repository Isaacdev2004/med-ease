import { useAuth } from '@/services/auth/auth-context';
import type { TelemedicinePermissions } from '@/services/telemedicine/types';

export function useTelemedicinePermissions(): TelemedicinePermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('telemedicine.read'),
    canWrite: permissions.includes('telemedicine.write'),
    canJoin: permissions.includes('telemedicine.join'),
    canHost: permissions.includes('telemedicine.host'),
    canRecord: permissions.includes('telemedicine.record'),
    canChat: permissions.includes('telemedicine.chat'),
    canUploadFiles: permissions.includes('telemedicine.files'),
    canExport: permissions.includes('telemedicine.export'),
    canViewAnalytics: permissions.includes('telemedicine.analytics'),
    canAdmin: permissions.includes('telemedicine.admin'),
  };
}
