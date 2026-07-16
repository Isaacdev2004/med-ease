import http from 'node:http';

import Redis from 'ioredis';

import { ALL_QUEUE_NAMES } from '@medease/queue';

import type { QueueRegistry } from '../framework/queue-registry.js';
import type { MetricsCollector } from '../metrics/metrics-collector.js';
import { collectAllQueueDashboards, summarizeQueueHealth } from '../monitoring/queue-monitor.js';
import { getWorkerVersion } from '../version.js';
import type { WorkerConfig } from '../config.js';

export function createHealthServer(
  config: WorkerConfig,
  registry: QueueRegistry,
  metrics: MetricsCollector,
) {
  return http.createServer(async (req, res) => {
    const url = req.url?.split('?')[0] ?? '/';

    if (url === '/healthz') {
      const redis = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 5_000,
        lazyConnect: true,
      });

      try {
        await redis.connect();
        const pong = await redis.ping();
        const ok = pong === 'PONG';
        metrics.setDependencyHealth('redis', ok);
        res.writeHead(ok ? 200 : 503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: ok ? 'ok' : 'error',
            service: config.serviceName,
            redis: pong,
            queuesRegistered: registry.getRegisteredQueues().length,
          }),
        );
      } catch (error) {
        metrics.setDependencyHealth('redis', false);
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'error',
            service: config.serviceName,
            message: error instanceof Error ? error.message : 'Redis unreachable',
          }),
        );
      } finally {
        redis.disconnect();
      }
      return;
    }

    if (url === '/healthz/ready') {
      try {
        const depths = await collectAllQueueDashboards(
          registry.getRegisteredQueues(),
          getWorkerVersion(),
        );
        for (const row of depths) {
          metrics.setQueueDepth(row.queue, 'waiting', row.waiting);
          metrics.setQueueDepth(row.queue, 'active', row.active);
          metrics.setQueueDepth(row.queue, 'delayed', row.delayed);
          metrics.setQueueDepth(row.queue, 'failed', row.failed);
          metrics.setQueueDepth(row.queue, 'dlq', row.dlqWaiting);
        }
        const summary = summarizeQueueHealth(depths);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'ok',
            service: config.serviceName,
            queues: depths,
            summary,
          }),
        );
      } catch (error) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'error',
            service: config.serviceName,
            message: error instanceof Error ? error.message : 'Queue monitoring failed',
          }),
        );
      }
      return;
    }

    if (url === '/metrics') {
      res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' });
      res.end(await metrics.renderPrometheus());
      return;
    }

    if (url === '/queues') {
      try {
        const depths = await collectAllQueueDashboards(
          registry.getRegisteredQueues(),
          getWorkerVersion(),
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            service: config.serviceName,
            workerVersion: getWorkerVersion(),
            metrics: metrics.allSnapshots(ALL_QUEUE_NAMES),
            queues: depths,
          }),
        );
      } catch (error) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'error',
            message: error instanceof Error ? error.message : 'Queue stats unavailable',
          }),
        );
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'not_found' }));
  });
}
