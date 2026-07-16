import { z } from 'zod';

export const queueConfigSchema = z.object({
  REDIS_URL: z
    .string()
    .min(1)
    .refine((value) => value.startsWith('redis://') || value.startsWith('rediss://'), {
      message: 'REDIS_URL must be a Redis connection string',
    }),
  WORKER_QUEUE_NAME: z.string().min(1).default('medease-health-check'),
});

export type QueueConfig = z.infer<typeof queueConfigSchema>;

export function parseQueueConfig(env: NodeJS.ProcessEnv): QueueConfig {
  return queueConfigSchema.parse(env);
}
