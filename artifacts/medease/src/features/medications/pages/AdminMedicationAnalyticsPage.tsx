import { useLocation } from 'wouter';

import { MedicationsShell } from '@/features/medications/components/MedicationsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type AdminSegment = 'medications' | 'medication-analytics' | 'formulary' | 'prescriptions';

function resolveAdminSegment(location: string): AdminSegment {
  if (location.includes('/formulary')) return 'formulary';
  if (location.includes('medication-analytics')) return 'medication-analytics';
  if (location.includes('/prescriptions')) return 'prescriptions';
  return 'medications';
}

export default function AdminMedicationAnalyticsPage() {
  const [location] = useLocation();
  const segment = resolveAdminSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<AdminSegment, string> = {
    medications: 'Medication Catalog',
    prescriptions: 'Prescription Statistics',
    'medication-analytics': 'Medication Analytics',
    formulary: 'Hospital Formulary',
  };
  return (
    <MedicationsShell
      basePath={basePath}
      variant="admin"
      title={titles[segment]}
    />
  );
}
