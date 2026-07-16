import { useAuth } from '@/services/auth/auth-context';
import type { PublicHealthPermissions } from '@/services/public-health/types';

export function usePublicHealthPermissions(): PublicHealthPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('publicHealth.read'),
    canWrite: permissions.includes('publicHealth.write'),
    canSurveillance: permissions.includes('publicHealth.surveillance'),
    canOutbreaks: permissions.includes('publicHealth.outbreaks'),
    canImmunizations: permissions.includes('publicHealth.immunizations'),
    canCommunity: permissions.includes('publicHealth.community'),
    canSdoh: permissions.includes('publicHealth.sdoh'),
    canAnalytics: permissions.includes('publicHealth.analytics'),
    canExport: permissions.includes('publicHealth.export'),
    canShare: permissions.includes('publicHealth.share'),
    canAdmin: permissions.includes('publicHealth.admin'),
  };
}
