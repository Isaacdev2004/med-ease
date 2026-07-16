import { useLocation } from 'wouter';

import { AiIntelligenceShell } from '@/features/ai-intelligence/components/AiIntelligenceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'ai' | 'operational-forecasting' | 'resource-predictions' | 'capacity-planning';

function resolveSegment(location: string): Segment {
  if (location.includes('/operational-forecasting')) return 'operational-forecasting';
  if (location.includes('/resource-predictions')) return 'resource-predictions';
  if (location.includes('/capacity-planning')) return 'capacity-planning';
  return 'ai';
}

const TITLES: Record<Segment, string> = {
  ai: 'AI Clinical Intelligence',
  'operational-forecasting': 'Operational Forecasting',
  'resource-predictions': 'Resource Predictions',
  'capacity-planning': 'Capacity Planning',
};

export default function FacilityAiIntelligencePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <AiIntelligenceShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} />;
}
