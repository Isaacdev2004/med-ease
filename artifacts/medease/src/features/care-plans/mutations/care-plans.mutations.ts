import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { appToast } from '@/services/api/toast';
import { carePlanOfflineQueue } from '@/services/care-plans/offline-sync';
import { carePlanService } from '@/services/care-plans/care-plan.service';
import type {
  AssignTaskInput,
  CompleteTaskInput,
  CreateCarePlanInput,
  UpdateGoalInput,
} from '@/services/care-plans/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (!navigator.onLine) {
    carePlanOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Care plan update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.carePlans.all });
}

export function useCarePlanMutations() {
  const client = useQueryClient();

  const createCarePlan = useMutation({
    mutationFn: (input: CreateCarePlanInput) =>
      runOrQueue('Create care plan', () =>
        carePlanService.createCarePlan(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Care plan created' });
    },
  });

  const updateGoal = useMutation({
    mutationFn: (input: UpdateGoalInput) =>
      runOrQueue('Update goal', () => carePlanService.updateGoal(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Goal updated' });
    },
  });

  const completeTask = useMutation({
    mutationFn: (input: CompleteTaskInput) =>
      runOrQueue('Complete task', () => carePlanService.completeTask(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Task completed' });
    },
  });

  const assignTask = useMutation({
    mutationFn: (input: AssignTaskInput) =>
      runOrQueue('Assign task', () => carePlanService.assignTask(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Task assigned' });
    },
  });

  const suspendCarePlan = useMutation({
    mutationFn: (id: string) =>
      runOrQueue('Suspend care plan', () =>
        carePlanService.suspendCarePlan(id),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Care plan suspended' });
    },
  });

  const archiveCarePlan = useMutation({
    mutationFn: (id: string) =>
      runOrQueue('Archive care plan', () =>
        carePlanService.archiveCarePlan(id),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Care plan archived' });
    },
  });

  return {
    createCarePlan,
    updateGoal,
    completeTask,
    assignTask,
    suspendCarePlan,
    archiveCarePlan,
  };
}

export const useAssignTask = () => useCarePlanMutations().assignTask;
export const useCompleteTask = () => useCarePlanMutations().completeTask;
export const useUpdateGoal = () => useCarePlanMutations().updateGoal;
