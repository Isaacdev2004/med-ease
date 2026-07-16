import { calculateInvoiceTotals } from '@/services/billing/pricing';
import type { CreateInvoiceInput, InvoiceLineItem, PatientInvoice } from '@/services/billing/types';

export function buildInvoice(input: CreateInvoiceInput, invoiceId: string, invoiceNumber: string, patientName: string, facilityName: string, providerName: string): PatientInvoice {
  const lineItems: InvoiceLineItem[] = input.lineItems.map((li, i) => ({
    ...li,
    id: `li-${invoiceId}-${i}`,
    total: li.quantity * li.unitPrice,
  }));
  const { subtotal, discounts, tax, total } = calculateInvoiceTotals(lineItems);
  const now = new Date().toISOString();
  const due = new Date();
  due.setDate(due.getDate() + 30);
  return {
    invoiceId,
    patientId: input.patientId,
    patientName,
    facilityId: input.facilityId,
    facilityName,
    providerId: input.providerId,
    providerName,
    insuranceId: input.insuranceId,
    invoiceNumber,
    issueDate: now,
    dueDate: due.toISOString(),
    subtotal,
    discounts,
    tax,
    total,
    balance: total,
    paidAmount: 0,
    currency: 'EUR',
    status: 'issued',
    lineItems,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
}
