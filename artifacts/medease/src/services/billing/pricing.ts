import type { InvoiceLineItem } from '@/services/billing/types';

export function calculateLineTotal(
  item: Omit<InvoiceLineItem, 'id' | 'total'>,
) {
  return item.quantity * item.unitPrice;
}

export function calculateInvoiceTotals(
  lineItems: InvoiceLineItem[],
  discountPercent = 0,
  taxRate = 0.1,
) {
  const subtotal = lineItems.reduce((s, li) => s + li.total, 0);
  const discounts = Math.round(subtotal * discountPercent);
  const taxable = subtotal - discounts;
  const tax = Math.round(taxable * taxRate);
  const total = taxable + tax;
  return { subtotal, discounts, tax, total };
}

export function applyDiscount(subtotal: number, discountAmount: number) {
  return Math.max(0, subtotal - discountAmount);
}
