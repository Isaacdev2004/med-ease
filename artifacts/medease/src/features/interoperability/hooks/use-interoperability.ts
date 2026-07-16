import { useQuery } from '@tanstack/react-query';

import { interopQueries } from '@/features/interoperability/queries/interop.queries';
import type { InteropFilters } from '@/services/interoperability/types';

export function useInteroperabilityDashboard(facilityId?: string) {
  return useQuery(interopQueries.dashboard(facilityId));
}

export function useInteroperabilityAnalytics(facilityId?: string) {
  return useQuery(interopQueries.analytics(facilityId));
}

export function useIntegrationEndpoints(filters?: InteropFilters) {
  return useQuery(interopQueries.endpoints(filters));
}

export function useFhirServers(filters?: InteropFilters) {
  return useQuery(interopQueries.fhirServers(filters));
}

export function useHl7Messages(filters?: InteropFilters) {
  return useQuery(interopQueries.hl7(filters));
}

export function useDicomStudies(filters?: InteropFilters) {
  return useQuery(interopQueries.dicom(filters));
}

export function useCdaDocuments(filters?: InteropFilters) {
  return useQuery(interopQueries.cda(filters));
}

export function useMappings(filters?: InteropFilters) {
  return useQuery(interopQueries.mappings(filters));
}

export function useSubscriptions(filters?: InteropFilters) {
  return useQuery(interopQueries.subscriptions(filters));
}

export function useIntegrationQueue() {
  return useQuery(interopQueries.queue());
}

export function useApiClients(filters?: InteropFilters) {
  return useQuery(interopQueries.apiClients(filters));
}

export function useWebhooks(filters?: InteropFilters) {
  return useQuery(interopQueries.webhooks(filters));
}

export function useSmartApps(filters?: InteropFilters) {
  return useQuery(interopQueries.smartApps(filters));
}

export function useIntegrationAudit(filters?: InteropFilters) {
  return useQuery(interopQueries.audit(filters));
}

export function useTerminology() {
  return useQuery(interopQueries.terminology());
}

export function useInteropSearch(query: string, facilityId?: string) {
  return useQuery(interopQueries.search(query, facilityId));
}

export function useInteropFavorites(userId?: string) {
  return useQuery(interopQueries.favorites(userId));
}
