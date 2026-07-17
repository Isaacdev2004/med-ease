import type { RequestContext } from '@medease/observability';

import { Prisma, type PrismaClient } from '../generated/client';
import { runInTransaction, type TransactionClient } from './transaction';

export interface PrismaRequestContextInput {
  tenantId: string;
  facilityId?: string;
  userId?: string;
  role?: string;
}

export function toPrismaRequestContext(
  context: RequestContext | undefined,
): PrismaRequestContextInput | null {
  if (!context?.tenantId) {
    return null;
  }

  return {
    tenantId: context.tenantId,
    facilityId: context.facilityId,
    userId: context.userId,
    role: context.roles[0],
  };
}

export async function applyPrismaRequestContext(
  client: PrismaClient | TransactionClient,
  input: PrismaRequestContextInput,
): Promise<void> {
  await client.$executeRaw(
    Prisma.sql`
      SELECT platform.set_request_context(
        ${input.tenantId}::uuid,
        ${input.facilityId ?? null}::uuid,
        ${input.userId ?? null}::uuid,
        ${input.role ?? null},
        NULL::uuid
      )
    `,
  );
}

export async function applySystemRequestContext(
  client: PrismaClient | TransactionClient,
): Promise<void> {
  await client.$executeRaw(
    Prisma.sql`SELECT platform.set_system_request_context()`,
  );
}

export async function clearPrismaRequestContext(
  client: PrismaClient | TransactionClient,
): Promise<void> {
  await client.$executeRaw(Prisma.sql`SELECT platform.clear_request_context()`);
}

async function runInContextTransaction<T>(
  prisma: PrismaClient,
  applyContext: (client: TransactionClient) => Promise<void>,
  fn: (tx: TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(
    async (tx) => {
      await applyContext(tx);

      try {
        return await fn(tx);
      } finally {
        await clearPrismaRequestContext(tx);
      }
    },
    { timeout: 60_000 },
  );
}

export async function runInTransactionWithRequestContext<T>(
  prisma: PrismaClient,
  context: RequestContext | undefined,
  fn: (tx: TransactionClient) => Promise<T>,
): Promise<T> {
  const prismaContext = toPrismaRequestContext(context);

  if (!prismaContext) {
    return runInTransaction(prisma, fn);
  }

  return runInContextTransaction(
    prisma,
    (tx) => applyPrismaRequestContext(tx, prismaContext),
    fn,
  );
}

export async function runInSystemTransaction<T>(
  prisma: PrismaClient,
  fn: (tx: TransactionClient) => Promise<T>,
): Promise<T> {
  return runInContextTransaction(prisma, applySystemRequestContext, fn);
}
