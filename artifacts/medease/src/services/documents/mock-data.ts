import { activeSharedLinksCount } from '@/services/documents/sharing';
import { estimateStorageGb } from '@/services/documents/storage-engine';
import { signatureCompletionRate } from '@/services/documents/signature-engine';
import { retentionComplianceRate } from '@/services/documents/retention';
import { ocrSuccessRate } from '@/services/documents/ocr-engine';
import type {
  AccessLog,
  ArchiveJob,
  ContentIndex,
  Document,
  DocumentAnalytics,
  DocumentCategory,
  DocumentComment,
  DocumentDashboard,
  DocumentFolder,
  DocumentMetadata,
  DocumentSignature,
  DocumentTag,
  DocumentTemplate,
  DocumentVersion,
  LegalHold,
  OCRResult,
  RecordItem,
  RetentionPolicy,
  ScanJob,
  SharedLink,
  SignatureRequest,
} from '@/services/documents/types';

const SCALE = {
  documents: 250,
  versions: 600,
  folders: 80,
  ocr: 120,
  templates: 40,
  signatureRequests: 60,
  signatures: 150,
  sharedLinks: 80,
  records: 100,
  archiveJobs: 20,
};

const ENTERPRISE = {
  documents: 100_000,
  versions: 250_000,
  folders: 15_000,
  ocr: 40_000,
  templates: 2_000,
  signatureRequests: 8_000,
  signatures: 20_000,
  sharedLinks: 12_000,
  records: 35_000,
  archiveJobs: 5_000,
};

const MODULES = [
  'clinical',
  'radiology',
  'laboratory',
  'billing',
  'finance',
  'workforce',
  'quality',
  'research',
  'procurement',
  'facilities',
];
const DOC_TYPES = ['pdf', 'image', 'docx', 'xlsx', 'dicom', 'text'] as const;

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_CATEGORIES: DocumentCategory[] = MODULES.map((module, i) => ({
  categoryId: `cat-${String(i + 1).padStart(3, '0')}`,
  name: `${module.charAt(0).toUpperCase()}${module.slice(1)} Documents`,
  module,
  documentCount: 500 + i * 120,
}));

export const MOCK_TAGS: DocumentTag[] = [
  'urgent',
  'signed',
  'confidential',
  'archived',
  'review',
  'patient',
  'contract',
  'invoice',
].map((name, i) => ({
  tagId: `tag-${String(i + 1).padStart(3, '0')}`,
  name,
  color: [
    '#ef4444',
    '#22c55e',
    '#3b82f6',
    '#a855f7',
    '#f59e0b',
    '#06b6d4',
    '#64748b',
    '#ec4899',
  ][i]!,
}));

export const MOCK_FOLDERS: DocumentFolder[] = Array.from(
  { length: SCALE.folders },
  (_, i) => ({
    folderId: `folder-${String(i + 1).padStart(4, '0')}`,
    name: [
      'Clinical Records',
      'Lab Reports',
      'Invoices',
      'Contracts',
      'SOPs',
      'HR Files',
      'Imaging',
      'Research',
    ][i % 8]!,
    parentId:
      i % 5 === 0
        ? undefined
        : `folder-${String(Math.floor(i / 5) + 1).padStart(4, '0')}`,
    tenantId: 'tenant-001',
    facilityId:
      i % 3 === 0 ? `fac-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
    documentCount: 5 + (i % 20),
    path: `/folder-${i + 1}`,
  }),
);

export const MOCK_DOCUMENTS: Document[] = Array.from(
  { length: SCALE.documents },
  (_, i) => {
    const module = MODULES[i % MODULES.length]!;
    const type = DOC_TYPES[i % DOC_TYPES.length]!;
    return {
      documentId: `doc-${String(i + 1).padStart(5, '0')}`,
      title: `${module} document ${(i % 200) + 1}`,
      fileName: `document-${i + 1}.${type === 'docx' ? 'docx' : type === 'xlsx' ? 'xlsx' : type === 'image' ? 'png' : type}`,
      type,
      status: (
        [
          'active',
          'active',
          'active',
          'draft',
          'archived',
          'legal_hold',
        ] as const
      )[i % 6]!,
      folderId: MOCK_FOLDERS[i % MOCK_FOLDERS.length]!.folderId,
      categoryId: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length]!.categoryId,
      tenantId: 'tenant-001',
      facilityId:
        i % 4 === 0
          ? `fac-${String((i % 10) + 1).padStart(3, '0')}`
          : undefined,
      patientId:
        module === 'clinical' && i % 3 === 0
          ? `pat-${String((i % 50) + 1).padStart(4, '0')}`
          : undefined,
      module,
      tags: [
        MOCK_TAGS[i % MOCK_TAGS.length]!.name,
        MOCK_TAGS[(i + 2) % MOCK_TAGS.length]!.name,
      ],
      sizeBytes: 50_000 + (i % 100) * 12_000,
      versionNumber: 1 + (i % 4),
      uploadedBy: `user-${String((i % 20) + 1).padStart(5, '0')}`,
      uploadedAt: daysAgo(i % 90),
      updatedAt: daysAgo(i % 30),
      ocrProcessed: i % 2 === 0,
      signatureRequired: i % 7 === 0,
      retentionPolicyId:
        i % 5 === 0 ? `ret-${String((i % 8) + 1).padStart(3, '0')}` : undefined,
      legalHoldId:
        i % 40 === 0
          ? `hold-${String((i % 5) + 1).padStart(3, '0')}`
          : undefined,
    };
  },
);

export const MOCK_VERSIONS: DocumentVersion[] = Array.from(
  { length: SCALE.versions },
  (_, i) => ({
    versionId: `ver-${String(i + 1).padStart(5, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    versionNumber: 1 + (i % 5),
    fileName: `v${1 + (i % 5)}-document-${i + 1}.pdf`,
    sizeBytes: 40_000 + (i % 50) * 8000,
    uploadedBy: `user-${String((i % 15) + 1).padStart(5, '0')}`,
    uploadedAt: daysAgo(i % 60),
    changeNotes: i % 3 === 0 ? 'Updated content' : undefined,
  }),
);

export const MOCK_METADATA: DocumentMetadata[] = Array.from(
  { length: 200 },
  (_, i) => ({
    metadataId: `meta-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    key: ['author', 'department', 'patientId', 'encounterId', 'source'][i % 5]!,
    value: `value-${i + 1}`,
    source: (['manual', 'ocr', 'system'] as const)[i % 3]!,
  }),
);

export const MOCK_TEMPLATES: DocumentTemplate[] = Array.from(
  { length: SCALE.templates },
  (_, i) => ({
    templateId: `tpl-${String(i + 1).padStart(4, '0')}`,
    name: [
      'Consent Form',
      'Referral Letter',
      'Discharge Summary',
      'Invoice',
      'SOP Template',
      'CAPA Form',
    ][i % 6]!,
    categoryId: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length]!.categoryId,
    module: MODULES[i % MODULES.length]!,
    type: DOC_TYPES[i % 4]!,
    usageCount: 10 + (i % 200),
    updatedAt: daysAgo(i % 120),
  }),
);

export const MOCK_SCAN_JOBS: ScanJob[] = Array.from({ length: 80 }, (_, i) => ({
  scanJobId: `scan-${String(i + 1).padStart(4, '0')}`,
  documentId:
    i % 3 === 0
      ? MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId
      : undefined,
  facilityId: `fac-${String((i % 10) + 1).padStart(3, '0')}`,
  status: (['queued', 'processing', 'completed', 'failed'] as const)[i % 4]!,
  pages: 1 + (i % 12),
  createdAt: daysAgo(i % 14),
  completedAt: i % 4 !== 0 ? daysAgo(i % 7) : undefined,
}));

export const MOCK_OCR_RESULTS: OCRResult[] = Array.from(
  { length: SCALE.ocr },
  (_, i) => ({
    ocrId: `ocr-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    confidence: 0.75 + (i % 5) * 0.04,
    language: 'en',
    extractedText: `Extracted text sample for document ${i + 1}. Clinical and operational metadata indexed.`,
    processedAt: daysAgo(i % 30),
  }),
);

export const MOCK_SIGNATURE_REQUESTS: SignatureRequest[] = Array.from(
  { length: SCALE.signatureRequests },
  (_, i) => ({
    requestId: `sigreq-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    requestedBy: `user-${String((i % 10) + 1).padStart(5, '0')}`,
    signerId: `user-${String((i % 20) + 11).padStart(5, '0')}`,
    status: (['pending', 'signed', 'declined', 'expired'] as const)[i % 4]!,
    dueDate: daysAgo(-(i % 14)),
    createdAt: daysAgo(i % 21),
  }),
);

export const MOCK_SIGNATURES: DocumentSignature[] = Array.from(
  { length: SCALE.signatures },
  (_, i) => ({
    signatureId: `sig-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    requestId:
      MOCK_SIGNATURE_REQUESTS[i % MOCK_SIGNATURE_REQUESTS.length]!.requestId,
    signerId: `user-${String((i % 20) + 11).padStart(5, '0')}`,
    signedAt: daysAgo(i % 30),
    method: (['digital', 'wet', 'eid'] as const)[i % 3]!,
  }),
);

export const MOCK_RETENTION_POLICIES: RetentionPolicy[] = Array.from(
  { length: 12 },
  (_, i) => ({
    policyId: `ret-${String(i + 1).padStart(3, '0')}`,
    name: `${MODULES[i % MODULES.length]} retention ${i + 1}`,
    module: MODULES[i % MODULES.length]!,
    retentionDays: [365, 730, 1825, 2555][i % 4]!,
    action: (['archive', 'delete', 'review'] as const)[i % 3]!,
    documentCount: 100 + i * 50,
    enabled: i % 5 !== 0,
  }),
);

export const MOCK_LEGAL_HOLDS: LegalHold[] = Array.from(
  { length: 8 },
  (_, i) => ({
    holdId: `hold-${String(i + 1).padStart(3, '0')}`,
    name: `Legal hold ${i + 1}`,
    reason: ['Litigation', 'Audit', 'Investigation', 'Regulatory inquiry'][
      i % 4
    ]!,
    status: i % 6 === 0 ? ('released' as const) : ('active' as const),
    documentCount: 20 + i * 15,
    createdAt: daysAgo(30 + i * 10),
    releasedAt: i % 6 === 0 ? daysAgo(5) : undefined,
  }),
);

export const MOCK_RECORDS: RecordItem[] = Array.from(
  { length: SCALE.records },
  (_, i) => ({
    recordId: `rec-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    recordType: ['clinical', 'financial', 'hr', 'compliance'][i % 4]!,
    classification: ['PHI', 'Financial', 'HR', 'Compliance'][i % 4]!,
    retentionPolicyId:
      MOCK_RETENTION_POLICIES[i % MOCK_RETENTION_POLICIES.length]!.policyId,
    archivedAt: i % 4 === 0 ? daysAgo(i % 60) : undefined,
    status: (['active', 'active', 'archived', 'destroyed'] as const)[i % 4]!,
  }),
);

export const MOCK_ARCHIVE_JOBS: ArchiveJob[] = Array.from(
  { length: SCALE.archiveJobs },
  (_, i) => ({
    jobId: `arch-${String(i + 1).padStart(4, '0')}`,
    name: `Archive batch ${i + 1}`,
    documentCount: 50 + i * 25,
    status: (['pending', 'running', 'completed', 'failed'] as const)[i % 4]!,
    createdAt: daysAgo(i % 30),
    completedAt: i % 4 >= 2 ? daysAgo(i % 10) : undefined,
  }),
);

export const MOCK_SHARED_LINKS: SharedLink[] = Array.from(
  { length: SCALE.sharedLinks },
  (_, i) => ({
    linkId: `link-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    createdBy: `user-${String((i % 15) + 1).padStart(5, '0')}`,
    expiresAt: i % 5 === 0 ? daysAgo(-7) : daysAgo(-(i % 30)),
    accessCount: i % 50,
    revoked: i % 12 === 0,
    createdAt: daysAgo(i % 45),
  }),
);

export const MOCK_ACCESS_LOGS: AccessLog[] = Array.from(
  { length: 300 },
  (_, i) => ({
    logId: `log-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    userId: `user-${String((i % 25) + 1).padStart(5, '0')}`,
    action: (['view', 'download', 'share', 'edit', 'sign'] as const)[i % 5]!,
    timestamp: daysAgo(i % 14),
    ipAddress: `10.0.${(i % 20) + 1}.${(i % 200) + 1}`,
  }),
);

export const MOCK_CONTENT_INDEX: ContentIndex[] = Array.from(
  { length: 200 },
  (_, i) => ({
    indexId: `idx-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    title: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.title,
    snippet: `Indexed content snippet for search result ${i + 1}…`,
    module: MODULES[i % MODULES.length]!,
    indexedAt: daysAgo(i % 30),
  }),
);

export const MOCK_COMMENTS: DocumentComment[] = Array.from(
  { length: 60 },
  (_, i) => ({
    commentId: `cmt-${String(i + 1).padStart(4, '0')}`,
    documentId: MOCK_DOCUMENTS[i % MOCK_DOCUMENTS.length]!.documentId,
    authorId: `user-${String((i % 10) + 1).padStart(5, '0')}`,
    content: `Comment on document ${i + 1}`,
    createdAt: daysAgo(i % 20),
  }),
);

export function buildDocumentDashboard(
  tenantId?: string,
  facilityId?: string,
): DocumentDashboard {
  let docs = MOCK_DOCUMENTS;
  if (tenantId) docs = docs.filter((d) => d.tenantId === tenantId);
  if (facilityId) docs = docs.filter((d) => d.facilityId === facilityId);
  const avgSize =
    docs.reduce((s, d) => s + d.sizeBytes, 0) / Math.max(docs.length, 1);

  return {
    totalDocuments: ENTERPRISE.documents,
    totalVersions: ENTERPRISE.versions,
    totalFolders: ENTERPRISE.folders,
    pendingSignatures:
      MOCK_SIGNATURE_REQUESTS.filter((r) => r.status === 'pending').length * 40,
    activeLegalHolds: MOCK_LEGAL_HOLDS.filter((h) => h.status === 'active')
      .length,
    ocrJobsToday:
      MOCK_SCAN_JOBS.filter((j) => j.status === 'completed').length * 15,
    sharedLinksActive: activeSharedLinksCount(MOCK_SHARED_LINKS) * 30,
    storageUsedGb: estimateStorageGb(ENTERPRISE.documents, avgSize),
    uploadTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value: 120 + i * 18 + (docs.length % 20),
      }),
    ),
    moduleBreakdown: MODULES.slice(0, 6).map((label) => ({
      label,
      value: docs.filter((d) => d.module === label).length * 400,
    })),
    recentActivity: MOCK_ACCESS_LOGS.slice(0, 8),
  };
}

export function computeDocumentAnalytics(
  tenantId?: string,
  facilityId?: string,
): DocumentAnalytics {
  const dashboard = buildDocumentDashboard(tenantId, facilityId);
  const docs = MOCK_DOCUMENTS;
  const avgSize =
    docs.reduce((s, d) => s + d.sizeBytes, 0) / Math.max(docs.length, 1);

  return {
    uploadRate: Math.round(
      dashboard.uploadTrend.reduce((s, t) => s + t.value, 0) / 7,
    ),
    avgDocumentSizeMb: Math.round((avgSize / (1024 * 1024)) * 100) / 100,
    ocrSuccessRate: ocrSuccessRate(MOCK_OCR_RESULTS),
    signatureCompletionRate: signatureCompletionRate(MOCK_SIGNATURE_REQUESTS),
    retentionComplianceRate: retentionComplianceRate(
      docs,
      MOCK_RETENTION_POLICIES,
    ),
    searchQueriesDaily: 1840,
    archiveJobsCompleted:
      MOCK_ARCHIVE_JOBS.filter((j) => j.status === 'completed').length * 50,
    accessTrend: dashboard.uploadTrend,
    storageByModule: dashboard.moduleBreakdown,
    signatureTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: 120 + i * 25,
    })),
  };
}
