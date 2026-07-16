import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { getRequestContext } from '@medease/observability';

import { PrismaClient } from './generated/client';
import { runInSystemTransaction as runWithSystemContext, runInTransactionWithRequestContext } from './helpers/request-context';
import { runInTransaction, type TransactionClient } from './helpers/transaction';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /** Runs a transaction with platform.set_request_context when tenant context is present. */
  runInTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return runInTransactionWithRequestContext(this, getRequestContext(), fn);
  }

  /** Runs a transaction with platform.set_system_request_context (login, seed, migrations). */
  runInSystemTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return runWithSystemContext(this, fn);
  }

  /** @deprecated Prefer runInTransaction for tenant-aware database access. */
  runInBareTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return runInTransaction(this, fn);
  }
}
