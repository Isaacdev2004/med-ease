import { useLocation } from 'wouter';

import { ProcurementShell } from '@/features/procurement/components/ProcurementShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type AdminSegment = 'procurement' | 'purchase-orders' | 'rfqs' | 'contracts' | 'suppliers' | 'budgets' | 'approvals' | 'analytics';

function resolveSegment(location: string): AdminSegment {
  if (location.includes('/purchase-orders')) return 'purchase-orders';
  if (location.includes('/rfqs')) return 'rfqs';
  if (location.includes('/contracts')) return 'contracts';
  if (location.includes('/suppliers')) return 'suppliers';
  if (location.includes('/budgets')) return 'budgets';
  if (location.includes('/approvals')) return 'approvals';
  if (location.includes('/analytics')) return 'analytics';
  return 'procurement';
}

export default function AdminProcurementPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<AdminSegment, string> = {
    procurement: 'Procurement Dashboard',
    'purchase-orders': 'Purchase Orders',
    rfqs: 'RFQs',
    contracts: 'Contracts',
    suppliers: 'Suppliers',
    budgets: 'Budgets',
    approvals: 'Approvals',
    analytics: 'Procurement Analytics',
  };
  return <ProcurementShell basePath={basePath} variant="admin" title={titles[segment]} />;
}
