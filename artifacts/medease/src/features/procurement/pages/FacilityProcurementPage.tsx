import { useLocation } from 'wouter';

import { ProcurementShell } from '@/features/procurement/components/ProcurementShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type FacilitySegment = 'procurement' | 'receiving' | 'deliveries';

function resolveSegment(location: string): FacilitySegment {
  if (location.includes('/receiving')) return 'receiving';
  if (location.includes('/deliveries')) return 'deliveries';
  return 'procurement';
}

export default function FacilityProcurementPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<FacilitySegment, string> = {
    procurement: 'Facility Procurement',
    receiving: 'Goods Receiving',
    deliveries: 'Deliveries',
  };
  return (
    <ProcurementShell
      basePath={basePath}
      variant="facility"
      title={titles[segment]}
      department="facility"
    />
  );
}
