import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

const PERIOD_2026_Q3 = '01930000-0000-7000-8000-000000001601';
const ACC_CASH = '01930000-0000-7000-8000-000000001611';
const ACC_AR = '01930000-0000-7000-8000-000000001612';
const ACC_AP = '01930000-0000-7000-8000-000000001613';
const ACC_EQUITY = '01930000-0000-7000-8000-000000001614';
const ACC_REVENUE = '01930000-0000-7000-8000-000000001615';
const ACC_EXPENSE = '01930000-0000-7000-8000-000000001616';
const JOURNAL_1 = '01930000-0000-7000-8000-000000001621';
const LINE_DR = '01930000-0000-7000-8000-000000001631';
const LINE_CR = '01930000-0000-7000-8000-000000001632';

export const financeSeed: SeedModule = {
  name: 'finance',
  async run(ctx) {
    if (ctx.dryRun) return;

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const now = new Date();

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        await tx.fiscalPeriod.upsert({
          where: { id: PERIOD_2026_Q3 },
          create: {
            id: PERIOD_2026_Q3,
            tenantId: DEMO_TENANT_ID,
            name: 'FY2026 Q3',
            startDate: new Date('2026-07-01'),
            endDate: new Date('2026-09-30'),
            status: 'open',
            fiscalYear: 2026,
          },
          update: { status: 'open' },
        });

        const accounts = [
          {
            id: ACC_CASH,
            code: '1000',
            name: 'Cash and Bank',
            type: 'asset' as const,
            balanceCents: 12500000n,
          },
          {
            id: ACC_AR,
            code: '1100',
            name: 'Accounts Receivable',
            type: 'asset' as const,
            balanceCents: 3200000n,
          },
          {
            id: ACC_AP,
            code: '2000',
            name: 'Accounts Payable',
            type: 'liability' as const,
            balanceCents: 1800000n,
          },
          {
            id: ACC_EQUITY,
            code: '3000',
            name: 'Retained Earnings',
            type: 'equity' as const,
            balanceCents: 8900000n,
          },
          {
            id: ACC_REVENUE,
            code: '4000',
            name: 'Patient Service Revenue',
            type: 'revenue' as const,
            balanceCents: 4500000n,
          },
          {
            id: ACC_EXPENSE,
            code: '5000',
            name: 'Medical Supplies Expense',
            type: 'expense' as const,
            balanceCents: 950000n,
          },
        ];

        for (const a of accounts) {
          await tx.chartOfAccount.upsert({
            where: { id: a.id },
            create: {
              id: a.id,
              tenantId: DEMO_TENANT_ID,
              code: a.code,
              name: a.name,
              type: a.type,
              facilityId: DEMO_FACILITY_PARIS,
              balanceCents: a.balanceCents,
              isActive: true,
            },
            update: {
              name: a.name,
              balanceCents: a.balanceCents,
              isActive: true,
            },
          });
        }

        await tx.journalEntry.upsert({
          where: { id: JOURNAL_1 },
          create: {
            id: JOURNAL_1,
            tenantId: DEMO_TENANT_ID,
            entryNumber: 'JE-2026-SEED-001',
            description: 'Seeded supplies accrual',
            entryDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            fiscalPeriodId: PERIOD_2026_Q3,
            status: 'posted',
            totalDebitCents: 95000n,
            totalCreditCents: 95000n,
            facilityId: DEMO_FACILITY_PARIS,
            sourceModule: 'seed',
            postedAt: now,
            createdBy: DEMO_ADMIN_ID,
            lines: {
              create: [
                {
                  id: LINE_DR,
                  tenantId: DEMO_TENANT_ID,
                  accountId: ACC_EXPENSE,
                  debitCents: 95000n,
                  creditCents: 0n,
                  description: 'Medical supplies',
                  sortOrder: 0,
                },
                {
                  id: LINE_CR,
                  tenantId: DEMO_TENANT_ID,
                  accountId: ACC_AP,
                  debitCents: 0n,
                  creditCents: 95000n,
                  description: 'Accrued vendor liability',
                  sortOrder: 1,
                },
              ],
            },
          },
          update: {
            status: 'posted',
            description: 'Seeded supplies accrual',
            updatedBy: DEMO_ADMIN_ID,
          },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
