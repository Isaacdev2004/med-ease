import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { documentService } from '@/services/documents/document.service';
import type { DocumentFilters } from '@/services/documents/types';

export const documentQueries = {
  dashboard: (tenantId?: string, facilityId?: string) => ({
    queryKey: queryKeys.documents.dashboard(tenantId, facilityId),
    queryFn: () => documentService.dashboard(tenantId, facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (tenantId?: string, facilityId?: string) => ({
    queryKey: queryKeys.documents.analytics(tenantId, facilityId),
    queryFn: () => documentService.analytics(tenantId, facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  documents: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.list(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getDocuments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  document: (documentId: string) => ({
    queryKey: queryKeys.documents.detail(documentId),
    queryFn: () => documentService.getDocument(documentId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(documentId),
  }),
  folders: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.folders(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getFolders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  categories: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.categories(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getCategories(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  templates: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.templates(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getTemplates(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  versions: (documentId: string) => ({
    queryKey: queryKeys.documents.versions(documentId),
    queryFn: () => documentService.getVersions(documentId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(documentId),
  }),
  metadata: (documentId: string) => ({
    queryKey: queryKeys.documents.metadata(documentId),
    queryFn: () => documentService.getMetadata(documentId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(documentId),
  }),
  search: (query: string, filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.search(query, filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.search(query, filters),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  ocr: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.ocr(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getOcrResults(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  signatureRequests: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.signatureRequests(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getSignatureRequests(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  signatures: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.signatures(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getSignatures(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  sharedLinks: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.sharedLinks(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getSharedLinks(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  retention: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.retention(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getRetentionPolicies(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  legalHolds: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.legalHolds(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getLegalHolds(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  archives: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.archives(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getArchives(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  records: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.records(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getRecords(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  accessLogs: (filters?: DocumentFilters) => ({
    queryKey: queryKeys.documents.accessLogs(filters as Record<string, unknown> | undefined),
    queryFn: () => documentService.getAccessLogs(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.documents.favorites(userId),
    queryFn: () => documentService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
