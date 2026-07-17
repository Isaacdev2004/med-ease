import { useLocation } from 'wouter';

import { MedicationsShell } from '@/features/medications/components/MedicationsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

const PHARMACY_SEGMENTS = [
  'medications',
  'dispensing',
  'refills',
  'interactions',
  'inventory',
  'prescriptions',
] as const;

function resolvePharmacySegment(
  location: string,
): (typeof PHARMACY_SEGMENTS)[number] {
  for (const segment of PHARMACY_SEGMENTS) {
    if (location.includes(`/${segment}`)) return segment;
  }
  return 'medications';
}

export default function PharmacyPrescriptionsPage() {
  const [location] = useLocation();
  const segment = resolvePharmacySegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<(typeof PHARMACY_SEGMENTS)[number], string> = {
    medications: 'Pharmacy Medications',
    prescriptions: 'Incoming Prescriptions',
    refills: 'Refill Requests',
    dispensing: 'Dispensing Queue',
    interactions: 'Drug Interactions',
    inventory: 'Pharmacy Inventory',
  };
  return (
    <MedicationsShell
      basePath={basePath}
      variant="pharmacy"
      title={titles[segment]}
    />
  );
}
