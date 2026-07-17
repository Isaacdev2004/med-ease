export { documentService } from '@/services/documents/document.service';
export { documentRepository } from '@/services/documents/repository';
export { documentOfflineQueue } from '@/services/documents/offline-sync';
export {
  computeDocumentAnalytics,
  buildDocumentDashboard,
} from '@/services/documents/analytics';
export {
  MOCK_DOCUMENTS,
  MOCK_FOLDERS,
  MOCK_CATEGORIES,
  MOCK_TAGS,
  MOCK_TEMPLATES,
  MOCK_VERSIONS,
  MOCK_OCR_RESULTS,
  MOCK_SIGNATURE_REQUESTS,
  MOCK_SIGNATURES,
  MOCK_SHARED_LINKS,
  MOCK_RETENTION_POLICIES,
  MOCK_LEGAL_HOLDS,
  MOCK_RECORDS,
  MOCK_ARCHIVE_JOBS,
  MOCK_ACCESS_LOGS,
  MOCK_CONTENT_INDEX,
} from '@/services/documents/mock-data';
