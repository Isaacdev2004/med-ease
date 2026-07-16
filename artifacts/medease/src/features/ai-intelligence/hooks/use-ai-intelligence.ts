import { useQuery } from '@tanstack/react-query';

import { aiIntelligenceQueries } from '@/features/ai-intelligence/queries/ai-intelligence.queries';
import type { AiIntelligenceFilters } from '@/services/ai-intelligence/types';

export function useAiDashboard(facilityId?: string) {
  return useQuery(aiIntelligenceQueries.dashboard(facilityId));
}

export function useAiAnalytics(facilityId?: string) {
  return useQuery(aiIntelligenceQueries.analytics(facilityId));
}

export function usePredictions(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.predictions(filters));
}

export function usePrediction(predictionId: string) {
  return useQuery(aiIntelligenceQueries.prediction(predictionId));
}

export function useRiskScores(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.riskScores(filters));
}

export function useRecommendations(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.recommendations(filters));
}

export function useClinicalCopilot(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.copilotSessions(filters));
}

export function useClinicalSummaries(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.clinicalSummaries(filters));
}

export function useForecasts(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.forecasts(filters));
}

export function useModelRegistry(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.modelRegistry(filters));
}

export function useModelPerformance(modelId?: string) {
  return useQuery(aiIntelligenceQueries.modelPerformance(modelId));
}

export function useBiasMonitoring(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.biasMonitoring(filters));
}

export function useExplainability(filters?: AiIntelligenceFilters) {
  return useQuery(aiIntelligenceQueries.explainability(filters));
}

export function useAiSearch(query: string, facilityId?: string) {
  return useQuery(aiIntelligenceQueries.search(query, facilityId));
}

export function useAiFavorites(userId?: string) {
  return useQuery(aiIntelligenceQueries.favorites(userId));
}
