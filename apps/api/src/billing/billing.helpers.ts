import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertInvoiceFound<T>(
  invoice: T | null | undefined,
  invoiceId?: string,
): asserts invoice is T {
  if (!invoice) {
    throw new NotFoundError('Invoice not found', {
      details: invoiceId ? { invoiceId } : undefined,
    });
  }
}

export function assertClaimFound<T>(
  claim: T | null | undefined,
  claimId?: string,
): asserts claim is T {
  if (!claim) {
    throw new NotFoundError('Insurance claim not found', {
      details: claimId ? { claimId } : undefined,
    });
  }
}

export function assertPaymentFound<T>(
  payment: T | null | undefined,
  paymentId?: string,
): asserts payment is T {
  if (!payment) {
    throw new NotFoundError('Payment not found', {
      details: paymentId ? { paymentId } : undefined,
    });
  }
}

export function mapBillingRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Billing resource not found', { cause: error });
  }
  throw error;
}
