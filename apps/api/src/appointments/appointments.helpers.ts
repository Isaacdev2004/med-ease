import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated };

export function assertAppointmentFound<T>(
  appointment: T | null | undefined,
  appointmentId?: string,
): asserts appointment is T {
  if (!appointment) {
    throw new NotFoundError('Appointment not found', {
      details: appointmentId ? { appointmentId } : undefined,
    });
  }
}

export function mapAppointmentRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Appointment not found', { cause: error });
  }

  throw error;
}

export function estimateWaitMinutes(queuePosition: number): number {
  return Math.max(5, queuePosition * 10);
}
