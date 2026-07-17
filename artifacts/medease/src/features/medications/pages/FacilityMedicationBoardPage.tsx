import { useLocation } from 'wouter';

import { MedicationsShell } from '@/features/medications/components/MedicationsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type FacilitySegment =
  | 'medications'
  | 'emar'
  | 'administration'
  | 'medication-board'
  | 'medication-administration';

function resolveFacilitySegment(location: string): FacilitySegment {
  if (location.includes('/emar')) return 'emar';
  if (
    location.includes('/administration') ||
    location.includes('medication-administration')
  )
    return 'administration';
  if (location.includes('/medications')) return 'medications';
  if (location.includes('medication-board')) return 'medication-board';
  return 'medications';
}

export default function FacilityMedicationBoardPage() {
  const [location] = useLocation();
  const segment = resolveFacilitySegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<FacilitySegment, string> = {
    medications: 'Ward Medications',
    emar: 'Electronic Medication Administration Record',
    administration: 'Medication Administration',
    'medication-board': 'Ward Medication Board',
    'medication-administration': 'Medication Administration',
  };
  return (
    <MedicationsShell
      basePath={basePath}
      variant="facility"
      title={titles[segment]}
    />
  );
}
