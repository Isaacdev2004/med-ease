import { useLocation } from 'wouter';

import { WorkflowShell } from '@/features/workflows/components/WorkflowShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'workflows'
  | 'workflow-designer'
  | 'process-library'
  | 'workflow-instances'
  | 'business-rules'
  | 'event-bus'
  | 'background-jobs'
  | 'schedulers'
  | 'workflow-analytics'
  | 'process-monitor';

function resolveSegment(location: string): Segment {
  const paths: Segment[] = [
    'workflow-analytics',
    'process-monitor',
    'background-jobs',
    'workflow-instances',
    'workflow-designer',
    'process-library',
    'business-rules',
    'event-bus',
    'schedulers',
  ];
  for (const p of paths) {
    if (location.includes(`/${p}`)) return p;
  }
  return 'workflows';
}

const TITLES: Record<Segment, string> = {
  workflows: 'Workflow Hub',
  'workflow-designer': 'Workflow Designer',
  'process-library': 'Process Library',
  'workflow-instances': 'Workflow Instances',
  'business-rules': 'Business Rules',
  'event-bus': 'Event Bus',
  'background-jobs': 'Background Jobs',
  schedulers: 'Schedulers',
  'workflow-analytics': 'Workflow Analytics',
  'process-monitor': 'Process Monitor',
};

export default function AdminWorkflowsPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <WorkflowShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
