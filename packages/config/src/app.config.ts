import { z } from 'zod';

export const appConfigSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default('api'),
  CORS_ORIGIN: z.string().default('*'),
  /** Public frontend URL used in invite links and transactional email. */
  APP_PUBLIC_URL: z.string().url().optional(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function parseAppConfig(env: NodeJS.ProcessEnv): AppConfig {
  return appConfigSchema.parse(env);
}
