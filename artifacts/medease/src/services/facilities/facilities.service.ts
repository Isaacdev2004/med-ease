import { facilitiesRepository } from '@/services/facilities/repository';
import type {
  AssignWorkOrderInput,
  CreateMaintenanceRequestInput,
  FacilitiesFilters,
  RecordCalibrationInput,
  ReportIncidentInput,
} from '@/services/facilities/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const facilitiesService = {
  async listFacilities(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.listFacilities(filters);
  },
  async getFacility(facilityId: string) {
    await delay();
    return facilitiesRepository.getFacility(facilityId);
  },
  async getBuildings(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getBuildings(filters);
  },
  async getRooms(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getRooms(filters);
  },
  async getBeds(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getBeds(filters);
  },
  async listBeds(facilityId: string) {
    await delay();
    return facilitiesRepository.listBeds(facilityId);
  },
  async getEquipment(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getEquipment(filters);
  },
  async getBiomedicalDevices(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getBiomedicalDevices(filters);
  },
  async getWorkOrders(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getWorkOrders(filters);
  },
  async getPreventiveMaintenance(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getPreventiveMaintenance(filters);
  },
  async getCalibration(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getCalibration(filters);
  },
  async getInspections(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getInspections(filters);
  },
  async getUtilities(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getUtilities(filters);
  },
  async getEnvironmental(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getEnvironmental(filters);
  },
  async getVendors(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getVendors(filters);
  },
  async getContracts(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getContracts(filters);
  },
  async getVehicles(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getVehicles(filters);
  },
  async getSensors(filters?: FacilitiesFilters) {
    await delay();
    return facilitiesRepository.getSensors(filters);
  },

  async createMaintenanceRequest(input: CreateMaintenanceRequestInput) {
    await delay();
    return facilitiesRepository.createMaintenanceRequest(input);
  },
  async assignWorkOrder(input: AssignWorkOrderInput) {
    await delay();
    return facilitiesRepository.assignWorkOrder(input);
  },
  async completeWorkOrder(workOrderId: string) {
    await delay();
    return facilitiesRepository.completeWorkOrder(workOrderId);
  },
  async schedulePreventive(scheduleId: string, performedDate: string) {
    await delay();
    return facilitiesRepository.schedulePreventive(scheduleId, performedDate);
  },
  async recordCalibration(input: RecordCalibrationInput) {
    await delay();
    return facilitiesRepository.recordCalibration(input);
  },
  async recordInspection(inspectionId: string, passed: boolean) {
    await delay();
    return facilitiesRepository.recordInspection(inspectionId, passed);
  },
  async reportIncident(input: ReportIncidentInput) {
    await delay();
    return facilitiesRepository.reportIncident(input);
  },
  async updateEquipment(equipmentId: string, status: string) {
    await delay();
    return facilitiesRepository.updateEquipment(equipmentId, status);
  },
  async archiveEquipment(equipmentId: string) {
    await delay();
    return facilitiesRepository.archiveEquipment(equipmentId);
  },

  async dashboard(facilityId?: string) {
    await delay();
    return facilitiesRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return facilitiesRepository.analytics(facilityId);
  },
  async search(query: string, facilityId?: string) {
    await delay();
    return facilitiesRepository.search(query, facilityId);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return facilitiesRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'equipment' | 'building' | 'work_order' | 'room',
    entityId: string,
  ) {
    await delay();
    return facilitiesRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return facilitiesRepository.getFavorites(userId);
  },
};
