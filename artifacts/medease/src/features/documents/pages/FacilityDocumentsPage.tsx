import { useLocation } from 'wouter';

import { DocumentShell } from '@/features/documents/components/DocumentShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'documents' | 'shared-documents' | 'scanning' | 'archive';

function resolveSegment(location: string): Segment {
  if (location.includes('/shared-documents')) return 'shared-documents';
  if (location.includes('/scanning')) return 'scanning';
  if (location.includes('/archive')) return 'archive';
  return 'documents';
}

const TITLES: Record<Segment, string> = {
  documents: 'Documents',
  'shared-documents': 'Shared Documents',
  scanning: 'Scanning & OCR',
  archive: 'Archive',
};

export default function FacilityDocumentsPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <DocumentShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
