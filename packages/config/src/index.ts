import { z } from 'zod';

import { appConfigSchema } from './app.config';
import { authConfigSchema } from './auth.config';
import { databaseConfigSchema } from './database.config';
import { mailConfigSchema } from './mail.config';
import { observabilityConfigSchema } from './observability.config';
import { queueConfigSchema } from './queue.config';
import { redisConfigSchema } from './redis.config';
import { securityConfigSchema } from './security.config';
import { supabaseConfigSchema } from './supabase.config';

export { supabaseConfigSchema, parseSupabaseConfig } from './supabase.config';
export { pgClientOptions, type PgClientOptions } from './postgres-client';
export {
  storageConfigSchema,
  parseStorageConfig,
  type StorageConfig,
} from './storage.config';

export const opensearchConfigSchema = z.object({
  OPENSEARCH_URL: z.string().url().optional(),
});

export type OpenSearchConfig = z.infer<typeof opensearchConfigSchema>;

export function parseOpenSearchConfig(
  env: NodeJS.ProcessEnv,
): OpenSearchConfig {
  return opensearchConfigSchema.parse(env);
}

export const medeaseEnvSchema = appConfigSchema
  .merge(databaseConfigSchema)
  .merge(redisConfigSchema)
  .merge(supabaseConfigSchema)
  .merge(securityConfigSchema)
  .merge(authConfigSchema)
  .merge(queueConfigSchema)
  .merge(mailConfigSchema)
  .merge(opensearchConfigSchema)
  .merge(observabilityConfigSchema);

export type MedeaseEnv = z.infer<typeof medeaseEnvSchema>;

export interface MedeaseConfig {
  app: {
    nodeEnv: MedeaseEnv['NODE_ENV'];
    port: MedeaseEnv['PORT'];
    apiPrefix: MedeaseEnv['API_PREFIX'];
    corsOrigin: MedeaseEnv['CORS_ORIGIN'];
  };
  database: {
    url: MedeaseEnv['DATABASE_URL'];
    directUrl?: MedeaseEnv['DIRECT_URL'];
  };
  redis: {
    url: MedeaseEnv['REDIS_URL'];
  };
  supabase: {
    url: MedeaseEnv['SUPABASE_URL'];
    anonKey: MedeaseEnv['SUPABASE_ANON_KEY'];
    serviceRoleKey: MedeaseEnv['SUPABASE_SERVICE_ROLE_KEY'];
    bucketDocuments: MedeaseEnv['SUPABASE_STORAGE_BUCKET_DOCUMENTS'];
    bucketExports: MedeaseEnv['SUPABASE_STORAGE_BUCKET_EXPORTS'];
  };
  security: {
    corsOrigin: MedeaseEnv['CORS_ORIGIN'];
    helmetEnabled: MedeaseEnv['HELMET_ENABLED'];
  };
  auth: {
    jwtSecret: MedeaseEnv['JWT_SECRET'];
    accessExpiry: MedeaseEnv['JWT_ACCESS_EXPIRY'];
    refreshExpiry: MedeaseEnv['JWT_REFRESH_EXPIRY'];
    refreshRememberExpiry: MedeaseEnv['JWT_REFRESH_REMEMBER_EXPIRY'];
    maxFailedAttempts: MedeaseEnv['AUTH_MAX_FAILED_ATTEMPTS'];
    lockoutMinutes: MedeaseEnv['AUTH_LOCKOUT_MINUTES'];
    cookieSecure: MedeaseEnv['AUTH_COOKIE_SECURE'];
    cookieDomain?: MedeaseEnv['AUTH_COOKIE_DOMAIN'];
  };
  queue: {
    redisUrl: MedeaseEnv['REDIS_URL'];
    workerQueueName: MedeaseEnv['WORKER_QUEUE_NAME'];
  };
  mail: {
    host: MedeaseEnv['MAIL_HOST'];
    port: MedeaseEnv['MAIL_PORT'];
    from: MedeaseEnv['MAIL_FROM'];
  };
  opensearch?: {
    url: NonNullable<MedeaseEnv['OPENSEARCH_URL']>;
  };
  observability: {
    otelEnabled: MedeaseEnv['OTEL_ENABLED'];
    otlpEndpoint: MedeaseEnv['OTEL_EXPORTER_OTLP_ENDPOINT'];
    logLevel?: MedeaseEnv['LOG_LEVEL'];
    appVersion?: MedeaseEnv['APP_VERSION'];
    gitCommit?: MedeaseEnv['GIT_COMMIT'];
    buildTimestamp?: MedeaseEnv['BUILD_TIMESTAMP'];
    schemaVersion: MedeaseEnv['SCHEMA_VERSION'];
    migrationVersion: MedeaseEnv['MIGRATION_VERSION'];
  };
}

export function validateConfig(env: Record<string, unknown>): MedeaseEnv {
  const parsed = medeaseEnvSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Configuration validation failed: ${details}`);
  }
  return parsed.data;
}

export function loadConfig(
  env: NodeJS.ProcessEnv = process.env,
): MedeaseConfig {
  const validated = validateConfig(env);

  return {
    app: {
      nodeEnv: validated.NODE_ENV,
      port: validated.PORT,
      apiPrefix: validated.API_PREFIX,
      corsOrigin: validated.CORS_ORIGIN,
    },
    database: {
      url: validated.DATABASE_URL,
      directUrl: validated.DIRECT_URL,
    },
    redis: {
      url: validated.REDIS_URL,
    },
    supabase: {
      url: validated.SUPABASE_URL,
      anonKey: validated.SUPABASE_ANON_KEY,
      serviceRoleKey: validated.SUPABASE_SERVICE_ROLE_KEY,
      bucketDocuments: validated.SUPABASE_STORAGE_BUCKET_DOCUMENTS,
      bucketExports: validated.SUPABASE_STORAGE_BUCKET_EXPORTS,
    },
    security: {
      corsOrigin: validated.CORS_ORIGIN,
      helmetEnabled: validated.HELMET_ENABLED,
    },
    auth: {
      jwtSecret: validated.JWT_SECRET,
      accessExpiry: validated.JWT_ACCESS_EXPIRY,
      refreshExpiry: validated.JWT_REFRESH_EXPIRY,
      refreshRememberExpiry: validated.JWT_REFRESH_REMEMBER_EXPIRY,
      maxFailedAttempts: validated.AUTH_MAX_FAILED_ATTEMPTS,
      lockoutMinutes: validated.AUTH_LOCKOUT_MINUTES,
      cookieSecure: validated.AUTH_COOKIE_SECURE,
      cookieDomain: validated.AUTH_COOKIE_DOMAIN,
    },
    queue: {
      redisUrl: validated.REDIS_URL,
      workerQueueName: validated.WORKER_QUEUE_NAME,
    },
    mail: {
      host: validated.MAIL_HOST,
      port: validated.MAIL_PORT,
      from: validated.MAIL_FROM,
    },
    opensearch: validated.OPENSEARCH_URL
      ? { url: validated.OPENSEARCH_URL }
      : undefined,
    observability: {
      otelEnabled: validated.OTEL_ENABLED,
      otlpEndpoint: validated.OTEL_EXPORTER_OTLP_ENDPOINT,
      logLevel: validated.LOG_LEVEL,
      appVersion: validated.APP_VERSION,
      gitCommit: validated.GIT_COMMIT,
      buildTimestamp: validated.BUILD_TIMESTAMP,
      schemaVersion: validated.SCHEMA_VERSION,
      migrationVersion: validated.MIGRATION_VERSION,
    },
  };
}
