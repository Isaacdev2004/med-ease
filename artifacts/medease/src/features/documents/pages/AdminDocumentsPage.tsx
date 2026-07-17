import { useLocation } from 'wouter';

import { DocumentShell } from '@/features/documents/components/DocumentShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'documents'
  | 'document-library'
  | 'document-templates'
  | 'document-categories'
  | 'records-management'
  | 'retention-policies'
  | 'legal-holds'
  | 'document-search'
  | 'document-analytics'
  | 'signature-center';

function resolveSegment(location: string): Segment {
  const paths: Segment[] = [
    'document-analytics',
    'signature-center',
    'records-management',
    'retention-policies',
    'document-categories',
    'document-templates',
    'document-library',
    'document-search',
    'legal-holds',
  ];
  for (const p of paths) {
    if (location.includes(`/${p}`)) return p;
  }
  return 'documents';
}

const TITLES: Record<Segment, string> = {
  documents: 'Document Hub',
  'document-library': 'Document Library',
  'document-templates': 'Document Templates',
  'document-categories': 'Document Categories',
  'records-management': 'Records Management',
  'retention-policies': 'Retention Policies',
  'legal-holds': 'Legal Holds',
  'document-search': 'Document Search',
  'document-analytics': 'Document Analytics',
  'signature-center': 'Signature Center',
};

export default function AdminDocumentsPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <DocumentShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
