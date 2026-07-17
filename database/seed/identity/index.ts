import { hashPassword } from '@medease/auth';

import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ORG_ID = '01930000-0000-7000-8000-000000000002';

const demoUsers = [
  {
    id: '01930000-0000-7000-8000-000000000101',
    email: 'admin@medease.health',
    fullName: 'System Administrator',
    role: 'platform_admin' as const,
  },
  {
    id: '01930000-0000-7000-8000-000000000102',
    email: 'facility@medease.health',
    fullName: 'Robert Vance',
    role: 'facility_admin' as const,
  },
  {
    id: '01930000-0000-7000-8000-000000000103',
    email: 'doctor@medease.health',
    fullName: 'Dr. Emily Chen',
    role: 'physician' as const,
  },
  {
    id: '01930000-0000-7000-8000-000000000104',
    email: 'pharmacy@medease.health',
    fullName: 'David Chen, PharmD',
    role: 'pharmacist' as const,
  },
  {
    id: '01930000-0000-7000-8000-000000000105',
    email: 'transport@medease.health',
    fullName: 'Dispatch Unit A',
    role: 'transport_dispatcher' as const,
  },
  {
    id: '01930000-0000-7000-8000-000000000106',
    email: 'patient@medease.health',
    fullName: 'Sarah Jenkins',
    role: 'patient' as const,
  },
];

/** Identity/IAM seeds — demo auth users for E2-01. */
export const identitySeed: SeedModule = {
  name: 'identity',
  async run(ctx) {
    if (ctx.dryRun) {
      return;
    }

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const passwordHash = await hashPassword('demo');

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        await tx.tenant.upsert({
          where: { id: DEMO_TENANT_ID },
          create: {
            id: DEMO_TENANT_ID,
            name: "Med'ease Network",
            slug: 'medease-network',
          },
          update: {},
        });

        await tx.organization.upsert({
          where: { id: DEMO_ORG_ID },
          create: {
            id: DEMO_ORG_ID,
            tenantId: DEMO_TENANT_ID,
            name: "Med'ease Network",
            slug: 'medease-network',
          },
          update: {},
        });

        for (const user of demoUsers) {
          await tx.user.upsert({
            where: {
              tenantId_email: { tenantId: DEMO_TENANT_ID, email: user.email },
            },
            create: {
              id: user.id,
              tenantId: DEMO_TENANT_ID,
              organizationId: DEMO_ORG_ID,
              email: user.email,
              passwordHash,
              fullName: user.fullName,
              role: user.role,
              locale: 'en-US',
              timezone: 'America/New_York',
            },
            update: {
              passwordHash,
              fullName: user.fullName,
              role: user.role,
            },
          });
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
