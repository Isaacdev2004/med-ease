import { Link, useLocation } from 'wouter';

import type { DocumentSection } from '@/features/documents/components/DocumentSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: DocumentSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Documents', path: 'documents' },
  { segment: 'my-documents', label: 'My Documents', path: 'my-documents' },
  { segment: 'templates', label: 'Templates', path: 'templates' },
  { segment: 'signatures', label: 'Signatures', path: 'signatures' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Documents', path: 'documents' },
  { segment: 'shared-documents', label: 'Shared', path: 'shared-documents' },
  { segment: 'scanning', label: 'Scanning', path: 'scanning' },
  { segment: 'archive', label: 'Archive', path: 'archive' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Documents', path: 'documents' },
  { segment: 'document-library', label: 'Library', path: 'document-library' },
  { segment: 'document-templates', label: 'Templates', path: 'document-templates' },
  { segment: 'document-categories', label: 'Categories', path: 'document-categories' },
  { segment: 'records-management', label: 'Records', path: 'records-management' },
  { segment: 'retention-policies', label: 'Retention', path: 'retention-policies' },
  { segment: 'legal-holds', label: 'Legal Holds', path: 'legal-holds' },
  { segment: 'document-search', label: 'Search', path: 'document-search' },
  { segment: 'document-analytics', label: 'Analytics', path: 'document-analytics' },
  { segment: 'signature-center', label: 'Signatures', path: 'signature-center' },
];

interface DocumentTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: DocumentTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function DocumentTabs({ basePath, variant = 'professional' }: DocumentTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Document sections">
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link key={tab.path} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

const PATH_MAP: [string, DocumentSection][] = [
  ['/document-analytics', 'document-analytics'],
  ['/signature-center', 'signature-center'],
  ['/records-management', 'records-management'],
  ['/retention-policies', 'retention-policies'],
  ['/document-categories', 'document-categories'],
  ['/document-templates', 'document-templates'],
  ['/document-library', 'document-library'],
  ['/shared-documents', 'shared-documents'],
  ['/document-search', 'document-search'],
  ['/my-documents', 'my-documents'],
  ['/legal-holds', 'legal-holds'],
  ['/signatures', 'signatures'],
  ['/templates', 'templates'],
  ['/scanning', 'scanning'],
  ['/archive', 'archive'],
];

export function getDocumentSectionFromPath(pathname: string): DocumentSection {
  for (const [path, section] of PATH_MAP) {
    if (pathname.includes(path)) return section;
  }
  return 'dashboard';
}
