import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertCarePlanFound<T>(
  plan: T | null | undefined,
  carePlanId?: string,
): asserts plan is T {
  if (!plan) {
    throw new NotFoundError('Care plan not found', {
      details: carePlanId ? { carePlanId } : undefined,
    });
  }
}

export function assertPathwayFound<T>(
  pathway: T | null | undefined,
  code?: string,
): asserts pathway is T {
  if (!pathway) {
    throw new NotFoundError('Care pathway not found', {
      details: code ? { code } : undefined,
    });
  }
}

export function assertStepFound<T>(
  step: T | null | undefined,
  stepId?: string,
): asserts step is T {
  if (!step) {
    throw new NotFoundError('Care plan step not found', {
      details: stepId ? { stepId } : undefined,
    });
  }
}

export function assertTaskFound<T>(
  task: T | null | undefined,
  taskId?: string,
): asserts task is T {
  if (!task) {
    throw new NotFoundError('Care plan task not found', {
      details: taskId ? { taskId } : undefined,
    });
  }
}

export function mapCarePathwaysRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Care pathway resource not found', {
      cause: error,
    });
  }
  throw error;
}

export function computeProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}
