import { Injectable } from '@nestjs/common';
import type {
  ChartOfAccount,
  CreateJournalInput,
  FinanceDashboard,
  FinanceFilters,
  FinanceRepositoryContract,
  FiscalPeriod,
  JournalEntry,
  JournalLine,
  JournalListResult,
  TrialBalanceLine,
} from '@medease/finance-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';
import { NotFoundError, ValidationError } from '@workspace/repository-transport/errors';
import { RequestContextService } from '../tenant/request-context.service';

const INCLUDE = { lines: { include: { account: true } }, fiscalPeriod: true } as const;

function toCents(n: number) {
  return BigInt(Math.round(n * 100));
}
function fromCents(c: bigint | number) {
  return Number(c) / 100;
}

@Injectable()
export class FinanceRepository
  extends TenantAwareRepository
  implements FinanceRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  private actorId() {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }

  private mapJournal(row: {
    id: string;
    entryNumber: string;
    description: string;
    entryDate: Date;
    fiscalPeriodId: string;
    status: string;
    totalDebitCents: bigint;
    totalCreditCents: bigint;
    facilityId: string | null;
    createdBy: string;
    postedAt: Date | null;
    sourceModule: string | null;
    sourceRef: string | null;
    lines: Array<{
      id: string;
      accountId: string;
      debitCents: bigint;
      creditCents: bigint;
      description: string | null;
      account: { code: string; name: string };
    }>;
  }): JournalEntry {
    return {
      journalId: row.id,
      entryNumber: row.entryNumber,
      description: row.description,
      entryDate: row.entryDate.toISOString().slice(0, 10),
      fiscalPeriodId: row.fiscalPeriodId,
      status: row.status as JournalEntry['status'],
      lines: row.lines.map((l) => ({
        lineId: l.id,
        accountId: l.accountId,
        accountCode: l.account.code,
        accountName: l.account.name,
        debit: fromCents(l.debitCents),
        credit: fromCents(l.creditCents),
        description: l.description ?? undefined,
      })),
      totalDebit: fromCents(row.totalDebitCents),
      totalCredit: fromCents(row.totalCreditCents),
      facilityId: row.facilityId ?? undefined,
      createdBy: row.createdBy,
      postedAt: row.postedAt?.toISOString(),
      sourceModule: row.sourceModule ?? undefined,
      sourceRef: row.sourceRef ?? undefined,
    };
  }

  getChartOfAccounts(filters: FinanceFilters = {}): Promise<ChartOfAccount[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.chartOfAccount.findMany({
        where: {
          tenantId: this.tenantId,
          ...(filters.accountType ? { type: filters.accountType } : {}),
          ...(filters.facilityId ? { facilityId: filters.facilityId } : {}),
          ...(filters.q
            ? {
                OR: [
                  { code: { contains: filters.q, mode: 'insensitive' } },
                  { name: { contains: filters.q, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: [{ code: 'asc' }],
      });
      return rows.map((r) => ({
        accountId: r.id,
        code: r.code,
        name: r.name,
        type: r.type as ChartOfAccount['type'],
        parentId: r.parentId ?? undefined,
        facilityId: r.facilityId ?? undefined,
        balance: fromCents(r.balanceCents),
        isActive: r.isActive,
      }));
    });
  }

  getJournalEntries(filters: FinanceFilters = {}): Promise<JournalListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    return this.prisma.runInTransaction(async (tx) => {
      const where = {
        tenantId: this.tenantId,
        ...(filters.status ? { status: filters.status as never } : {}),
        ...(filters.fiscalPeriodId
          ? { fiscalPeriodId: filters.fiscalPeriodId }
          : {}),
        ...(filters.facilityId ? { facilityId: filters.facilityId } : {}),
        ...(filters.q
          ? {
              OR: [
                { entryNumber: { contains: filters.q, mode: 'insensitive' as const } },
                { description: { contains: filters.q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      };
      const [items, total] = await Promise.all([
        tx.journalEntry.findMany({
          where,
          include: INCLUDE,
          skip,
          take,
          orderBy: [{ entryDate: 'desc' }],
        }),
        tx.journalEntry.count({ where }),
      ]);
      const mapped = items.map((r) => this.mapJournal(r));
      return toPaginatedResult(mapped, total, page, pageSize);
    });
  }

  async getJournal(journalId: string): Promise<JournalEntry> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.journalEntry.findFirst({
        where: { id: journalId, tenantId: this.tenantId },
        include: INCLUDE,
      });
      if (!row) throw new NotFoundError('Journal entry not found');
      return this.mapJournal(row);
    });
  }

  getLedger(filters: FinanceFilters = {}): Promise<JournalLine[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const lines = await tx.journalLine.findMany({
        where: {
          tenantId: this.tenantId,
          ...(filters.accountId ? { accountId: filters.accountId } : {}),
          journal: {
            status: 'posted',
            ...(filters.fiscalPeriodId
              ? { fiscalPeriodId: filters.fiscalPeriodId }
              : {}),
          },
        },
        include: { account: true },
        orderBy: [{ journalId: 'desc' }],
        take: 200,
      });
      return lines.map((l) => ({
        lineId: l.id,
        accountId: l.accountId,
        accountCode: l.account.code,
        accountName: l.account.name,
        debit: fromCents(l.debitCents),
        credit: fromCents(l.creditCents),
        description: l.description ?? undefined,
      }));
    });
  }

  getTrialBalance(facilityId?: string): Promise<TrialBalanceLine[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const accounts = await tx.chartOfAccount.findMany({
        where: {
          tenantId: this.tenantId,
          isActive: true,
          ...(facilityId ? { facilityId } : {}),
        },
        orderBy: [{ code: 'asc' }],
      });
      return accounts.map((a) => {
        const bal = fromCents(a.balanceCents);
        return {
          accountId: a.id,
          accountCode: a.code,
          accountName: a.name,
          accountType: a.type as TrialBalanceLine['accountType'],
          debit: a.type === 'asset' || a.type === 'expense' ? Math.max(0, bal) : 0,
          credit:
            a.type === 'liability' || a.type === 'equity' || a.type === 'revenue'
              ? Math.max(0, bal)
              : 0,
          balance: bal,
        };
      });
    });
  }

  getFiscalPeriods(): Promise<FiscalPeriod[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.fiscalPeriod.findMany({
        where: { tenantId: this.tenantId },
        orderBy: [{ fiscalYear: 'desc' }, { startDate: 'desc' }],
      });
      return rows.map((r) => ({
        periodId: r.id,
        name: r.name,
        startDate: r.startDate.toISOString().slice(0, 10),
        endDate: r.endDate.toISOString().slice(0, 10),
        status: r.status as FiscalPeriod['status'],
        fiscalYear: r.fiscalYear,
      }));
    });
  }

  async createJournal(input: CreateJournalInput): Promise<JournalEntry> {
    if (!input.lines.length) throw new ValidationError('At least one line is required');
    const debit = input.lines.reduce((s, l) => s + l.debit, 0);
    const credit = input.lines.reduce((s, l) => s + l.credit, 0);
    if (Math.round(debit * 100) !== Math.round(credit * 100)) {
      throw new ValidationError('Journal entry must balance (debits = credits)');
    }
    return this.prisma.runInTransaction(async (tx) => {
      const period = await tx.fiscalPeriod.findFirst({
        where: { id: input.fiscalPeriodId, tenantId: this.tenantId },
      });
      if (!period) throw new NotFoundError('Fiscal period not found');
      if (period.status !== 'open') {
        throw new ValidationError('Fiscal period is not open');
      }
      const id = newId();
      const now = new Date();
      const entryNumber = `JE-${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}-${id.slice(-6).toUpperCase()}`;
      const row = await tx.journalEntry.create({
        data: {
          id,
          tenantId: this.tenantId,
          entryNumber,
          description: input.description,
          entryDate: new Date(input.entryDate),
          fiscalPeriodId: input.fiscalPeriodId,
          status: 'draft',
          totalDebitCents: toCents(debit),
          totalCreditCents: toCents(credit),
          facilityId: input.facilityId,
          sourceModule: input.sourceModule,
          sourceRef: input.sourceRef,
          createdBy: input.createdBy ?? this.actorId(),
          lines: {
            create: input.lines.map((l, i) => ({
              id: newId(),
              tenantId: this.tenantId,
              accountId: l.accountId,
              debitCents: toCents(l.debit),
              creditCents: toCents(l.credit),
              description: l.description,
              sortOrder: i,
            })),
          },
        },
        include: INCLUDE,
      });
      return this.mapJournal(row);
    });
  }

  async approveJournal(journalId: string): Promise<JournalEntry> {
    return this.prisma.runInTransaction(async (tx) => {
      const existing = await tx.journalEntry.findFirst({
        where: { id: journalId, tenantId: this.tenantId },
        include: INCLUDE,
      });
      if (!existing) throw new NotFoundError('Journal entry not found');
      if (existing.status !== 'draft') {
        throw new ValidationError(`Cannot approve journal in status ${existing.status}`);
      }
      const row = await tx.journalEntry.update({
        where: { id: journalId },
        data: { status: 'pending_approval', updatedBy: this.actorId() },
        include: INCLUDE,
      });
      return this.mapJournal(row);
    });
  }

  async postJournal(journalId: string): Promise<JournalEntry> {
    return this.prisma.runInTransaction(async (tx) => {
      const existing = await tx.journalEntry.findFirst({
        where: { id: journalId, tenantId: this.tenantId },
        include: INCLUDE,
      });
      if (!existing) throw new NotFoundError('Journal entry not found');
      if (existing.status !== 'draft' && existing.status !== 'pending_approval') {
        throw new ValidationError(`Cannot post journal in status ${existing.status}`);
      }
      if (existing.fiscalPeriod.status !== 'open') {
        throw new ValidationError('Fiscal period is not open');
      }
      for (const line of existing.lines) {
        const delta = line.debitCents - line.creditCents;
        // Asset/expense increase with debit; liability/equity/revenue increase with credit
        const signed =
          line.account.type === 'asset' || line.account.type === 'expense'
            ? delta
            : -delta;
        await tx.chartOfAccount.update({
          where: { id: line.accountId },
          data: { balanceCents: { increment: signed } },
        });
      }
      const row = await tx.journalEntry.update({
        where: { id: journalId },
        data: {
          status: 'posted',
          postedAt: new Date(),
          updatedBy: this.actorId(),
        },
        include: INCLUDE,
      });
      return this.mapJournal(row);
    });
  }

  getDashboard(facilityId?: string): Promise<FinanceDashboard> {
    return this.prisma.runInTransaction(async (tx) => {
      const accounts = await tx.chartOfAccount.findMany({
        where: {
          tenantId: this.tenantId,
          ...(facilityId ? { facilityId } : {}),
        },
      });
      let revenue = 0;
      let expenses = 0;
      let cashPosition = 0;
      for (const a of accounts) {
        const bal = fromCents(a.balanceCents);
        if (a.type === 'revenue') revenue += bal;
        if (a.type === 'expense') expenses += bal;
        if (a.type === 'asset' && a.code.startsWith('1000')) cashPosition += bal;
      }
      const recent = await tx.journalEntry.findMany({
        where: { tenantId: this.tenantId },
        include: INCLUDE,
        orderBy: [{ createdAt: 'desc' }],
        take: 5,
      });
      const netIncome = revenue - expenses;
      return {
        facilityId,
        revenue,
        expenses,
        grossMargin: revenue > 0 ? Math.round(((revenue - expenses) / revenue) * 100) : 0,
        netIncome,
        cashPosition,
        outstandingAR: 0,
        outstandingAP: 0,
        collectionRate: 0,
        budgetVariance: 0,
        recentJournals: recent.map((r) => this.mapJournal(r)),
        agingAP: [],
        agingAR: [],
      };
    });
  }
}
