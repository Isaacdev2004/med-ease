import { aiIntelligenceRepository } from '@/services/ai-intelligence/repository';
import type {
  AiIntelligenceFilters,
  ApproveModelDeploymentInput,
  ArchiveModelInput,
  CreateClinicalSummaryInput,
  GeneratePredictionInput,
  RateRecommendationInput,
  ShareAiInput,
  StartCopilotSessionInput,
} from '@/services/ai-intelligence/types';

const DELAY = 250;
async function delay(ms = DELAY) { await new Promise((r) => setTimeout(r, ms)); }

export const aiIntelligenceService = {
  async dashboard(facilityId?: string) { await delay(); return aiIntelligenceRepository.dashboard(facilityId); },
  async analytics(facilityId?: string) { await delay(); return aiIntelligenceRepository.analytics(facilityId); },
  async getPredictions(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getPredictions(filters); },
  async getPrediction(predictionId: string) { await delay(); return aiIntelligenceRepository.getPrediction(predictionId); },
  async getRiskScores(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getRiskScores(filters); },
  async getRecommendations(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getRecommendations(filters); },
  async getCopilotSessions(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getCopilotSessions(filters); },
  async getCopilotSession(sessionId: string) { await delay(); return aiIntelligenceRepository.getCopilotSession(sessionId); },
  async getClinicalSummaries(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getClinicalSummaries(filters); },
  async getForecasts(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getForecasts(filters); },
  async getModelRegistry(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getModelRegistry(filters); },
  async getModel(modelId: string) { await delay(); return aiIntelligenceRepository.getModel(modelId); },
  async getModelPerformance(modelId?: string) { await delay(); return aiIntelligenceRepository.getModelPerformance(modelId); },
  async getBiasMonitoring(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getBiasMonitoring(filters); },
  async getExplainability(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getExplainability(filters); },
  async getExplainabilityReport(reportId: string) { await delay(); return aiIntelligenceRepository.getExplainabilityReport(reportId); },
  async getAlerts(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getAlerts(filters); },
  async getAudit(filters?: AiIntelligenceFilters) { await delay(); return aiIntelligenceRepository.getAudit(filters); },

  async generatePrediction(input: GeneratePredictionInput) { await delay(); return aiIntelligenceRepository.generatePrediction(input); },
  async createClinicalSummary(input: CreateClinicalSummaryInput) { await delay(); return aiIntelligenceRepository.createClinicalSummary(input); },
  async startCopilotSession(input: StartCopilotSessionInput) { await delay(); return aiIntelligenceRepository.startCopilotSession(input); },
  async rateRecommendation(input: RateRecommendationInput) { await delay(); return aiIntelligenceRepository.rateRecommendation(input); },
  async approveModelDeployment(input: ApproveModelDeploymentInput) { await delay(); return aiIntelligenceRepository.approveModelDeployment(input); },
  async archiveModel(input: ArchiveModelInput) { await delay(); return aiIntelligenceRepository.archiveModel(input); },

  async search(query: string, facilityId?: string) { await delay(); return aiIntelligenceRepository.search(query, facilityId); },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') { await delay(); return aiIntelligenceRepository.exportData(format); },
  async favorite(userId: string, entityType: 'prediction' | 'recommendation' | 'model' | 'summary' | 'forecast', entityId: string) { await delay(); return aiIntelligenceRepository.favorite(userId, entityType, entityId); },
  async getFavorites(userId: string) { await delay(); return aiIntelligenceRepository.getFavorites(userId); },
  async share(input: ShareAiInput) { await delay(); return aiIntelligenceRepository.share(input); },
};
