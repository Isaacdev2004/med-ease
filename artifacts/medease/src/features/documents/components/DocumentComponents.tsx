import { format } from 'date-fns';
import {
  Archive,
  BarChart3,
  FileText,
  Folder,
  Lock,
  Search,
  Share2,
  Shield,
  Signature,
} from 'lucide-react';

import { formatFileSize } from '@/services/documents/document-engine';
import type {
  ArchiveJob,
  Document,
  DocumentAnalytics,
  DocumentDashboard,
  DocumentFolder,
  DocumentMetadata,
  DocumentSignature,
  DocumentTemplate,
  DocumentVersion,
  LegalHold,
  OCRResult,
  RecordItem,
  RetentionPolicy,
  SharedLink,
  SignatureRequest,
  AccessLog,
} from '@/services/documents/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const statusVariant = { active: 'default', draft: 'outline', archived: 'secondary', deleted: 'destructive', legal_hold: 'destructive' } as const;

export function DocumentDashboardPanel({ dashboard }: { dashboard: DocumentDashboard }) {
  const metrics = [
    { label: 'Total Documents', value: dashboard.totalDocuments.toLocaleString(), icon: FileText },
    { label: 'Versions', value: dashboard.totalVersions.toLocaleString(), icon: Archive },
    { label: 'Pending Signatures', value: dashboard.pendingSignatures.toLocaleString(), icon: Signature },
    { label: 'Active Legal Holds', value: dashboard.activeLegalHolds.toLocaleString(), icon: Shield },
    { label: 'Shared Links', value: dashboard.sharedLinksActive.toLocaleString(), icon: Share2 },
    { label: 'Storage Used (GB)', value: dashboard.storageUsedGb.toLocaleString(), icon: Folder },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <m.icon className="h-8 w-8 text-primary shrink-0" />
              <div><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Upload Activity" data={dashboard.uploadTrend} />
      <BarChartPanel title="Documents by Module" data={dashboard.moduleBreakdown} />
    </div>
  );
}

export function DocumentCard({ document }: { document: Document }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1"><FileText className="h-4 w-4" /> {document.title}</span>
          <Badge variant={statusVariant[document.status]} className="capitalize">{document.status.replace('_', ' ')}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{document.fileName} · {formatFileSize(document.sizeBytes)}</p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{document.module}</Badge>
          <Badge variant="outline">v{document.versionNumber}</Badge>
          {document.ocrProcessed && <Badge variant="secondary">OCR</Badge>}
          {document.signatureRequired && <Badge variant="secondary">Signature</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

export function FolderTree({ folders }: { folders: DocumentFolder[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Folder Tree</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {folders.slice(0, 12).map((f) => (
          <div key={f.folderId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <span className="flex items-center gap-1"><Folder className="h-4 w-4" /> {f.name}</span>
            <Badge variant="outline">{f.documentCount}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FolderCard({ folder }: { folder: DocumentFolder }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <span className="font-medium flex items-center gap-1"><Folder className="h-4 w-4" /> {folder.name}</span>
        <p className="text-xs text-muted-foreground">{folder.path}</p>
        <p className="text-xs">{folder.documentCount} documents</p>
      </CardContent>
    </Card>
  );
}

export function FilePreview({ document }: { document: Document }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">File Preview</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="font-medium">{document.title}</p>
        <p className="text-xs text-muted-foreground">{document.type.toUpperCase()} · {formatFileSize(document.sizeBytes)}</p>
        <div className="rounded-md border bg-muted/30 h-40 flex items-center justify-center text-muted-foreground text-xs">
          Preview placeholder for {document.fileName}
        </div>
      </CardContent>
    </Card>
  );
}

export function PDFViewer({ document }: { document: Document }) {
  return document.type === 'pdf' ? <FilePreview document={document} /> : null;
}

export function ImageViewer({ document }: { document: Document }) {
  return document.type === 'image' ? <FilePreview document={document} /> : null;
}

export function VersionTimeline({ versions }: { versions: DocumentVersion[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Version Timeline</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {versions.slice(0, 8).map((v) => (
          <div key={v.versionId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <div>
              <p className="font-medium">v{v.versionNumber} · {v.fileName}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(v.uploadedAt), 'MMM d, yyyy')}</p>
            </div>
            <Badge variant="outline">{formatFileSize(v.sizeBytes)}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function MetadataPanel({ metadata }: { metadata: DocumentMetadata[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Metadata</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {metadata.slice(0, 10).map((m) => (
          <div key={m.metadataId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <span className="font-mono text-xs">{m.key}</span>
            <span className="text-muted-foreground">{m.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function OCRPanel({ results }: { results: OCRResult[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">OCR Results</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {results.slice(0, 4).map((r) => (
          <div key={r.ocrId} className="text-sm border-b pb-2 last:border-0">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{r.documentId}</span>
              <Badge>{Math.round(r.confidence * 100)}%</Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{r.extractedText}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SearchPanel({ query, count }: { query: string; count: number }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3 text-sm">
        <Search className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">{count} results for &quot;{query}&quot;</p>
          <p className="text-xs text-muted-foreground">Full-text search across documents and content index</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TagManager({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
    </div>
  );
}

export function SignatureCard({ signature }: { signature: DocumentSignature }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{signature.signerId}</span>
          <Badge className="capitalize">{signature.method}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Signed {format(new Date(signature.signedAt), 'MMM d, yyyy')}</p>
      </CardContent>
    </Card>
  );
}

export function SignatureRequestCard({ request }: { request: SignatureRequest }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{request.documentId}</span>
          <Badge className="capitalize">{request.status}</Badge>
        </div>
        <p className="text-xs">Signer: {request.signerId}</p>
        <p className="text-xs text-muted-foreground">Due {format(new Date(request.dueDate), 'MMM d, yyyy')}</p>
      </CardContent>
    </Card>
  );
}

export function TemplateCard({ template }: { template: DocumentTemplate }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <span className="font-medium">{template.name}</span>
        <div className="flex gap-1">
          <Badge variant="outline">{template.module}</Badge>
          <Badge variant="outline">{template.type}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{template.usageCount} uses</p>
      </CardContent>
    </Card>
  );
}

export function ArchiveCard({ job }: { job: ArchiveJob }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{job.name}</span>
          <Badge className="capitalize">{job.status}</Badge>
        </div>
        <p className="text-xs">{job.documentCount} documents</p>
      </CardContent>
    </Card>
  );
}

export function LegalHoldCard({ hold }: { hold: LegalHold }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1"><Lock className="h-4 w-4" /> {hold.name}</span>
          <Badge className="capitalize">{hold.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{hold.reason}</p>
        <p className="text-xs">{hold.documentCount} documents</p>
      </CardContent>
    </Card>
  );
}

export function SharedLinkCard({ link }: { link: SharedLink }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{link.documentId}</span>
          <Badge variant={link.revoked ? 'destructive' : 'default'}>{link.revoked ? 'Revoked' : 'Active'}</Badge>
        </div>
        <p className="text-xs">{link.accessCount} accesses</p>
      </CardContent>
    </Card>
  );
}

export function RecordsDashboard({ records }: { records: RecordItem[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Records Management</CardTitle></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        <div><p className="text-xs text-muted-foreground">Active Records</p><p className="text-lg font-semibold">{records.filter((r) => r.status === 'active').length}</p></div>
        <div><p className="text-xs text-muted-foreground">Archived</p><p className="text-lg font-semibold">{records.filter((r) => r.status === 'archived').length}</p></div>
      </CardContent>
    </Card>
  );
}

export function ActivityTimeline({ logs }: { logs: AccessLog[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {logs.slice(0, 10).map((l) => (
          <div key={l.logId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <div>
              <p className="font-medium capitalize">{l.action}</p>
              <p className="text-xs text-muted-foreground">{l.documentId} · {l.userId}</p>
            </div>
            <span className="text-xs text-muted-foreground">{format(new Date(l.timestamp), 'MMM d, HH:mm')}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DocumentAnalyticsPanel({ analytics }: { analytics: DocumentAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Daily Uploads', value: analytics.uploadRate },
          { label: 'Avg Size (MB)', value: analytics.avgDocumentSizeMb },
          { label: 'OCR Success', value: `${analytics.ocrSuccessRate}%` },
          { label: 'Signature Completion', value: `${analytics.signatureCompletionRate}%` },
          { label: 'Retention Compliance', value: `${analytics.retentionComplianceRate}%` },
          { label: 'Search Queries/Day', value: analytics.searchQueriesDaily.toLocaleString() },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Storage by Module" data={analytics.storageByModule} />
    </div>
  );
}

export function RetentionPolicyCard({ policy }: { policy: RetentionPolicy }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{policy.name}</span>
          <Badge variant={policy.enabled ? 'default' : 'secondary'}>{policy.enabled ? 'Enabled' : 'Disabled'}</Badge>
        </div>
        <p className="text-xs">{policy.retentionDays} days · {policy.action}</p>
        <p className="text-xs text-muted-foreground">{policy.documentCount} documents</p>
      </CardContent>
    </Card>
  );
}

export function ExportToolbar({ onExport }: { onExport: (format: 'csv' | 'pdf' | 'xlsx') => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => onExport('csv')}><BarChart3 className="h-4 w-4 mr-1" /> Export CSV</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>Export PDF</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>Export XLSX</Button>
    </div>
  );
}
