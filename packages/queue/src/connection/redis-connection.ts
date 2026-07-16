import { URL } from 'node:url';

import type { ConnectionOptions } from 'bullmq';

export function parseRedisUrl(redisUrl: string): ConnectionOptions {
  const parsed = new URL(redisUrl);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    maxRetriesPerRequest: null,
  };
}
