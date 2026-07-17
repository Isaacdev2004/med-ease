import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { aiIntelligenceService } from '@/services/ai-intelligence/ai-intelligence.service';
import type { AiIntelligenceFilters } from '@/services/ai-intelligence/types';

export const aiIntelligenceQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.ai.dashboard(facilityId),
    queryFn: () => aiIntelligenceService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.ai.analytics(facilityId),
    queryFn: () => aiIntelligenceService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  predictions: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.predictions(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getPredictions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  prediction: (predictionId: string) => ({
    queryKey: queryKeys.ai.prediction(predictionId),
    queryFn: () => aiIntelligenceService.getPrediction(predictionId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(predictionId),
  }),
  riskScores: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.riskScores(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getRiskScores(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  recommendations: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.recommendations(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getRecommendations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  copilotSessions: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.copilotSessions(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getCopilotSessions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  clinicalSummaries: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.clinicalSummaries(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getClinicalSummaries(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  forecasts: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.forecasts(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getForecasts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  modelRegistry: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.modelRegistry(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getModelRegistry(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  modelPerformance: (modelId?: string) => ({
    queryKey: queryKeys.ai.modelPerformance(modelId),
    queryFn: () => aiIntelligenceService.getModelPerformance(modelId),
    staleTime: CACHE_TIMES.patientList,
  }),
  biasMonitoring: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.biasMonitoring(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getBiasMonitoring(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  explainability: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.explainability(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getExplainability(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audit: (filters?: AiIntelligenceFilters) => ({
    queryKey: queryKeys.ai.audit(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => aiIntelligenceService.getAudit(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.ai.search(query, facilityId),
    queryFn: () => aiIntelligenceService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.ai.favorites(userId),
    queryFn: () => aiIntelligenceService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
