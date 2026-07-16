import { useLocation } from 'wouter';

import { ResearchShell } from '@/features/research/components/ResearchShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'research' | 'clinical-trials' | 'participants' | 'study-visits' | 'adverse-events' | 'biospecimens';

function resolveSegment(location: string): Segment {
  if (location.includes('/clinical-trials')) return 'clinical-trials';
  if (location.includes('/participants')) return 'participants';
  if (location.includes('/study-visits')) return 'study-visits';
  if (location.includes('/adverse-events')) return 'adverse-events';
  if (location.includes('/biospecimens')) return 'biospecimens';
  return 'research';
}

const TITLES: Record<Segment, string> = {
  research: 'Research Overview',
  'clinical-trials': 'Clinical Trials',
  participants: 'Research Participants',
  'study-visits': 'Study Visits',
  'adverse-events': 'Adverse Events',
  biospecimens: 'Biospecimens',
};

export default function ProfessionalResearchPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <ResearchShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} />;
}
