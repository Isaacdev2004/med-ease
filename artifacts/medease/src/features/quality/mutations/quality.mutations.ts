import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { qualityOfflineQueue } from '@/services/quality/offline-sync';
import { qualityService } from '@/services/quality/quality.service';
import type {
  CreateCapaInput,
  CreateIncidentInput,
  CreateRiskInput,
  PublishPolicyInput,
  ScheduleAuditInput,
} from '@/services/quality/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    qualityOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Quality update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.quality.all });
}

export function useQualityMutations() {
  const client = useQueryClient();

  const createIncident = useMutation({
    mutationFn: (input: CreateIncidentInput) =>
      runOrQueue('Create incident', () => qualityService.createIncident(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Incident reported.' });
    },
  });

  const escalateIncident = useMutation({
    mutationFn: (incidentId: string) =>
      runOrQueue('Escalate incident', () =>
        qualityService.escalateIncident(incidentId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Incident escalated.' });
    },
  });

  const createRisk = useMutation({
    mutationFn: (input: CreateRiskInput) =>
      runOrQueue('Create risk', () => qualityService.createRisk(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Risk registered.' });
    },
  });

  const updateRisk = useMutation({
    mutationFn: ({
      riskId,
      updates,
    }: {
      riskId: string;
      updates: Parameters<typeof qualityService.updateRisk>[1];
    }) =>
      runOrQueue('Update risk', () =>
        qualityService.updateRisk(riskId, updates),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Risk updated.' });
    },
  });

  const createCapa = useMutation({
    mutationFn: (input: CreateCapaInput) =>
      runOrQueue('Create CAPA', () => qualityService.createCapa(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'CAPA created.' });
    },
  });

  const closeCapa = useMutation({
    mutationFn: ({
      capaId,
      effectivenessScore,
    }: {
      capaId: string;
      effectivenessScore?: number;
    }) =>
      runOrQueue('Close CAPA', () =>
        qualityService.closeCapa(capaId, effectivenessScore),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'CAPA updated.' });
    },
  });

  const scheduleAudit = useMutation({
    mutationFn: (input: ScheduleAuditInput) =>
      runOrQueue('Schedule audit', () => qualityService.scheduleAudit(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Audit scheduled.' });
    },
  });

  const uploadEvidence = useMutation({
    mutationFn: ({
      auditId,
      findingId,
    }: {
      auditId: string;
      findingId: string;
    }) =>
      runOrQueue('Upload evidence', () =>
        qualityService.uploadEvidence(auditId, findingId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Evidence attached.' });
    },
  });

  const publishPolicy = useMutation({
    mutationFn: (input: PublishPolicyInput) =>
      runOrQueue('Publish policy', () => qualityService.publishPolicy(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Policy published.' });
    },
  });

  const archivePolicy = useMutation({
    mutationFn: (policyId: string) =>
      runOrQueue('Archive policy', () =>
        qualityService.archivePolicy(policyId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Policy archived.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export quality', () => qualityService.exportData(format)),
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
      entityType: 'incident' | 'risk' | 'capa' | 'policy' | 'audit';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        qualityService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  return {
    createIncident,
    escalateIncident,
    createRisk,
    updateRisk,
    createCapa,
    closeCapa,
    scheduleAudit,
    uploadEvidence,
    publishPolicy,
    archivePolicy,
    exportData,
    favorite,
  };
}
