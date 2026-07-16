import { z } from 'zod';

export const observabilityConfigSchema = z.object({
  OTEL_ENABLED: z
    .union([z.literal('true'), z.literal('false')])
    .default('true')
    .transform((value) => value === 'true'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().default('http://localhost:4318'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).optional(),
  APP_VERSION: z.string().optional(),
  GIT_COMMIT: z.string().optional(),
  BUILD_TIMESTAMP: z.string().optional(),
  SCHEMA_VERSION: z.string().default('foundation'),
  MIGRATION_VERSION: z.string().default('20260716000000_foundation'),
});

export type ObservabilityConfig = z.infer<typeof observabilityConfigSchema>;
