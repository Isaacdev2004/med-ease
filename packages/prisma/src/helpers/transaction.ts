import type { PrismaClient } from '../generated/client';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;

export async function runInTransaction<T>(
  prisma: PrismaClient,
  fn: (tx: TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction((tx) => fn(tx));
}

export type { TransactionClient };
