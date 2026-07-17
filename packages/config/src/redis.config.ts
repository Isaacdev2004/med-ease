import { z } from 'zod';

export const redisConfigSchema = z.object({
  REDIS_URL: z
    .string()
    .min(1)
    .refine(
      (value) => value.startsWith('redis://') || value.startsWith('rediss://'),
      {
        message: 'REDIS_URL must be a Redis connection string',
      },
    ),
});

export type RedisConfig = z.infer<typeof redisConfigSchema>;

export function parseRedisConfig(env: NodeJS.ProcessEnv): RedisConfig {
  return redisConfigSchema.parse(env);
}
