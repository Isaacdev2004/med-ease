import { useLocation } from 'wouter';

import { CommandCenterShell } from '@/features/executive/components/CommandCenterShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'executive' | 'enterprise-dashboard' | 'enterprise-kpis' | 'benchmarking' | 'strategic-initiatives' | 'executive-analytics' | 'executive-forecasting' | 'enterprise-alerts';

function resolveSegment(location: string): Segment {
  if (location.includes('/enterprise-dashboard')) return 'enterprise-dashboard';
  if (location.includes('/enterprise-kpis')) return 'enterprise-kpis';
  if (location.includes('/benchmarking')) return 'benchmarking';
  if (location.includes('/strategic-initiatives')) return 'strategic-initiatives';
  if (location.includes('/executive-analytics')) return 'executive-analytics';
  if (location.includes('/executive-forecasting')) return 'executive-forecasting';
  if (location.includes('/enterprise-alerts')) return 'enterprise-alerts';
  return 'executive';
}

const TITLES: Record<Segment, string> = {
  executive: 'Executive Hub',
  'enterprise-dashboard': 'Enterprise Dashboard',
  'enterprise-kpis': 'Enterprise KPIs',
  benchmarking: 'Benchmarking',
  'strategic-initiatives': 'Strategic Initiatives',
  'executive-analytics': 'Executive Analytics',
  'executive-forecasting': 'Executive Forecasting',
  'enterprise-alerts': 'Enterprise Alerts',
};

export default function AdminExecutivePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <CommandCenterShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
