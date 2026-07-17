import { useLocation } from 'wouter';

import { MedicationsShell } from '@/features/medications/components/MedicationsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function PatientMedicationsPage() {
  const [location] = useLocation();
  const basePath = resolveModuleBasePath(location, 'medications');
  return (
    <MedicationsShell
      basePath={basePath}
      variant="patient"
      title="My Medications"
    />
  );
}
