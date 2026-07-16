import { useLocation } from 'wouter';

import { ResearchShell } from '@/features/research/components/ResearchShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'research' | 'trials' | 'regulatory' | 'publications' | 'grants' | 'research-analytics' | 'protocols' | 'research-audit';

function resolveSegment(location: string): Segment {
  if (location.includes('/trials')) return 'trials';
  if (location.includes('/regulatory')) return 'regulatory';
  if (location.includes('/publications')) return 'publications';
  if (location.includes('/grants')) return 'grants';
  if (location.includes('/research-analytics')) return 'research-analytics';
  if (location.includes('/protocols')) return 'protocols';
  if (location.includes('/research-audit')) return 'research-audit';
  return 'research';
}

const TITLES: Record<Segment, string> = {
  research: 'Research Hub',
  trials: 'Clinical Trials',
  regulatory: 'Regulatory Submissions',
  publications: 'Publications',
  grants: 'Grant Applications',
  'research-analytics': 'Research Analytics',
  protocols: 'Protocol Management',
  'research-audit': 'Research Audit',
};

export default function AdminResearchPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <ResearchShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
