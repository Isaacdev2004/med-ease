import { WORKER_SERVICE_NAME } from '@medease/constants';

import { createQueueRegistry } from './framework/queue-registry.js';
import { createHealthServer } from './health/http-server.js';
import { MetricsCollector } from './metrics/metrics-collector.js';
import { allQueueDefinitions } from './queues/index.js';
import { registerPlatformSchedules } from './scheduler/platform-schedules.js';
import { createWorkerLogger, loadWorkerConfig } from './config.js';
import { getWorkerVersion } from './version.js';

export async function bootstrapWorker() {
  const config = loadWorkerConfig();
  const logger = createWorkerLogger(config.nodeEnv);
  const metrics = new MetricsCollector(WORKER_SERVICE_NAME);
  const registry = createQueueRegistry(
    config.redisUrl,
    logger,
    metrics,
    config.concurrency,
  );

  registry.registerAll(allQueueDefinitions);
  await registry.seedBootstrapJobs();
  await registerPlatformSchedules(registry, logger);

  const server = createHealthServer(config, registry, metrics);

  await new Promise<void>((resolve) => {
    server.listen(config.port, () => {
      logger.info(
        {
          port: config.port,
          queues: config.queueNames.length,
          workerVersion: getWorkerVersion(),
          endpoints: ['/healthz', '/healthz/ready', '/metrics', '/queues'],
        },
        'Med-Ease worker platform listening',
      );
      resolve();
    });
  });

  const shutdown = async () => {
    logger.info('Worker shutdown initiated');
    server.close();
    await registry.close();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}
