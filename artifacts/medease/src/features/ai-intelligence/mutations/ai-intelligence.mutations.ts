import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { aiOfflineQueue } from '@/services/ai-intelligence/offline-sync';
import { aiIntelligenceService } from '@/services/ai-intelligence/ai-intelligence.service';
import type {
  ApproveModelDeploymentInput,
  ArchiveModelInput,
  CreateClinicalSummaryInput,
  GeneratePredictionInput,
  RateRecommendationInput,
  ShareAiInput,
  StartCopilotSessionInput,
} from '@/services/ai-intelligence/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    aiOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('AI update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.ai.all });
}

export function useAiIntelligenceMutations() {
  const client = useQueryClient();

  const generatePrediction = useMutation({
    mutationFn: (input: GeneratePredictionInput) =>
      runOrQueue('Generate prediction', () =>
        aiIntelligenceService.generatePrediction(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Prediction generated.' });
    },
  });

  const createClinicalSummary = useMutation({
    mutationFn: (input: CreateClinicalSummaryInput) =>
      runOrQueue('Create clinical summary', () =>
        aiIntelligenceService.createClinicalSummary(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Clinical summary created.' });
    },
  });

  const startCopilotSession = useMutation({
    mutationFn: (input: StartCopilotSessionInput) =>
      runOrQueue('Start copilot session', () =>
        aiIntelligenceService.startCopilotSession(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Copilot session started.' });
    },
  });

  const rateRecommendation = useMutation({
    mutationFn: (input: RateRecommendationInput) =>
      runOrQueue('Rate recommendation', () =>
        aiIntelligenceService.rateRecommendation(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Recommendation rated.' });
    },
  });

  const approveModelDeployment = useMutation({
    mutationFn: (input: ApproveModelDeploymentInput) =>
      runOrQueue('Approve model deployment', () =>
        aiIntelligenceService.approveModelDeployment(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Model approved for deployment.' });
    },
  });

  const archiveModel = useMutation({
    mutationFn: (input: ArchiveModelInput) =>
      runOrQueue('Archive model', () =>
        aiIntelligenceService.archiveModel(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Model archived.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export AI data', () =>
        aiIntelligenceService.exportData(format),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export complete.' });
    },
  });

  const favorite = useMutation({
    mutationFn: ({
      userId,
      entityType,
      entityId,
    }: {
      userId: string;
      entityType:
        'prediction' | 'recommendation' | 'model' | 'summary' | 'forecast';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        aiIntelligenceService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const share = useMutation({
    mutationFn: (input: ShareAiInput) =>
      runOrQueue('Share AI insight', () => aiIntelligenceService.share(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Shared successfully.' });
    },
  });

  return {
    generatePrediction,
    createClinicalSummary,
    startCopilotSession,
    rateRecommendation,
    approveModelDeployment,
    archiveModel,
    exportData,
    favorite,
    share,
  };
}
