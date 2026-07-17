import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { workflowOfflineQueue } from '@/services/workflows/offline-sync';
import { workflowService } from '@/services/workflows/workflow.service';
import type {
  ApproveInput,
  AssignTaskInput,
  CompleteTaskInput,
  CreateRuleInput,
  CreateWorkflowInput,
  EscalateInput,
  RejectInput,
  ScheduleWorkflowInput,
  ShareWorkflowInput,
  StartWorkflowInput,
} from '@/services/workflows/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    workflowOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Workflow update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.workflows.all });
}

export function useWorkflowMutations() {
  const client = useQueryClient();

  const createWorkflow = useMutation({
    mutationFn: (input: CreateWorkflowInput) =>
      runOrQueue('Create workflow', () =>
        workflowService.createWorkflow(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Workflow created.' });
    },
  });

  const publishWorkflow = useMutation({
    mutationFn: (workflowId: string) =>
      runOrQueue('Publish workflow', () =>
        workflowService.publishWorkflow(workflowId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Workflow published.' });
    },
  });

  const startWorkflow = useMutation({
    mutationFn: (input: StartWorkflowInput) =>
      runOrQueue('Start workflow', () => workflowService.startWorkflow(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Workflow started.' });
    },
  });

  const pauseWorkflow = useMutation({
    mutationFn: (instanceId: string) =>
      runOrQueue('Pause workflow', () =>
        workflowService.pauseWorkflow(instanceId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Workflow paused.' });
    },
  });

  const resumeWorkflow = useMutation({
    mutationFn: (instanceId: string) =>
      runOrQueue('Resume workflow', () =>
        workflowService.resumeWorkflow(instanceId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Workflow resumed.' });
    },
  });

  const cancelWorkflow = useMutation({
    mutationFn: (instanceId: string) =>
      runOrQueue('Cancel workflow', () =>
        workflowService.cancelWorkflow(instanceId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Workflow cancelled.' });
    },
  });

  const completeTask = useMutation({
    mutationFn: (input: CompleteTaskInput) =>
      runOrQueue('Complete task', () => workflowService.completeTask(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Task completed.' });
    },
  });

  const assignTask = useMutation({
    mutationFn: (input: AssignTaskInput) =>
      runOrQueue('Assign task', () => workflowService.assignTask(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Task assigned.' });
    },
  });

  const approve = useMutation({
    mutationFn: (input: ApproveInput) =>
      runOrQueue('Approve', () => workflowService.approve(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Approved.' });
    },
  });

  const reject = useMutation({
    mutationFn: (input: RejectInput) =>
      runOrQueue('Reject', () => workflowService.reject(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Rejected.' });
    },
  });

  const escalate = useMutation({
    mutationFn: (input: EscalateInput) =>
      runOrQueue('Escalate', () => workflowService.escalate(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.warning({ title: 'Task escalated.' });
    },
  });

  const createRule = useMutation({
    mutationFn: (input: CreateRuleInput) =>
      runOrQueue('Create rule', () => workflowService.createRule(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Rule created.' });
    },
  });

  const scheduleWorkflow = useMutation({
    mutationFn: (input: ScheduleWorkflowInput) =>
      runOrQueue('Schedule workflow', () =>
        workflowService.scheduleWorkflow(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Schedule created.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export workflows', () => workflowService.exportData(format)),
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
      entityType: 'workflow' | 'instance' | 'template';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        workflowService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const share = useMutation({
    mutationFn: (input: ShareWorkflowInput) =>
      runOrQueue('Share workflow', () => workflowService.share(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Shared successfully.' });
    },
  });

  return {
    createWorkflow,
    publishWorkflow,
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    completeTask,
    assignTask,
    approve,
    reject,
    escalate,
    createRule,
    scheduleWorkflow,
    exportData,
    favorite,
    share,
  };
}
