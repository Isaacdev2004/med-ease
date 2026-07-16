import { useLocation } from 'wouter';

import { LaboratoryShell } from '@/features/laboratory/components/LaboratoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function FacilityLaboratoryPage() {
  const [location] = useLocation();
  const segment = location.includes('verification')
    ? 'verification'
    : location.includes('specimens')
      ? 'specimens'
      : location.includes('/orders')
        ? 'orders'
        : location.includes('/results')
          ? 'results'
          : 'laboratory';
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<string, string> = {
    laboratory: 'Laboratory Queue',
    specimens: 'Specimen Tracking',
    orders: 'Lab Orders',
    results: 'Results Release',
    verification: 'Result Verification',
  };
  return <LaboratoryShell basePath={basePath} variant="facility" title={titles[segment] ?? 'Laboratory'} />;
}
