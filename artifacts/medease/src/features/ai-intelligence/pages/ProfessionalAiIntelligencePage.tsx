import { useLocation } from 'wouter';

import { AiIntelligenceShell } from '@/features/ai-intelligence/components/AiIntelligenceShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'ai'
  | 'clinical-copilot'
  | 'predictions'
  | 'risk-scores'
  | 'clinical-summaries';

function resolveSegment(location: string): Segment {
  if (location.includes('/clinical-copilot')) return 'clinical-copilot';
  if (location.includes('/predictions')) return 'predictions';
  if (location.includes('/risk-scores')) return 'risk-scores';
  if (location.includes('/clinical-summaries')) return 'clinical-summaries';
  return 'ai';
}

const TITLES: Record<Segment, string> = {
  ai: 'AI Clinical Intelligence',
  'clinical-copilot': 'Clinical Copilot',
  predictions: 'Predictive Analytics',
  'risk-scores': 'Risk Scores',
  'clinical-summaries': 'Clinical Summaries',
};

export default function ProfessionalAiIntelligencePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <AiIntelligenceShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
