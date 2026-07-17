import { useLocation } from 'wouter';

import { DocumentShell } from '@/features/documents/components/DocumentShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'documents' | 'my-documents' | 'templates' | 'signatures';

function resolveSegment(location: string): Segment {
  if (location.includes('/my-documents')) return 'my-documents';
  if (location.includes('/templates')) return 'templates';
  if (location.includes('/signatures')) return 'signatures';
  return 'documents';
}

const TITLES: Record<Segment, string> = {
  documents: 'Documents',
  'my-documents': 'My Documents',
  templates: 'Templates',
  signatures: 'Signatures',
};

export default function ProfessionalDocumentsPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <DocumentShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
