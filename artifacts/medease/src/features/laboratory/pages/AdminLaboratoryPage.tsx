import { useLocation } from 'wouter';

import { LaboratoryShell } from '@/features/laboratory/components/LaboratoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function AdminLaboratoryPage() {
  const [location] = useLocation();
  const segment = location.includes('laboratory/analytics')
    ? 'laboratory/analytics'
    : location.includes('laboratory/reports')
      ? 'laboratory/reports'
      : location.includes('laboratory/quality')
        ? 'laboratory/quality'
        : 'laboratory';
  const basePath = resolveModuleBasePath(location, segment.startsWith('laboratory/') ? segment : 'laboratory');
  const titles: Record<string, string> = {
    laboratory: 'Laboratory Catalog',
    'laboratory/analytics': 'Laboratory Analytics',
    'laboratory/reports': 'Laboratory Reports',
    'laboratory/quality': 'Quality Indicators',
  };
  return <LaboratoryShell basePath={basePath} variant="admin" title={titles[segment] ?? 'Laboratory'} />;
}
