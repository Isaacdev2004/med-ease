import { useLocation } from 'wouter';

import { AiIntelligenceShell } from '@/features/ai-intelligence/components/AiIntelligenceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'ai' | 'model-registry' | 'model-monitoring' | 'model-governance' | 'bias-monitoring' | 'ai-analytics' | 'ai-audit';

function resolveSegment(location: string): Segment {
  if (location.includes('/model-registry')) return 'model-registry';
  if (location.includes('/model-monitoring')) return 'model-monitoring';
  if (location.includes('/model-governance')) return 'model-governance';
  if (location.includes('/bias-monitoring')) return 'bias-monitoring';
  if (location.includes('/ai-analytics')) return 'ai-analytics';
  if (location.includes('/ai-audit')) return 'ai-audit';
  return 'ai';
}

const TITLES: Record<Segment, string> = {
  ai: 'AI Hub',
  'model-registry': 'Model Registry',
  'model-monitoring': 'Model Monitoring',
  'model-governance': 'Model Governance',
  'bias-monitoring': 'Bias Monitoring',
  'ai-analytics': 'AI Analytics',
  'ai-audit': 'AI Audit Log',
};

export default function AdminAiIntelligencePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <AiIntelligenceShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
