import type { Payment, PaymentMethod, RecordPaymentInput } from '@/services/billing/types';

const ADAPTERS: Record<PaymentMethod, { name: string; process: (amount: number, ref: string) => Promise<{ success: boolean }> }> = {
  cash: { name: 'Cash', process: async () => ({ success: true }) },
  card: { name: 'Card', process: async () => ({ success: true }) },
  bank_transfer: { name: 'Bank Transfer', process: async () => ({ success: true }) },
  insurance: { name: 'Insurance', process: async () => ({ success: true }) },
  wallet: { name: 'Wallet', process: async () => ({ success: true }) },
  stripe: { name: 'Stripe', process: async () => ({ success: true }) },
  paystack: { name: 'Paystack', process: async () => ({ success: true }) },
  flutterwave: { name: 'Flutterwave', process: async () => ({ success: true }) },
  mobile_money: { name: 'Mobile Money', process: async () => ({ success: true }) },
};

export function getPaymentAdapter(method: PaymentMethod) {
  return ADAPTERS[method];
}

export async function processPayment(input: RecordPaymentInput, paymentId: string, patientId: string): Promise<Payment> {
  const adapter = getPaymentAdapter(input.method);
  const ref = input.reference ?? `REF-${Date.now()}`;
  const result = await adapter.process(input.amount, ref);
  const now = new Date().toISOString();
  return {
    paymentId,
    invoiceId: input.invoiceId,
    patientId,
    amount: input.amount,
    currency: 'EUR',
    method: input.method,
    status: result.success ? 'completed' : 'failed',
    reference: ref,
    paidAt: now,
    installmentNumber: input.installmentNumber,
    totalInstallments: input.totalInstallments,
    retryCount: 0,
    createdAt: now,
  };
}

export function retryPayment(payment: Payment): Payment {
  return { ...payment, retryCount: payment.retryCount + 1, status: 'processing' };
}

export function splitPayment(total: number, parts: number[]) {
  const sum = parts.reduce((s, p) => s + p, 0);
  if (Math.abs(sum - total) > 0.01) throw new Error('Split amounts must equal total');
  return parts.map((amount, i) => ({ installmentNumber: i + 1, totalInstallments: parts.length, amount }));
}
