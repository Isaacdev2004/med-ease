import { Injectable } from '@nestjs/common';
import type { CreateJournalInput, FinanceFilters } from '@medease/finance-contract';
import { FinanceRepository } from './finance.repository';

@Injectable()
export class FinanceService {
  constructor(private readonly repository: FinanceRepository) {}
  getChartOfAccounts(filters?: FinanceFilters) {
    return this.repository.getChartOfAccounts(filters);
  }
  getJournalEntries(filters?: FinanceFilters) {
    return this.repository.getJournalEntries(filters);
  }
  getJournal(journalId: string) {
    return this.repository.getJournal(journalId);
  }
  getLedger(filters?: FinanceFilters) {
    return this.repository.getLedger(filters);
  }
  getTrialBalance(facilityId?: string) {
    return this.repository.getTrialBalance(facilityId);
  }
  getFiscalPeriods() {
    return this.repository.getFiscalPeriods();
  }
  createJournal(input: CreateJournalInput) {
    return this.repository.createJournal(input);
  }
  approveJournal(journalId: string) {
    return this.repository.approveJournal(journalId);
  }
  postJournal(journalId: string) {
    return this.repository.postJournal(journalId);
  }
  getDashboard(facilityId?: string) {
    return this.repository.getDashboard(facilityId);
  }
}
