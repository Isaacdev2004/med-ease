import { platformAdminRepository } from '@/services/platform-admin/repository';
import type {
  CreateTenantInput,
  PlatformFilters,
  ScheduleMaintenanceInput,
  ToggleFeatureFlagInput,
  TriggerBackupInput,
  UpdateBrandingInput,
  UpdateFacilityInput,
  UpdateHospitalInput,
  UpdateLocalizationInput,
} from '@/services/platform-admin/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const platformAdminService = {
  async dashboard(tenantId?: string) {
    await delay();
    return platformAdminRepository.dashboard(tenantId);
  },
  async analytics(tenantId?: string) {
    await delay();
    return platformAdminRepository.analytics(tenantId);
  },

  async getTenants(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getTenants(filters);
  },
  async getTenant(tenantId: string) {
    await delay();
    return platformAdminRepository.getTenant(tenantId);
  },
  async getHospitals(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getHospitals(filters);
  },
  async getHospital(hospitalId: string) {
    await delay();
    return platformAdminRepository.getHospital(hospitalId);
  },
  async getFacilities(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getFacilities(filters);
  },
  async getFacility(facilityId: string) {
    await delay();
    return platformAdminRepository.getFacility(facilityId);
  },
  async getDepartments(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getDepartments(filters);
  },
  async getLocalization(tenantId?: string) {
    await delay();
    return platformAdminRepository.getLocalization(tenantId);
  },
  async getLocalizations(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getLocalizations(filters);
  },
  async getBranding(tenantId?: string) {
    await delay();
    return platformAdminRepository.getBranding(tenantId);
  },
  async getBrandingList(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getBrandingList(filters);
  },
  async getLicenses(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getLicenses(filters);
  },
  async getSubscriptions(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getSubscriptions(filters);
  },
  async getStorage(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getStorage(filters);
  },
  async getFeatureFlags(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getFeatureFlags(filters);
  },
  async getJobs(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getJobs(filters);
  },
  async getWorkers() {
    await delay();
    return platformAdminRepository.getWorkers();
  },
  async getQueues() {
    await delay();
    return platformAdminRepository.getQueues();
  },
  async getSystemHealth() {
    await delay();
    return platformAdminRepository.getSystemHealth();
  },
  async getBackups(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getBackups(filters);
  },
  async getMaintenance(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getMaintenance(filters);
  },
  async getAudits(filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.getAudits(filters);
  },
  async getEmailServers(tenantId?: string) {
    await delay();
    return platformAdminRepository.getEmailServers(tenantId);
  },
  async getSmsServers(tenantId?: string) {
    await delay();
    return platformAdminRepository.getSmsServers(tenantId);
  },
  async getConfigurations(tenantId?: string) {
    await delay();
    return platformAdminRepository.getConfigurations(tenantId);
  },

  async createTenant(input: CreateTenantInput) {
    await delay();
    return platformAdminRepository.createTenant(input);
  },
  async activateTenant(tenantId: string) {
    await delay();
    return platformAdminRepository.activateTenant(tenantId);
  },
  async suspendTenant(tenantId: string) {
    await delay();
    return platformAdminRepository.suspendTenant(tenantId);
  },
  async updateHospital(input: UpdateHospitalInput) {
    await delay();
    return platformAdminRepository.updateHospital(input);
  },
  async updateFacility(input: UpdateFacilityInput) {
    await delay();
    return platformAdminRepository.updateFacility(input);
  },
  async updateLocalization(input: UpdateLocalizationInput) {
    await delay();
    return platformAdminRepository.updateLocalization(input);
  },
  async updateBranding(input: UpdateBrandingInput) {
    await delay();
    return platformAdminRepository.updateBranding(input);
  },
  async toggleFeatureFlag(input: ToggleFeatureFlagInput) {
    await delay();
    return platformAdminRepository.toggleFeatureFlag(input);
  },
  async retryJob(jobId: string) {
    await delay();
    return platformAdminRepository.retryJob(jobId);
  },
  async scheduleMaintenance(input: ScheduleMaintenanceInput) {
    await delay();
    return platformAdminRepository.scheduleMaintenance(input);
  },
  async triggerBackup(input: TriggerBackupInput) {
    await delay();
    return platformAdminRepository.triggerBackup(input);
  },

  async search(query: string, filters?: PlatformFilters) {
    await delay();
    return platformAdminRepository.search(query, filters);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return platformAdminRepository.exportData(format);
  },
};
