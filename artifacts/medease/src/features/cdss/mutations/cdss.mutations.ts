import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { cdssOfflineQueue } from '@/services/cdss/offline-sync';
import { cdssService } from '@/services/cdss/cdss.service';
import type {
  AcknowledgeAlertInput,
  ApplyRecommendationInput,
  CalculateRiskInput,
  CalculatorResult,
  CreateGuidelineInput,
  OverrideAlertInput,
  PublishProtocolInput,
  UpdateRuleInput,
} from '@/services/cdss/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    cdssOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('CDSS update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.cdss.all });
}

export function useCdssMutations() {
  const client = useQueryClient();

  const acknowledgeAlert = useMutation({
    mutationFn: (input: AcknowledgeAlertInput) => runOrQueue('Acknowledge alert', () => cdssService.acknowledgeAlert(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Alert acknowledged.' }); },
  });

  const overrideAlert = useMutation({
    mutationFn: (input: OverrideAlertInput) => runOrQueue('Override alert', () => cdssService.overrideAlert(input)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'Alert overridden.' }); },
  });

  const applyRecommendation = useMutation({
    mutationFn: (input: ApplyRecommendationInput) => runOrQueue('Apply recommendation', () => cdssService.applyRecommendation(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Recommendation applied.' }); },
  });

  const createGuideline = useMutation({
    mutationFn: (input: CreateGuidelineInput) => runOrQueue('Create guideline', () => cdssService.createGuideline(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Guideline created.' }); },
  });

  const updateRule = useMutation({
    mutationFn: (input: UpdateRuleInput) => runOrQueue('Update rule', () => cdssService.updateRule(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Rule updated.' }); },
  });

  const publishProtocol = useMutation({
    mutationFn: (input: PublishProtocolInput) => runOrQueue('Publish protocol', () => cdssService.publishProtocol(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Protocol published.' }); },
  });

  const calculateRisk = useMutation({
    mutationFn: (input: CalculateRiskInput) => runOrQueue('Calculate risk', () => cdssService.calculateRisk(input)) as Promise<CalculatorResult | null>,
    onSuccess: () => invalidateAll(client),
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export CDSS', () => cdssService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  const favorite = useMutation({
    mutationFn: ({ userId, entityType, entityId }: { userId: string; entityType: 'guideline' | 'order_set' | 'calculator' | 'pathway' | 'rule'; entityId: string }) =>
      runOrQueue('Favorite', () => cdssService.favorite(userId, entityType, entityId)),
    onSuccess: () => invalidateAll(client),
  });

  return {
    acknowledgeAlert,
    overrideAlert,
    applyRecommendation,
    createGuideline,
    updateRule,
    publishProtocol,
    calculateRisk,
    exportData,
    favorite,
  };
}
