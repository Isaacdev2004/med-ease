import { z } from 'zod';

export const databaseConfigSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .refine((value) => value.startsWith('postgresql://') || value.startsWith('postgres://'), {
      message: 'DATABASE_URL must be a PostgreSQL connection string',
    }),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

export function parseDatabaseConfig(env: NodeJS.ProcessEnv): DatabaseConfig {
  return databaseConfigSchema.parse(env);
}
