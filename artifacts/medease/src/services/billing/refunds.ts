import type { Payment, Refund, RefundPaymentInput } from '@/services/billing/types';

export function processRefund(input: RefundPaymentInput, payment: Payment, refundId: string): Refund {
  const now = new Date().toISOString();
  return {
    refundId,
    paymentId: input.paymentId,
    invoiceId: payment.invoiceId,
    patientId: payment.patientId,
    amount: input.amount,
    currency: payment.currency,
    reason: input.reason,
    status: 'completed',
    processedAt: now,
    createdAt: now,
  };
}
