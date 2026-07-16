import { cdssRepository } from '@/services/cdss/repository';
import type {
  AcknowledgeAlertInput,
  ApplyRecommendationInput,
  CalculateRiskInput,
  CdssFilters,
  CreateGuidelineInput,
  OverrideAlertInput,
  PublishProtocolInput,
  UpdateRuleInput,
} from '@/services/cdss/types';

const DELAY = 250;
async function delay(ms = DELAY) { await new Promise((r) => setTimeout(r, ms)); }

export const cdssService = {
  async dashboard(facilityId?: string) { await delay(); return cdssRepository.dashboard(facilityId); },
  async analytics(facilityId?: string) { await delay(); return cdssRepository.analytics(facilityId); },
  async getAlerts(filters?: CdssFilters) { await delay(); return cdssRepository.getAlerts(filters); },
  async getRecommendations(filters?: CdssFilters) { await delay(); return cdssRepository.getRecommendations(filters); },
  async getGuidelines(filters?: CdssFilters) { await delay(); return cdssRepository.getGuidelines(filters); },
  async getOrderSets(filters?: CdssFilters) { await delay(); return cdssRepository.getOrderSets(filters); },
  async getPathways(filters?: CdssFilters) { await delay(); return cdssRepository.getPathways(filters); },
  async getCalculators() { await delay(); return cdssRepository.getCalculators(); },
  async getDiagnostics(filters?: CdssFilters) { await delay(); return cdssRepository.getDiagnostics(filters); },
  async getDrugSafety(filters?: CdssFilters) { await delay(); return cdssRepository.getDrugSafety(filters); },
  async getPreventiveCare(filters?: CdssFilters) { await delay(); return cdssRepository.getPreventiveCare(filters); },
  async getRules(filters?: CdssFilters) { await delay(); return cdssRepository.getRules(filters); },
  async getProtocols(filters?: CdssFilters) { await delay(); return cdssRepository.getProtocols(filters); },
  async getEvidence(filters?: CdssFilters) { await delay(); return cdssRepository.getEvidence(filters); },
  async getDecisionTrees() { await delay(); return cdssRepository.getDecisionTrees(); },
  async getAudit(filters?: CdssFilters) { await delay(); return cdssRepository.getAudit(filters); },
  async getTimeline(facilityId?: string) { await delay(); return cdssRepository.getTimeline(facilityId); },

  async acknowledgeAlert(input: AcknowledgeAlertInput) { await delay(); return cdssRepository.acknowledgeAlert(input); },
  async overrideAlert(input: OverrideAlertInput) { await delay(); return cdssRepository.overrideAlert(input); },
  async applyRecommendation(input: ApplyRecommendationInput) { await delay(); return cdssRepository.applyRecommendation(input); },
  async createGuideline(input: CreateGuidelineInput) { await delay(); return cdssRepository.createGuideline(input); },
  async updateRule(input: UpdateRuleInput) { await delay(); return cdssRepository.updateRule(input); },
  async publishProtocol(input: PublishProtocolInput) { await delay(); return cdssRepository.publishProtocol(input); },
  async calculateRisk(input: CalculateRiskInput) { await delay(); return cdssRepository.calculateRisk(input); },

  async search(query: string, facilityId?: string) { await delay(); return cdssRepository.search(query, facilityId); },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') { await delay(); return cdssRepository.exportData(format); },
  async favorite(userId: string, entityType: 'guideline' | 'order_set' | 'calculator' | 'pathway' | 'rule', entityId: string) { await delay(); return cdssRepository.favorite(userId, entityType, entityId); },
  async getFavorites(userId: string) { await delay(); return cdssRepository.getFavorites(userId); },
};
