import { useAuth } from '@/services/auth/auth-context';
import type { QualityPermissions } from '@/services/quality/types';

export function useQualityPermissions(): QualityPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('quality.read'),
    canWrite: permissions.includes('quality.write'),
    canManageIncidents: permissions.includes('quality.incidents'),
    canManageRisks: permissions.includes('quality.risks'),
    canManageCapa: permissions.includes('quality.capa'),
    canManageAudits: permissions.includes('quality.audits'),
    canManageDocuments: permissions.includes('quality.documents'),
    canManageAccreditation: permissions.includes('quality.accreditation'),
    canViewAnalytics: permissions.includes('quality.analytics'),
    canExport: permissions.includes('quality.export'),
    canShare: permissions.includes('quality.share'),
    canAdmin: permissions.includes('quality.admin'),
  };
}
