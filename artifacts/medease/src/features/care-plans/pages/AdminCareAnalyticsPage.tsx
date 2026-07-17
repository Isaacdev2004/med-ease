import { useLocation } from 'wouter';

import { CarePlansShell } from '@/features/care-plans/components/CarePlansShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function AdminCareAnalyticsPage() {
  const [location] = useLocation();
  const segment = location.includes('care-analytics')
    ? 'care-analytics'
    : location.includes('population-health')
      ? 'population-health'
      : location.includes('care-quality')
        ? 'care-quality'
        : 'care-plans';
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<string, string> = {
    'care-plans': 'Care Plan Catalog',
    'care-quality': 'Care Quality Metrics',
    'population-health': 'Population Health',
    'care-analytics': 'Care Analytics',
  };
  return (
    <CarePlansShell
      basePath={basePath}
      variant="admin"
      title={titles[segment] ?? 'Care Analytics'}
    />
  );
}
