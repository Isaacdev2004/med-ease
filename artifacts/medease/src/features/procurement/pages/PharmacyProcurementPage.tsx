import { useLocation } from 'wouter';

import { ProcurementShell } from '@/features/procurement/components/ProcurementShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type PharmacySegment = 'procurement' | 'purchase-orders' | 'suppliers';

function resolveSegment(location: string): PharmacySegment {
  if (location.includes('/purchase-orders')) return 'purchase-orders';
  if (location.includes('/suppliers')) return 'suppliers';
  return 'procurement';
}

export default function PharmacyProcurementPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment === 'procurement' ? 'procurement' : segment);
  const titles: Record<PharmacySegment, string> = {
    procurement: 'Pharmacy Procurement',
    'purchase-orders': 'Purchase Orders',
    suppliers: 'Drug Suppliers',
  };
  return <ProcurementShell basePath={basePath} variant="pharmacy" title={titles[segment]} department="pharmacy" />;
}
