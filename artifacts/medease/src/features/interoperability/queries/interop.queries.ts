import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { interoperabilityService } from '@/services/interoperability/interoperability.service';
import type { InteropFilters } from '@/services/interoperability/types';

export const interopQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.interoperability.dashboard(facilityId),
    queryFn: () => interoperabilityService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.interoperability.analytics(facilityId),
    queryFn: () => interoperabilityService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  endpoints: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.endpoints(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getEndpoints(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  fhirServers: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.fhirServers(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getFhirServers(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  hl7: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.hl7(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getHl7Messages(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  dicom: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.dicom(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getDicomStudies(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  cda: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.cda(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getCdaDocuments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  mappings: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.mappings(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getMappings(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  subscriptions: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.subscriptions(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getSubscriptions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  queue: () => ({
    queryKey: queryKeys.interoperability.queue(),
    queryFn: () => interoperabilityService.getQueue(),
    staleTime: CACHE_TIMES.default,
  }),
  jobs: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.jobs(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getJobs(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  webhooks: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.webhooks(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getWebhooks(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  apiClients: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.apiClients(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getApiClients(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  smartApps: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.smartApps(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getSmartApps(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audit: (filters?: InteropFilters) => ({
    queryKey: queryKeys.interoperability.audit(filters as Record<string, unknown> | undefined),
    queryFn: () => interoperabilityService.getAudit(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  terminology: () => ({
    queryKey: queryKeys.interoperability.terminology(),
    queryFn: () => interoperabilityService.getTerminology(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.interoperability.favorites(userId),
    queryFn: () => interoperabilityService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.interoperability.search(query, facilityId),
    queryFn: () => interoperabilityService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
