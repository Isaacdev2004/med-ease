import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertObservationFound<T>(
  observation: T | null | undefined,
  observationId?: string,
): asserts observation is T {
  if (!observation) {
    throw new NotFoundError('Monitoring observation not found', {
      details: observationId ? { observationId } : undefined,
    });
  }
}

export function assertAlertFound<T>(
  alert: T | null | undefined,
  alertId?: string,
): asserts alert is T {
  if (!alert) {
    throw new NotFoundError('Monitoring alert not found', {
      details: alertId ? { alertId } : undefined,
    });
  }
}

export function assertDeviceFound<T>(
  device: T | null | undefined,
  deviceId?: string,
): asserts device is T {
  if (!device) {
    throw new NotFoundError('Monitoring device not found', {
      details: deviceId ? { deviceId } : undefined,
    });
  }
}

export function assertProgramFound<T>(
  program: T | null | undefined,
  programId?: string,
): asserts program is T {
  if (!program) {
    throw new NotFoundError('Monitoring program not found', {
      details: programId ? { programId } : undefined,
    });
  }
}

export function mapMonitoringRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Monitoring resource not found', { cause: error });
  }
  throw error;
}
