import { useAuth } from '@/services/auth/auth-context';

export interface PatientRecordPermissions {
  canView: boolean;
  canWrite: boolean;
  canUpdateVitals: boolean;
  canViewMedicationsOnly: boolean;
  canExport: boolean;
}

export function usePatientRecordPermissions(): PatientRecordPermissions {
  const { user, permissions } = useAuth();
  const role = user?.role;

  if (role === 'patient') {
    return {
      canView: permissions.includes('patients.read'),
      canWrite: false,
      canUpdateVitals: false,
      canViewMedicationsOnly: false,
      canExport: false,
    };
  }

  if (role === 'pharmacist') {
    return {
      canView: permissions.includes('patients.read'),
      canWrite: false,
      canUpdateVitals: false,
      canViewMedicationsOnly: true,
      canExport: false,
    };
  }

  if (role === 'physician') {
    return {
      canView: permissions.includes('patients.read'),
      canWrite: permissions.includes('patients.write'),
      canUpdateVitals: permissions.includes('patients.write'),
      canViewMedicationsOnly: false,
      canExport: permissions.includes('reports.export'),
    };
  }

  if (role === 'facility_admin') {
    return {
      canView: permissions.includes('patients.read'),
      canWrite: permissions.includes('patients.write'),
      canUpdateVitals: permissions.includes('patients.write'),
      canViewMedicationsOnly: false,
      canExport: permissions.includes('reports.export'),
    };
  }

  if (role === 'platform_admin') {
    return {
      canView: permissions.includes('patients.read'),
      canWrite: false,
      canUpdateVitals: false,
      canViewMedicationsOnly: false,
      canExport: permissions.includes('reports.export'),
    };
  }

  return {
    canView: false,
    canWrite: false,
    canUpdateVitals: false,
    canViewMedicationsOnly: false,
    canExport: false,
  };
}
