import { createEnvelope, PLATFORM_TENANT_ID, QUEUE_NAMES } from '@medease/queue';
import type { Logger } from '@medease/logger';

import type { QueueRegistry } from '../framework/queue-registry.js';

/**
 * Registers platform maintenance schedules (stubs — no domain cron yet).
 * Pattern: Scheduler → Queue → Processor
 */
export async function registerPlatformSchedules(registry: QueueRegistry, logger: Logger) {
  const scheduler = registry.getScheduler();

  const maintenanceEnvelope = createEnvelope({
    tenantId: PLATFORM_TENANT_ID,
    source: 'platform-scheduler',
    eventType: 'maintenance.noop',
    payload: { description: 'Platform scheduler heartbeat' },
  });

  await scheduler.scheduleRepeat(QUEUE_NAMES.SCHEDULED, maintenanceEnvelope, {
    cron: '0 3 * * *',
    jobId: 'platform:maintenance:noop',
    tz: 'UTC',
  });

  logger.info({ cron: '0 3 * * *', queue: QUEUE_NAMES.SCHEDULED }, 'Platform scheduler registered');
}
