import { documentRepository } from '@/services/documents/repository';
import type {
  ApplyLegalHoldInput,
  ApplyRetentionInput,
  CreateFolderInput,
  CreateVersionInput,
  DocumentFilters,
  MoveDocumentInput,
  RequestSignatureInput,
  ShareDocumentInput,
  ShareDocumentLinkInput,
  SignDocumentInput,
  UploadDocumentInput,
} from '@/services/documents/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const documentService = {
  async dashboard(tenantId?: string, facilityId?: string) {
    await delay();
    return documentRepository.dashboard(tenantId, facilityId);
  },
  async analytics(tenantId?: string, facilityId?: string) {
    await delay();
    return documentRepository.analytics(tenantId, facilityId);
  },
  async getDocuments(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getDocuments(filters);
  },
  async getDocument(documentId: string) {
    await delay();
    return documentRepository.getDocument(documentId);
  },
  async getFolders(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getFolders(filters);
  },
  async getCategories(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getCategories(filters);
  },
  async getTemplates(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getTemplates(filters);
  },
  async getVersions(documentId: string) {
    await delay();
    return documentRepository.getVersions(documentId);
  },
  async getMetadata(documentId: string) {
    await delay();
    return documentRepository.getMetadata(documentId);
  },
  async getComments(documentId: string) {
    await delay();
    return documentRepository.getComments(documentId);
  },
  async search(query: string, filters?: DocumentFilters) {
    await delay();
    return documentRepository.search(query, filters);
  },
  async getOcrResults(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getOcrResults(filters);
  },
  async getSignatureRequests(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getSignatureRequests(filters);
  },
  async getSignatures(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getSignatures(filters);
  },
  async getSharedLinks(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getSharedLinks(filters);
  },
  async getRetentionPolicies(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getRetentionPolicies(filters);
  },
  async getLegalHolds(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getLegalHolds(filters);
  },
  async getArchives(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getArchives(filters);
  },
  async getRecords(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getRecords(filters);
  },
  async getAccessLogs(filters?: DocumentFilters) {
    await delay();
    return documentRepository.getAccessLogs(filters);
  },

  async uploadDocument(input: UploadDocumentInput) {
    await delay();
    return documentRepository.uploadDocument(input);
  },
  async createFolder(input: CreateFolderInput) {
    await delay();
    return documentRepository.createFolder(input);
  },
  async moveDocument(input: MoveDocumentInput) {
    await delay();
    return documentRepository.moveDocument(input);
  },
  async archiveDocument(documentId: string) {
    await delay();
    return documentRepository.archiveDocument(documentId);
  },
  async restoreDocument(documentId: string) {
    await delay();
    return documentRepository.restoreDocument(documentId);
  },
  async createVersion(input: CreateVersionInput) {
    await delay();
    return documentRepository.createVersion(input);
  },
  async ocrDocument(documentId: string) {
    await delay();
    return documentRepository.ocrDocument(documentId);
  },
  async requestSignature(input: RequestSignatureInput) {
    await delay();
    return documentRepository.requestSignature(input);
  },
  async signDocument(input: SignDocumentInput) {
    await delay();
    return documentRepository.signDocument(input);
  },
  async shareDocument(input: ShareDocumentInput) {
    await delay();
    return documentRepository.shareDocument(input);
  },
  async revokeSharing(input: ShareDocumentLinkInput) {
    await delay();
    return documentRepository.revokeSharing(input);
  },
  async applyRetention(input: ApplyRetentionInput) {
    await delay();
    return documentRepository.applyRetention(input);
  },
  async applyLegalHold(input: ApplyLegalHoldInput) {
    await delay();
    return documentRepository.applyLegalHold(input);
  },

  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return documentRepository.exportData(format);
  },
  async favorite(userId: string, documentId: string) {
    await delay();
    return documentRepository.favorite(userId, documentId);
  },
  async getFavorites(userId: string) {
    await delay();
    return documentRepository.getFavorites(userId);
  },
};
