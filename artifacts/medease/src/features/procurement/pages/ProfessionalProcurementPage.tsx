import { useLocation } from 'wouter';

import { ProcurementShell } from '@/features/procurement/components/ProcurementShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type ProfessionalSegment = 'procurement' | 'requests';

function resolveSegment(location: string): ProfessionalSegment {
  if (location.includes('/requests')) return 'requests';
  return 'procurement';
}

export default function ProfessionalProcurementPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<ProfessionalSegment, string> = {
    procurement: 'Department Procurement',
    requests: 'Purchase Requests',
  };
  return (
    <ProcurementShell
      basePath={basePath}
      variant="professional"
      title={titles[segment]}
    />
  );
}
