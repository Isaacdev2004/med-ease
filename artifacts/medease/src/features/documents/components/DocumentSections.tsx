import { useState } from 'react';
import { FileText } from 'lucide-react';

import {
  ActivityTimeline,
  ArchiveCard,
  DocumentAnalyticsPanel,
  DocumentCard,
  DocumentDashboardPanel,
  ExportToolbar,
  FolderCard,
  FolderTree,
  LegalHoldCard,
  OCRPanel,
  RecordsDashboard,
  RetentionPolicyCard,
  SearchPanel,
  SharedLinkCard,
  SignatureCard,
  SignatureRequestCard,
  TemplateCard,
  VersionTimeline,
} from '@/features/documents/components/DocumentComponents';
import {
  useArchives,
  useCategories,
  useDocumentAnalytics,
  useDocumentDashboard,
  useDocuments,
  useFolders,
  useLegalHold,
  useOCR,
  useRecords,
  useRetention,
  useSearch,
  useSharedLinks,
  useSignatureRequests,
  useSignatures,
  useTemplates,
  useVersions,
} from '@/features/documents/hooks/use-documents';
import { useDocumentMutations } from '@/features/documents/mutations/document.mutations';
import type { DocumentFilters } from '@/services/documents/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Input } from '@/shared/ui/input';

export type DocumentSection =
  | 'dashboard'
  | 'my-documents'
  | 'templates'
  | 'signatures'
  | 'shared-documents'
  | 'scanning'
  | 'archive'
  | 'document-library'
  | 'document-templates'
  | 'document-categories'
  | 'records-management'
  | 'retention-policies'
  | 'legal-holds'
  | 'document-search'
  | 'document-analytics'
  | 'signature-center';

interface SectionProps {
  filters?: DocumentFilters;
  variant?: 'professional' | 'facility' | 'admin';
}

export function DashboardSection({ filters }: SectionProps) {
  const dashboard = useDocumentDashboard(
    filters?.tenantId,
    filters?.facilityId,
  );
  const docs = useDocuments(filters);
  const folders = useFolders(filters);
  const { exportData } = useDocumentMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading document dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={FileText} title="No document data" />;
  return (
    <div className="space-y-6">
      <DocumentDashboardPanel dashboard={dashboard.data} />
      <FolderTree folders={folders.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(docs.data?.items ?? []).slice(0, 9).map((d) => (
          <DocumentCard key={d.documentId} document={d} />
        ))}
      </div>
      <ActivityTimeline logs={dashboard.data.recentActivity} />
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function MyDocumentsSection({ filters }: SectionProps) {
  const docs = useDocuments({ ...filters, userId: filters?.userId });
  if (docs.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(docs.data?.items ?? []).slice(0, 12).map((d) => (
        <DocumentCard key={d.documentId} document={d} />
      ))}
    </div>
  );
}

export function TemplatesSection({ filters }: SectionProps) {
  const templates = useTemplates(filters);
  if (templates.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(templates.data?.items ?? []).map((t) => (
        <TemplateCard key={t.templateId} template={t} />
      ))}
    </div>
  );
}

export function SignaturesSection({ filters }: SectionProps) {
  const requests = useSignatureRequests(filters);
  const signatures = useSignatures(filters);
  const { signDocument } = useDocumentMutations();
  if (requests.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(requests.data?.items ?? []).slice(0, 6).map((r) => (
          <SignatureRequestCard key={r.requestId} request={r} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(signatures.data?.items ?? []).slice(0, 6).map((s) => (
          <SignatureCard key={s.signatureId} signature={s} />
        ))}
      </div>
      {(requests.data?.items ?? [])[0] && (
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() =>
            signDocument.mutate({
              requestId: requests.data!.items[0]!.requestId,
              signerId: requests.data!.items[0]!.signerId,
              method: 'digital',
            })
          }
        >
          Sign first pending request (demo)
        </button>
      )}
    </div>
  );
}

export function SharedDocumentsSection({ filters }: SectionProps) {
  const links = useSharedLinks(filters);
  const docs = useDocuments(filters);
  if (links.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(links.data?.items ?? []).slice(0, 6).map((l) => (
          <SharedLinkCard key={l.linkId} link={l} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(docs.data?.items ?? []).slice(0, 6).map((d) => (
          <DocumentCard key={d.documentId} document={d} />
        ))}
      </div>
    </div>
  );
}

export function ScanningSection({ filters }: SectionProps) {
  const ocr = useOCR(filters);
  const { ocrDocument } = useDocumentMutations();
  const docs = useDocuments(filters);
  if (ocr.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <OCRPanel results={ocr.data?.items ?? []} />
      {(docs.data?.items ?? [])[0] && (
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => ocrDocument.mutate(docs.data!.items[0]!.documentId)}
        >
          Run OCR on first document (demo)
        </button>
      )}
    </div>
  );
}

export function ArchiveSection({ filters }: SectionProps) {
  const archives = useArchives(filters);
  if (archives.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(archives.data?.items ?? []).map((j) => (
        <ArchiveCard key={j.jobId} job={j} />
      ))}
    </div>
  );
}

export function LibrarySection({ filters }: SectionProps) {
  const docs = useDocuments(filters);
  const folders = useFolders(filters);
  const firstDoc = docs.data?.items[0];
  const versions = useVersions(firstDoc?.documentId ?? '');
  if (docs.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(folders.data?.items ?? []).slice(0, 6).map((f) => (
          <FolderCard key={f.folderId} folder={f} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(docs.data?.items ?? []).slice(0, 12).map((d) => (
          <DocumentCard key={d.documentId} document={d} />
        ))}
      </div>
      {firstDoc && <VersionTimeline versions={versions.data?.items ?? []} />}
    </div>
  );
}

export function CategoriesSection({ filters }: SectionProps) {
  const categories = useCategories(filters);
  if (categories.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(categories.data?.items ?? []).map((c) => (
        <div key={c.categoryId} className="rounded-lg border p-4 text-sm">
          <p className="font-medium">{c.name}</p>
          <p className="text-xs text-muted-foreground">
            {c.module} · {c.documentCount.toLocaleString()} docs
          </p>
        </div>
      ))}
    </div>
  );
}

export function RecordsSection({ filters }: SectionProps) {
  const records = useRecords(filters);
  if (records.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <RecordsDashboard records={records.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(records.data?.items ?? []).slice(0, 9).map((r) => (
          <div
            key={r.recordId}
            className="rounded-lg border p-4 text-sm space-y-1"
          >
            <BadgeRow label={r.classification} />
            <p className="text-xs">{r.documentId}</p>
            <p className="text-xs capitalize">{r.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgeRow({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-md border px-2 py-0.5 text-xs">
      {label}
    </span>
  );
}

export function RetentionSection({ filters }: SectionProps) {
  const policies = useRetention(filters);
  if (policies.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(policies.data?.items ?? []).map((p) => (
        <RetentionPolicyCard key={p.policyId} policy={p} />
      ))}
    </div>
  );
}

export function LegalHoldsSection({ filters }: SectionProps) {
  const holds = useLegalHold(filters);
  if (holds.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(holds.data?.items ?? []).map((h) => (
        <LegalHoldCard key={h.holdId} hold={h} />
      ))}
    </div>
  );
}

export function SearchSection({ filters }: SectionProps) {
  const [query, setQuery] = useState('clinical');
  const results = useSearch(query, filters);
  if (results.isLoading && query.length >= 2) return <LoadingView />;
  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents…"
      />
      {query.length >= 2 && (
        <>
          <SearchPanel
            query={query}
            count={results.data?.documents.total ?? 0}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(results.data?.documents.items ?? []).slice(0, 9).map((d) => (
              <DocumentCard key={d.documentId} document={d} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AnalyticsSection({ filters }: SectionProps) {
  const analytics = useDocumentAnalytics(
    filters?.tenantId,
    filters?.facilityId,
  );
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return null;
  return <DocumentAnalyticsPanel analytics={analytics.data} />;
}

export function SignatureCenterSection({ filters }: SectionProps) {
  return <SignaturesSection filters={filters} />;
}

export function DocumentSectionContent({
  section,
  filters,
}: {
  section: DocumentSection;
  filters?: DocumentFilters;
  variant?: 'professional' | 'facility' | 'admin';
}) {
  switch (section) {
    case 'my-documents':
      return <MyDocumentsSection filters={filters} />;
    case 'templates':
    case 'document-templates':
      return <TemplatesSection filters={filters} />;
    case 'signatures':
    case 'signature-center':
      return <SignaturesSection filters={filters} />;
    case 'shared-documents':
      return <SharedDocumentsSection filters={filters} />;
    case 'scanning':
      return <ScanningSection filters={filters} />;
    case 'archive':
      return <ArchiveSection filters={filters} />;
    case 'document-library':
      return <LibrarySection filters={filters} />;
    case 'document-categories':
      return <CategoriesSection filters={filters} />;
    case 'records-management':
      return <RecordsSection filters={filters} />;
    case 'retention-policies':
      return <RetentionSection filters={filters} />;
    case 'legal-holds':
      return <LegalHoldsSection filters={filters} />;
    case 'document-search':
      return <SearchSection filters={filters} />;
    case 'document-analytics':
      return <AnalyticsSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
