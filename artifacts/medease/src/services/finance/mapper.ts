import type { ChartOfAccount, CustomerReceivable, JournalEntry, VendorBill } from '@/services/finance/types';

export function toFhirAccount(account: ChartOfAccount) {
  return {
    resourceType: 'Account',
    id: account.accountId,
    status: account.isActive ? 'active' : 'inactive',
    name: account.name,
    type: { text: account.type },
    balance: { value: account.balance, currency: 'EUR' },
  };
}

export function toFhirInvoice(bill: VendorBill | CustomerReceivable) {
  const isPayable = 'billId' in bill;
  return {
    resourceType: 'Invoice',
    id: isPayable ? bill.billId : bill.receivableId,
    status: bill.status,
    totalNet: { value: isPayable ? bill.amount : bill.amount, currency: 'EUR' },
    date: isPayable ? bill.dueDate : bill.dueDate,
    issuer: isPayable ? { display: bill.vendorName } : { display: bill.customerName },
  };
}

export function toFhirChargeItem(journal: JournalEntry) {
  return {
    resourceType: 'ChargeItem',
    id: journal.journalId,
    status: journal.status === 'posted' ? 'billable' : 'planned',
    code: { text: journal.description },
    occurrenceDateTime: journal.entryDate,
  };
}
