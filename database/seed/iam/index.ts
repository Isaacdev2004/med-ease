import type { IdentityRole } from '@medease/auth';

import type { SeedModule } from '../types';

const SYSTEM_ROLE_IDS: Record<IdentityRole, string> = {
  platform_admin: '01930000-0000-7000-8000-000000000201',
  facility_admin: '01930000-0000-7000-8000-000000000202',
  physician: '01930000-0000-7000-8000-000000000203',
  pharmacist: '01930000-0000-7000-8000-000000000204',
  transport_dispatcher: '01930000-0000-7000-8000-000000000205',
  patient: '01930000-0000-7000-8000-000000000206',
};

/** IAM catalog seeds — system roles for E2-06. */
export const iamSeed: SeedModule = {
  name: 'iam',
  async run(ctx) {
    if (ctx.dryRun) {
      return;
    }

    const { PrismaClient, runInSystemTransaction } = await import('@medease/prisma');
    type TransactionClient = Parameters<Parameters<typeof runInSystemTransaction>[1]>[0];
    const prisma = new PrismaClient();

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        for (const [name, id] of Object.entries(SYSTEM_ROLE_IDS) as [IdentityRole, string][]) {
          await tx.iamRoleRecord.upsert({
            where: { id },
            create: {
              id,
              name,
              description: `System role: ${name.replace(/_/g, ' ')}`,
              isSystem: true,
            },
            update: {
              name,
              description: `System role: ${name.replace(/_/g, ' ')}`,
              isSystem: true,
            },
          });
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
