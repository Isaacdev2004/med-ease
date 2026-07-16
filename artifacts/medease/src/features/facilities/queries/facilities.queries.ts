import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { facilitiesService } from '@/services/facilities/facilities.service';
import type { FacilitiesFilters } from '@/services/facilities/types';

export const facilitiesQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.facilities.dashboard(facilityId),
    queryFn: () => facilitiesService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  facilities: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.facilities(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.listFacilities(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  facility: (facilityId: string) => ({
    queryKey: queryKeys.facilities.facility(facilityId),
    queryFn: () => facilitiesService.getFacility(facilityId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(facilityId),
  }),
  buildings: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.buildings(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getBuildings(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  rooms: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.rooms(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getRooms(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  beds: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.bedsList(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getBeds(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  equipment: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.equipment(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getEquipment(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  devices: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.devices(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getBiomedicalDevices(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  maintenance: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.maintenance(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getWorkOrders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  workOrders: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.workOrders(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getWorkOrders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  preventive: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.preventive(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getPreventiveMaintenance(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  calibration: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.calibration(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getCalibration(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  inspection: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.inspection(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getInspections(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  utilities: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.utilities(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getUtilities(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  environment: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.environment(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getEnvironmental(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  vendors: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.vendors(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getVendors(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  contracts: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.contracts(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getContracts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  vehicles: (filters?: FacilitiesFilters) => ({
    queryKey: queryKeys.facilities.vehicles(filters as Record<string, unknown> | undefined),
    queryFn: () => facilitiesService.getVehicles(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.facilities.analytics(facilityId),
    queryFn: () => facilitiesService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.facilities.favorites(userId),
    queryFn: () => facilitiesService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.facilities.search(query, facilityId),
    queryFn: () => facilitiesService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
