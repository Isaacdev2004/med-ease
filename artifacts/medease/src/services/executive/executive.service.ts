import { executiveRepository } from '@/services/executive/repository';
import type {
  AcknowledgeAlertInput,
  ArchiveDashboardInput,
  CreateStrategicInitiativeInput,
  ExecutiveFilters,
  ShareExecutiveInput,
  UpdateKpiTargetInput,
} from '@/services/executive/types';

const DELAY = 250;
async function delay(ms = DELAY) { await new Promise((r) => setTimeout(r, ms)); }

export const executiveService = {
  async dashboard(facilityId?: string) { await delay(); return executiveRepository.dashboard(facilityId); },
  async analytics(facilityId?: string) { await delay(); return executiveRepository.analytics(facilityId); },
  async getEnterpriseKpis(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getEnterpriseKpis(filters); },
  async getOperationalMetrics(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getOperationalMetrics(filters); },
  async getDepartmentScorecards(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getDepartmentScorecards(filters); },
  async getHospitalOperations(facilityId?: string) { await delay(); return executiveRepository.getHospitalOperations(facilityId); },
  async getCapacityAnalytics(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getCapacityAnalytics(filters); },
  async getPatientFlow(facilityId?: string) { await delay(); return executiveRepository.getPatientFlow(facilityId); },
  async getRevenueDashboard(facilityId?: string) { await delay(); return executiveRepository.getRevenueDashboard(facilityId); },
  async getQualityDashboard(facilityId?: string) { await delay(); return executiveRepository.getQualityDashboard(facilityId); },
  async getWorkforceDashboard(facilityId?: string) { await delay(); return executiveRepository.getWorkforceDashboard(facilityId); },
  async getPopulationDashboard(facilityId?: string) { await delay(); return executiveRepository.getPopulationDashboard(facilityId); },
  async getExecutiveForecasts(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getExecutiveForecasts(filters); },
  async getStrategicInitiatives(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getStrategicInitiatives(filters); },
  async getExecutiveAlerts(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getExecutiveAlerts(filters); },
  async getBenchmarkReports(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getBenchmarkReports(filters); },
  async getDashboards(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getDashboards(filters); },
  async getAudit(filters?: ExecutiveFilters) { await delay(); return executiveRepository.getAudit(filters); },

  async createStrategicInitiative(input: CreateStrategicInitiativeInput) { await delay(); return executiveRepository.createStrategicInitiative(input); },
  async updateKpiTarget(input: UpdateKpiTargetInput) { await delay(); return executiveRepository.updateKpiTarget(input); },
  async acknowledgeAlert(input: AcknowledgeAlertInput) { await delay(); return executiveRepository.acknowledgeAlert(input); },
  async archiveDashboard(input: ArchiveDashboardInput) { await delay(); return executiveRepository.archiveDashboard(input); },

  async search(query: string, facilityId?: string) { await delay(); return executiveRepository.search(query, facilityId); },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') { await delay(); return executiveRepository.exportData(format); },
  async favorite(userId: string, entityType: 'dashboard' | 'kpi' | 'initiative' | 'report', entityId: string) { await delay(); return executiveRepository.favorite(userId, entityType, entityId); },
  async getFavorites(userId: string) { await delay(); return executiveRepository.getFavorites(userId); },
  async share(input: ShareExecutiveInput) { await delay(); return executiveRepository.share(input); },
};
