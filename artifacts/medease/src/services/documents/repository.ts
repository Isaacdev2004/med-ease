import { computeDocumentAnalytics } from '@/services/documents/analytics';
import { extractSystemMetadata } from '@/services/documents/metadata-engine';
import { simulateOcr } from '@/services/documents/ocr-engine';
import {
  searchDocuments,
  searchIndex,
} from '@/services/documents/search-engine';
import { nextSignatureStatus } from '@/services/documents/signature-engine';
import { nextVersionNumber } from '@/services/documents/versioning';
import { nextDocumentStatus } from '@/services/documents/document-engine';
import { buildFolderPath } from '@/services/documents/folder-engine';
import {
  MOCK_ACCESS_LOGS,
  MOCK_ARCHIVE_JOBS,
  MOCK_CATEGORIES,
  MOCK_COMMENTS,
  MOCK_CONTENT_INDEX,
  MOCK_DOCUMENTS,
  MOCK_FOLDERS,
  MOCK_LEGAL_HOLDS,
  MOCK_METADATA,
  MOCK_OCR_RESULTS,
  MOCK_RECORDS,
  MOCK_RETENTION_POLICIES,
  MOCK_SHARED_LINKS,
  MOCK_SIGNATURE_REQUESTS,
  MOCK_SIGNATURES,
  MOCK_TEMPLATES,
  MOCK_VERSIONS,
  buildDocumentDashboard,
} from '@/services/documents/mock-data';
import type {
  ApplyLegalHoldInput,
  ApplyRetentionInput,
  CreateFolderInput,
  CreateVersionInput,
  DocumentFavorite,
  DocumentFilters,
  MoveDocumentInput,
  RequestSignatureInput,
  ShareDocumentInput,
  ShareDocumentLinkInput,
  SignDocumentInput,
  UploadDocumentInput,
} from '@/services/documents/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: page ?? 1,
    pageSize: pageSize ?? 25,
  };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

function logAccess(
  documentId: string,
  userId: string,
  action: 'view' | 'download' | 'share' | 'edit' | 'sign',
) {
  MOCK_ACCESS_LOGS.unshift({
    logId: `log-${Date.now()}`,
    documentId,
    userId,
    action,
    timestamp: new Date().toISOString(),
  });
}

class DocumentRepository {
  private documents = [...MOCK_DOCUMENTS];
  private folders = [...MOCK_FOLDERS];
  private versions = [...MOCK_VERSIONS];
  private metadata = [...MOCK_METADATA];
  private ocrResults = [...MOCK_OCR_RESULTS];
  private signatureRequests = [...MOCK_SIGNATURE_REQUESTS];
  private signatures = [...MOCK_SIGNATURES];
  private sharedLinks = [...MOCK_SHARED_LINKS];
  private favorites: DocumentFavorite[] = [];
  private nextId = 880000;

  dashboard(tenantId?: string, facilityId?: string) {
    return buildDocumentDashboard(tenantId, facilityId);
  }
  analytics(tenantId?: string, facilityId?: string) {
    return computeDocumentAnalytics(tenantId, facilityId);
  }

  getDocuments(filters?: DocumentFilters) {
    let items = this.documents.filter((d) => d.status !== 'deleted');
    if (filters?.tenantId)
      items = items.filter((d) => d.tenantId === filters.tenantId);
    if (filters?.facilityId)
      items = items.filter((d) => d.facilityId === filters.facilityId);
    if (filters?.folderId)
      items = items.filter((d) => d.folderId === filters.folderId);
    if (filters?.categoryId)
      items = items.filter((d) => d.categoryId === filters.categoryId);
    if (filters?.patientId)
      items = items.filter((d) => d.patientId === filters.patientId);
    if (filters?.module)
      items = items.filter((d) => d.module === filters.module);
    if (filters?.status)
      items = items.filter((d) => d.status === filters.status);
    if (filters?.tag)
      items = items.filter((d) => d.tags.includes(filters.tag!));
    if (filters?.userId)
      items = items.filter((d) => d.uploadedBy === filters.userId);
    if (filters?.q) items = searchDocuments(items, filters.q);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDocument(documentId: string) {
    const doc = this.documents.find(
      (d) => d.documentId === documentId && d.status !== 'deleted',
    );
    if (doc) logAccess(documentId, 'current-user', 'view');
    return doc ?? null;
  }

  getFolders(filters?: DocumentFilters) {
    let items = this.folders;
    if (filters?.tenantId)
      items = items.filter((f) => f.tenantId === filters.tenantId);
    if (filters?.facilityId)
      items = items.filter((f) => f.facilityId === filters.facilityId);
    if (filters?.q)
      items = items.filter((f) => matchQ(filters.q, f.name, f.path));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCategories(filters?: DocumentFilters) {
    let items = MOCK_CATEGORIES;
    if (filters?.module)
      items = items.filter((c) => c.module === filters.module);
    if (filters?.q) items = items.filter((c) => matchQ(filters.q, c.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTemplates(filters?: DocumentFilters) {
    let items = MOCK_TEMPLATES;
    if (filters?.module)
      items = items.filter((t) => t.module === filters.module);
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getVersions(documentId: string) {
    const items = this.versions
      .filter((v) => v.documentId === documentId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
    return paginate(items, 1, 50);
  }

  getMetadata(documentId: string) {
    return this.metadata.filter((m) => m.documentId === documentId);
  }

  getComments(documentId: string) {
    return MOCK_COMMENTS.filter((c) => c.documentId === documentId);
  }

  search(query: string, filters?: DocumentFilters) {
    const docs = searchDocuments(
      this.documents.filter((d) => d.status !== 'deleted'),
      query,
    );
    const indices = searchIndex(MOCK_CONTENT_INDEX, query);
    return {
      documents: paginate(docs, filters?.page, filters?.pageSize),
      indices: paginate(indices, filters?.page, filters?.pageSize),
    };
  }

  getOcrResults(filters?: DocumentFilters) {
    let items = this.ocrResults;
    if (filters?.q)
      items = items.filter((o) =>
        matchQ(filters.q, o.extractedText, o.documentId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSignatureRequests(filters?: DocumentFilters) {
    let items = this.signatureRequests;
    if (filters?.userId)
      items = items.filter(
        (r) =>
          r.signerId === filters.userId || r.requestedBy === filters.userId,
      );
    if (filters?.status)
      items = items.filter((r) => r.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSignatures(filters?: DocumentFilters) {
    let items = this.signatures;
    if (filters?.userId)
      items = items.filter((s) => s.signerId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSharedLinks(filters?: DocumentFilters) {
    let items = this.sharedLinks.filter((l) => !l.revoked);
    if (filters?.userId)
      items = items.filter((l) => l.createdBy === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRetentionPolicies(filters?: DocumentFilters) {
    let items = MOCK_RETENTION_POLICIES;
    if (filters?.module)
      items = items.filter((p) => p.module === filters.module);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getLegalHolds(filters?: DocumentFilters) {
    let items = MOCK_LEGAL_HOLDS;
    if (filters?.status)
      items = items.filter((h) => h.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getArchives(filters?: DocumentFilters) {
    let items = MOCK_ARCHIVE_JOBS;
    if (filters?.status)
      items = items.filter((j) => j.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRecords(filters?: DocumentFilters) {
    let items = MOCK_RECORDS;
    if (filters?.status)
      items = items.filter((r) => r.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAccessLogs(filters?: DocumentFilters) {
    let items = MOCK_ACCESS_LOGS;
    if (filters?.userId)
      items = items.filter((l) => l.userId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  uploadDocument(input: UploadDocumentInput) {
    const documentId = `doc-${this.nextId++}`;
    const doc = {
      documentId,
      title: input.title,
      fileName: input.fileName,
      type: input.type,
      status: 'active' as const,
      folderId: input.folderId,
      categoryId: input.categoryId,
      tenantId: input.tenantId,
      facilityId: input.facilityId,
      patientId: input.patientId,
      module: input.module,
      tags: input.tags ?? [],
      sizeBytes: 120_000,
      versionNumber: 1,
      uploadedBy: input.uploadedBy,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ocrProcessed: false,
      signatureRequired: false,
    };
    this.documents.unshift(doc);
    this.metadata.push(
      ...extractSystemMetadata(documentId, input.module, input.patientId),
    );
    logAccess(documentId, input.uploadedBy, 'edit');
    return doc;
  }

  createFolder(input: CreateFolderInput) {
    const folderId = `folder-${this.nextId++}`;
    const folder = {
      folderId,
      name: input.name,
      parentId: input.parentId,
      tenantId: input.tenantId,
      facilityId: input.facilityId,
      documentCount: 0,
      path: '/',
    };
    folder.path = buildFolderPath([...this.folders, folder], folderId);
    this.folders.unshift(folder);
    return folder;
  }

  moveDocument(input: MoveDocumentInput) {
    const doc = this.documents.find((d) => d.documentId === input.documentId);
    if (!doc) return null;
    doc.folderId = input.folderId;
    doc.updatedAt = new Date().toISOString();
    logAccess(doc.documentId, 'current-user', 'edit');
    return doc;
  }

  archiveDocument(documentId: string) {
    const doc = this.documents.find((d) => d.documentId === documentId);
    if (!doc || doc.status === 'legal_hold') return null;
    doc.status = nextDocumentStatus(doc.status, 'archive');
    doc.updatedAt = new Date().toISOString();
    return doc;
  }

  restoreDocument(documentId: string) {
    const doc = this.documents.find((d) => d.documentId === documentId);
    if (!doc) return null;
    doc.status = nextDocumentStatus(doc.status, 'restore');
    doc.updatedAt = new Date().toISOString();
    return doc;
  }

  createVersion(input: CreateVersionInput) {
    const doc = this.documents.find((d) => d.documentId === input.documentId);
    if (!doc) return null;
    const existing = this.versions.filter(
      (v) => v.documentId === input.documentId,
    );
    const versionNumber = nextVersionNumber(existing);
    const version = {
      versionId: `ver-${this.nextId++}`,
      documentId: input.documentId,
      versionNumber,
      fileName: input.fileName,
      sizeBytes: input.sizeBytes,
      uploadedBy: input.uploadedBy,
      uploadedAt: new Date().toISOString(),
      changeNotes: input.changeNotes,
    };
    this.versions.unshift(version);
    doc.versionNumber = versionNumber;
    doc.updatedAt = new Date().toISOString();
    return version;
  }

  ocrDocument(documentId: string) {
    const doc = this.documents.find((d) => d.documentId === documentId);
    if (!doc) return null;
    const result = simulateOcr(documentId, 3);
    this.ocrResults.unshift(result);
    doc.ocrProcessed = true;
    doc.updatedAt = new Date().toISOString();
    return result;
  }

  requestSignature(input: RequestSignatureInput) {
    const request = {
      requestId: `sigreq-${this.nextId++}`,
      documentId: input.documentId,
      requestedBy: input.requestedBy,
      signerId: input.signerId,
      status: 'pending' as const,
      dueDate: input.dueDate,
      createdAt: new Date().toISOString(),
    };
    this.signatureRequests.unshift(request);
    const doc = this.documents.find((d) => d.documentId === input.documentId);
    if (doc) doc.signatureRequired = true;
    return request;
  }

  signDocument(input: SignDocumentInput) {
    const request = this.signatureRequests.find(
      (r) => r.requestId === input.requestId,
    );
    if (!request) return null;
    request.status = nextSignatureStatus('sign');
    const signature = {
      signatureId: `sig-${this.nextId++}`,
      documentId: request.documentId,
      requestId: request.requestId,
      signerId: input.signerId,
      signedAt: new Date().toISOString(),
      method: input.method,
    };
    this.signatures.unshift(signature);
    logAccess(request.documentId, input.signerId, 'sign');
    return signature;
  }

  shareDocument(input: ShareDocumentInput) {
    const link = {
      linkId: `link-${this.nextId++}`,
      documentId: input.documentId,
      createdBy: input.createdBy,
      expiresAt: input.expiresAt,
      accessCount: 0,
      revoked: false,
      createdAt: new Date().toISOString(),
    };
    this.sharedLinks.unshift(link);
    logAccess(input.documentId, input.createdBy, 'share');
    return link;
  }

  revokeSharing(input: ShareDocumentLinkInput) {
    const link = this.sharedLinks.find((l) => l.linkId === input.linkId);
    if (!link) return null;
    link.revoked = true;
    return link;
  }

  applyRetention(input: ApplyRetentionInput) {
    const doc = this.documents.find((d) => d.documentId === input.documentId);
    if (!doc) return null;
    doc.retentionPolicyId = input.policyId;
    doc.updatedAt = new Date().toISOString();
    return doc;
  }

  applyLegalHold(input: ApplyLegalHoldInput) {
    const doc = this.documents.find((d) => d.documentId === input.documentId);
    if (!doc) return null;
    doc.legalHoldId = input.holdId;
    doc.status = 'legal_hold';
    doc.updatedAt = new Date().toISOString();
    return doc;
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.documents.length,
    };
  }

  favorite(userId: string, documentId: string) {
    if (
      !this.favorites.some(
        (f) => f.userId === userId && f.documentId === documentId,
      )
    ) {
      this.favorites.push({
        userId,
        documentId,
        createdAt: new Date().toISOString(),
      });
    }
    return { userId, documentId };
  }

  getFavorites(userId: string) {
    const ids = this.favorites
      .filter((f) => f.userId === userId)
      .map((f) => f.documentId);
    return this.documents.filter((d) => ids.includes(d.documentId));
  }
}

export const documentRepository = new DocumentRepository();
