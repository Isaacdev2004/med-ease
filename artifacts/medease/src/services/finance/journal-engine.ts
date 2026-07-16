import type { JournalEntry, JournalLine } from '@/services/finance/types';

export function validateDoubleEntry(lines: JournalLine[]): { valid: boolean; totalDebit: number; totalCredit: number; error?: string } {
  const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return { valid: false, totalDebit, totalCredit, error: 'Debits must equal credits' };
  }
  if (totalDebit === 0) return { valid: false, totalDebit, totalCredit, error: 'Journal must have amounts' };
  return { valid: true, totalDebit, totalCredit };
}

export function canPostJournal(journal: JournalEntry): boolean {
  return journal.status === 'pending_approval' || journal.status === 'draft';
}

export function canReverseJournal(journal: JournalEntry): boolean {
  return journal.status === 'posted';
}

export function buildReversalEntry(journal: JournalEntry): Omit<JournalEntry, 'journalId' | 'entryNumber'> {
  return {
    description: `Reversal of ${journal.entryNumber}`,
    entryDate: new Date().toISOString().split('T')[0]!,
    fiscalPeriodId: journal.fiscalPeriodId,
    status: 'draft',
    lines: journal.lines.map((l) => ({ ...l, lineId: `rev-${l.lineId}`, debit: l.credit, credit: l.debit })),
    totalDebit: journal.totalCredit,
    totalCredit: journal.totalDebit,
    facilityId: journal.facilityId,
    createdBy: journal.createdBy,
    sourceModule: journal.sourceModule,
    sourceRef: journal.journalId,
  };
}

export function calculateAccountBalance(lines: JournalLine[], accountId: string): number {
  return lines.reduce((bal, l) => {
    if (l.accountId !== accountId) return bal;
    return bal + l.debit - l.credit;
  }, 0);
}
