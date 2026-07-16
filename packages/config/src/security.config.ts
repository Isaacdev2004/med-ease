import { z } from 'zod';

export const securityConfigSchema = z.object({
  CORS_ORIGIN: z.string().default('*'),
  HELMET_ENABLED: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
});

export type SecurityConfig = z.infer<typeof securityConfigSchema>;

export function parseSecurityConfig(env: NodeJS.ProcessEnv): SecurityConfig {
  return securityConfigSchema.parse(env);
}
