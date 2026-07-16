import {
  QUEUE_NAMES,
  type QueueDefinition,
  type QueueJobEnvelope,
  type ProcessorContext,
  type QueueProcessorResult,
} from '@medease/queue';
import type { AuditRecordPayload } from '@medease/audit';
import { PrismaClient, runInSystemTransaction } from '@medease/prisma';

import { persistAuditRecord } from '../audit/audit-writer.js';

const prisma = new PrismaClient();

async function auditProcessor(
  context: ProcessorContext,
  envelope: QueueJobEnvelope<AuditRecordPayload>,
): Promise<QueueProcessorResult> {
  if (context.job.name === 'bootstrap.ping') {
    return {
      processedAt: new Date().toISOString(),
      queue: QUEUE_NAMES.AUDIT,
      jobName: context.job.name ?? envelope.eventType,
      jobId: context.job.id,
      envelopeId: envelope.id,
      correlationId: envelope.correlationId,
    };
  }

  await runInSystemTransaction(prisma, async (tx) => {
    await persistAuditRecord(tx, envelope);
  });

  return {
    processedAt: new Date().toISOString(),
    queue: QUEUE_NAMES.AUDIT,
    jobName: context.job.name ?? envelope.eventType,
    jobId: context.job.id,
    envelopeId: envelope.id,
    correlationId: envelope.correlationId,
  };
}

export const auditQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.AUDIT,
  processor: auditProcessor,
  concurrency: 10,
};
