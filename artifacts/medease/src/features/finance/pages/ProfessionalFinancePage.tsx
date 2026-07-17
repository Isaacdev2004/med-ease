import { useLocation } from 'wouter';

import { FinanceShell } from '@/features/finance/components/FinanceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'finance' | 'finance-revenue' | 'finance-expenses';

function resolveSegment(location: string): Segment {
  if (location.includes('/finance-revenue')) return 'finance-revenue';
  if (location.includes('/finance-expenses')) return 'finance-expenses';
  return 'finance';
}

const TITLES: Record<Segment, string> = {
  finance: 'Finance Overview',
  'finance-revenue': 'Revenue',
  'finance-expenses': 'Expenses',
};

export default function ProfessionalFinancePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <FinanceShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
