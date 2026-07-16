import { useQuery } from '@tanstack/react-query';

import { documentQueries } from '@/features/documents/queries/document.queries';
import type { DocumentFilters } from '@/services/documents/types';

export function useDocumentDashboard(tenantId?: string, facilityId?: string) {
  return useQuery(documentQueries.dashboard(tenantId, facilityId));
}

export function useDocumentAnalytics(tenantId?: string, facilityId?: string) {
  return useQuery(documentQueries.analytics(tenantId, facilityId));
}

export function useDocuments(filters?: DocumentFilters) {
  return useQuery(documentQueries.documents(filters));
}

export function useDocument(documentId: string) {
  return useQuery(documentQueries.document(documentId));
}

export function useFolders(filters?: DocumentFilters) {
  return useQuery(documentQueries.folders(filters));
}

export function useTemplates(filters?: DocumentFilters) {
  return useQuery(documentQueries.templates(filters));
}

export function useCategories(filters?: DocumentFilters) {
  return useQuery(documentQueries.categories(filters));
}

export function useVersions(documentId: string) {
  return useQuery(documentQueries.versions(documentId));
}

export function useMetadata(documentId: string) {
  return useQuery(documentQueries.metadata(documentId));
}

export function useSearch(query: string, filters?: DocumentFilters) {
  return useQuery(documentQueries.search(query, filters));
}

export function useOCR(filters?: DocumentFilters) {
  return useQuery(documentQueries.ocr(filters));
}

export function useSignatures(filters?: DocumentFilters) {
  return useQuery(documentQueries.signatures(filters));
}

export function useSignatureRequests(filters?: DocumentFilters) {
  return useQuery(documentQueries.signatureRequests(filters));
}

export function useSharedLinks(filters?: DocumentFilters) {
  return useQuery(documentQueries.sharedLinks(filters));
}

export function useRetention(filters?: DocumentFilters) {
  return useQuery(documentQueries.retention(filters));
}

export function useLegalHold(filters?: DocumentFilters) {
  return useQuery(documentQueries.legalHolds(filters));
}

export function useArchives(filters?: DocumentFilters) {
  return useQuery(documentQueries.archives(filters));
}

export function useRecords(filters?: DocumentFilters) {
  return useQuery(documentQueries.records(filters));
}

export function useDocumentFavorites(userId?: string) {
  return useQuery(documentQueries.favorites(userId));
}
