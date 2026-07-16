import type { Payment, Receipt } from '@/services/billing/types';

export function generateReceipt(payment: Payment, receiptId: string): Receipt {
  return {
    receiptId,
    paymentId: payment.paymentId,
    invoiceId: payment.invoiceId,
    patientId: payment.patientId,
    amount: payment.amount,
    currency: payment.currency,
    issuedAt: payment.paidAt,
    receiptNumber: `RCP-${Date.now()}`,
    paymentMethod: payment.method,
    downloadUrl: `/mock/receipts/${receiptId}.pdf`,
  };
}
