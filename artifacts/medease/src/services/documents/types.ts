export type DocumentStatus =
  'active' | 'draft' | 'archived' | 'deleted' | 'legal_hold';
export type DocumentType =
  'pdf' | 'image' | 'docx' | 'xlsx' | 'dicom' | 'text' | 'other';
export type SignatureStatus = 'pending' | 'signed' | 'declined' | 'expired';
export type ScanStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type ArchiveStatus = 'pending' | 'running' | 'completed' | 'failed';
export type RetentionAction = 'archive' | 'delete' | 'review';

export interface DocumentFilters {
  q?: string;
  tenantId?: string;
  facilityId?: string;
  folderId?: string;
  categoryId?: string;
  patientId?: string;
  module?: string;
  status?: string;
  tag?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DocumentCategory {
  categoryId: string;
  name: string;
  module: string;
  documentCount: number;
}

export interface DocumentTag {
  tagId: string;
  name: string;
  color: string;
}

export interface DocumentFolder {
  folderId: string;
  name: string;
  parentId?: string;
  tenantId: string;
  facilityId?: string;
  documentCount: number;
  path: string;
}

export interface DocumentMetadata {
  metadataId: string;
  documentId: string;
  key: string;
  value: string;
  source: 'manual' | 'ocr' | 'system';
}

export interface DocumentVersion {
  versionId: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  changeNotes?: string;
}

export interface DocumentAnnotation {
  annotationId: string;
  documentId: string;
  page: number;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface DocumentComment {
  commentId: string;
  documentId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Document {
  documentId: string;
  title: string;
  fileName: string;
  type: DocumentType;
  status: DocumentStatus;
  folderId?: string;
  categoryId?: string;
  tenantId: string;
  facilityId?: string;
  patientId?: string;
  module: string;
  tags: string[];
  sizeBytes: number;
  versionNumber: number;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  ocrProcessed: boolean;
  signatureRequired: boolean;
  retentionPolicyId?: string;
  legalHoldId?: string;
}

export interface DocumentTemplate {
  templateId: string;
  name: string;
  categoryId: string;
  module: string;
  type: DocumentType;
  usageCount: number;
  updatedAt: string;
}

export interface ScanJob {
  scanJobId: string;
  documentId?: string;
  facilityId: string;
  status: ScanStatus;
  pages: number;
  createdAt: string;
  completedAt?: string;
}

export interface OCRResult {
  ocrId: string;
  documentId: string;
  confidence: number;
  language: string;
  extractedText: string;
  processedAt: string;
}

export interface SignatureRequest {
  requestId: string;
  documentId: string;
  requestedBy: string;
  signerId: string;
  status: SignatureStatus;
  dueDate: string;
  createdAt: string;
}

export interface DocumentSignature {
  signatureId: string;
  documentId: string;
  requestId: string;
  signerId: string;
  signedAt: string;
  method: 'digital' | 'wet' | 'eid';
}

export interface RetentionPolicy {
  policyId: string;
  name: string;
  module: string;
  retentionDays: number;
  action: RetentionAction;
  documentCount: number;
  enabled: boolean;
}

export interface LegalHold {
  holdId: string;
  name: string;
  reason: string;
  status: 'active' | 'released';
  documentCount: number;
  createdAt: string;
  releasedAt?: string;
}

export interface RecordItem {
  recordId: string;
  documentId: string;
  recordType: string;
  classification: string;
  retentionPolicyId: string;
  archivedAt?: string;
  status: 'active' | 'archived' | 'destroyed';
}

export interface ArchiveJob {
  jobId: string;
  name: string;
  documentCount: number;
  status: ArchiveStatus;
  createdAt: string;
  completedAt?: string;
}

export interface SharedLink {
  linkId: string;
  documentId: string;
  createdBy: string;
  expiresAt?: string;
  accessCount: number;
  revoked: boolean;
  createdAt: string;
}

export interface AccessLog {
  logId: string;
  documentId: string;
  userId: string;
  action: 'view' | 'download' | 'share' | 'edit' | 'sign';
  timestamp: string;
  ipAddress?: string;
}

export interface ContentIndex {
  indexId: string;
  documentId: string;
  title: string;
  snippet: string;
  module: string;
  indexedAt: string;
}

export interface DocumentDashboard {
  totalDocuments: number;
  totalVersions: number;
  totalFolders: number;
  pendingSignatures: number;
  activeLegalHolds: number;
  ocrJobsToday: number;
  sharedLinksActive: number;
  storageUsedGb: number;
  uploadTrend: { label: string; value: number }[];
  moduleBreakdown: { label: string; value: number }[];
  recentActivity: AccessLog[];
}

export interface DocumentAnalytics {
  uploadRate: number;
  avgDocumentSizeMb: number;
  ocrSuccessRate: number;
  signatureCompletionRate: number;
  retentionComplianceRate: number;
  searchQueriesDaily: number;
  archiveJobsCompleted: number;
  accessTrend: { label: string; value: number }[];
  storageByModule: { label: string; value: number }[];
  signatureTrend: { label: string; value: number }[];
}

export interface DocumentPermissions {
  canView: boolean;
  canWrite: boolean;
  canUpload: boolean;
  canDownload: boolean;
  canShare: boolean;
  canArchive: boolean;
  canRecords: boolean;
  canRetention: boolean;
  canSignatures: boolean;
  canAnalytics: boolean;
  canExport: boolean;
  canAdmin: boolean;
}

export interface DocumentFavorite {
  userId: string;
  documentId: string;
  createdAt: string;
}

export interface UploadDocumentInput {
  title: string;
  fileName: string;
  type: DocumentType;
  folderId?: string;
  categoryId?: string;
  tenantId: string;
  facilityId?: string;
  patientId?: string;
  module: string;
  tags?: string[];
  uploadedBy: string;
}

export interface CreateFolderInput {
  name: string;
  parentId?: string;
  tenantId: string;
  facilityId?: string;
}

export interface MoveDocumentInput {
  documentId: string;
  folderId: string;
}

export interface CreateVersionInput {
  documentId: string;
  fileName: string;
  sizeBytes: number;
  uploadedBy: string;
  changeNotes?: string;
}

export interface RequestSignatureInput {
  documentId: string;
  requestedBy: string;
  signerId: string;
  dueDate: string;
}

export interface SignDocumentInput {
  requestId: string;
  signerId: string;
  method: 'digital' | 'wet' | 'eid';
}

export interface ShareDocumentInput {
  documentId: string;
  createdBy: string;
  expiresAt?: string;
}

export interface ApplyRetentionInput {
  documentId: string;
  policyId: string;
}

export interface ApplyLegalHoldInput {
  documentId: string;
  holdId: string;
}

export interface ShareDocumentLinkInput {
  linkId: string;
}
