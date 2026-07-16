import { useQuery } from '@tanstack/react-query';

import { facilitiesQueries } from '@/features/facilities/queries/facilities.queries';
import type { FacilitiesFilters } from '@/services/facilities/types';

export function useFacilitiesDashboard(facilityId?: string) {
  return useQuery(facilitiesQueries.dashboard(facilityId));
}

export function useFacilities(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.facilities(filters));
}

export function useFacility(facilityId: string) {
  return useQuery(facilitiesQueries.facility(facilityId));
}

export function useBuildings(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.buildings(filters));
}

export function useRooms(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.rooms(filters));
}

export function useBeds(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.beds(filters));
}

export function useEquipment(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.equipment(filters));
}

export function useBiomedicalDevices(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.devices(filters));
}

export function useMaintenance(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.maintenance(filters));
}

export function useWorkOrders(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.workOrders(filters));
}

export function usePreventiveMaintenance(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.preventive(filters));
}

export function useCalibration(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.calibration(filters));
}

export function useUtilities(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.utilities(filters));
}

export function useEnvironmentalMonitoring(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.environment(filters));
}

export function useVendors(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.vendors(filters));
}

export function useContracts(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.contracts(filters));
}

export function useVehicles(filters?: FacilitiesFilters) {
  return useQuery(facilitiesQueries.vehicles(filters));
}

export function useFacilitiesAnalytics(facilityId?: string) {
  return useQuery(facilitiesQueries.analytics(facilityId));
}

export function useFacilitySearch(query: string, facilityId?: string) {
  return useQuery(facilitiesQueries.search(query, facilityId));
}

export function useFavorites(userId?: string) {
  return useQuery(facilitiesQueries.favorites(userId));
}
