import { WORKER_SERVICE_NAME } from '@medease/constants';
import { ALL_QUEUE_NAMES } from '@medease/queue';
import { createLogger } from '@medease/logger';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export function loadWorkerConfig() {
  return {
    port: Number(optional('PORT', '3001')),
    nodeEnv: optional('NODE_ENV', 'development'),
    redisUrl: required('REDIS_URL'),
    concurrency: Number(optional('WORKER_CONCURRENCY', '5')),
    serviceName: WORKER_SERVICE_NAME,
    queueNames: ALL_QUEUE_NAMES,
  };
}

export function createWorkerLogger(nodeEnv: string) {
  return createLogger({ service: WORKER_SERVICE_NAME, nodeEnv });
}

export type WorkerConfig = ReturnType<typeof loadWorkerConfig>;
