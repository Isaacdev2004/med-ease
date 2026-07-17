import { qualityRepository } from '@/services/quality/repository';
import type {
  CreateCapaInput,
  CreateIncidentInput,
  CreateRiskInput,
  PublishPolicyInput,
  QualityFilters,
  ScheduleAuditInput,
} from '@/services/quality/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const qualityService = {
  async dashboard(facilityId?: string) {
    await delay();
    return qualityRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return qualityRepository.analytics(facilityId);
  },
  async getIncidents(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getIncidents(filters);
  },
  async getIncident(incidentId: string) {
    await delay();
    return qualityRepository.getIncident(incidentId);
  },
  async getRisks(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getRisks(filters);
  },
  async getRiskRegister(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getRiskRegister(filters);
  },
  async getCapa(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getCapa(filters);
  },
  async getAudits(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getAudits(filters);
  },
  async getInspections(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getInspections(filters);
  },
  async getPolicies(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getPolicies(filters);
  },
  async getDocuments(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getDocuments(filters);
  },
  async getAccreditation(framework?: string) {
    await delay();
    return qualityRepository.getAccreditation(framework);
  },
  async getCompliance(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getCompliance(filters);
  },
  async getInfectionControl(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getInfectionControl(filters);
  },
  async getQualityIndicators(filters?: QualityFilters) {
    await delay();
    return qualityRepository.getQualityIndicators(filters);
  },
  async getRootCauseAnalyses(capaId?: string) {
    await delay();
    return qualityRepository.getRootCauseAnalyses(capaId);
  },
  async accreditationGaps() {
    await delay();
    return qualityRepository.accreditationGaps();
  },
  async accreditationFrameworkScores() {
    await delay();
    return qualityRepository.accreditationFrameworkScores();
  },

  async createIncident(input: CreateIncidentInput) {
    await delay();
    return qualityRepository.createIncident(input);
  },
  async escalateIncident(incidentId: string) {
    await delay();
    return qualityRepository.escalateIncident(incidentId);
  },
  async createRisk(input: CreateRiskInput) {
    await delay();
    return qualityRepository.createRisk(input);
  },
  async updateRisk(
    riskId: string,
    updates: Parameters<typeof qualityRepository.updateRisk>[1],
  ) {
    await delay();
    return qualityRepository.updateRisk(riskId, updates);
  },
  async createCapa(input: CreateCapaInput) {
    await delay();
    return qualityRepository.createCapa(input);
  },
  async closeCapa(capaId: string, effectivenessScore?: number) {
    await delay();
    return qualityRepository.closeCapa(capaId, effectivenessScore);
  },
  async scheduleAudit(input: ScheduleAuditInput) {
    await delay();
    return qualityRepository.scheduleAudit(input);
  },
  async uploadEvidence(auditId: string, findingId: string) {
    await delay();
    return qualityRepository.uploadEvidence(auditId, findingId);
  },
  async publishPolicy(input: PublishPolicyInput) {
    await delay();
    return qualityRepository.publishPolicy(input);
  },
  async archivePolicy(policyId: string) {
    await delay();
    return qualityRepository.archivePolicy(policyId);
  },

  async search(query: string, facilityId?: string) {
    await delay();
    return qualityRepository.search(query, facilityId);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return qualityRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'incident' | 'risk' | 'capa' | 'policy' | 'audit',
    entityId: string,
  ) {
    await delay();
    return qualityRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return qualityRepository.getFavorites(userId);
  },
};
