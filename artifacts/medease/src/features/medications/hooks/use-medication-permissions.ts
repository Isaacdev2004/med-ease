import { useAuth } from '@/services/auth/auth-context';

export interface MedicationPermissions {
  canView: boolean;
  canPrescribe: boolean;
  canDispense: boolean;
  canAdminister: boolean;
  canRefill: boolean;
  canExport: boolean;
  canShare: boolean;
  canViewAnalytics: boolean;
  canAdmin: boolean;
}

export function useMedicationPermissions(): MedicationPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('medications.read'),
    canPrescribe:
      permissions.includes('medications.prescribe') ||
      permissions.includes('medications.write'),
    canDispense: permissions.includes('medications.dispense'),
    canAdminister: permissions.includes('medications.administer'),
    canRefill: permissions.includes('medications.refill'),
    canExport: permissions.includes('medications.export'),
    canShare: permissions.includes('medications.share'),
    canViewAnalytics:
      permissions.includes('medications.analytics') ||
      permissions.includes('reports.export'),
    canAdmin: permissions.includes('medications.admin'),
  };
}
