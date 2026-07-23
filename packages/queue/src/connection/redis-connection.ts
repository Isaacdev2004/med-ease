import { URL } from 'node:url';

import type { ConnectionOptions } from 'bullmq';

export function parseRedisUrl(redisUrl: string): ConnectionOptions {
  const parsed = new URL(redisUrl);
  const options: ConnectionOptions = {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    maxRetriesPerRequest: null,
  };

  if (parsed.username) {
    options.username = decodeURIComponent(parsed.username);
  }

  if (parsed.password) {
    options.password = decodeURIComponent(parsed.password);
  }

  if (parsed.protocol === 'rediss:') {
    options.tls = {};
  }

  return options;
}
