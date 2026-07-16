import { z } from 'zod';

export const storageConfigSchema = z.object({
  MINIO_ENDPOINT: z.string().min(1),
  MINIO_PORT: z.coerce.number().int().positive().default(9000),
  MINIO_USE_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET_DOCUMENTS: z.string().min(1).default('medease-documents'),
  MINIO_BUCKET_EXPORTS: z.string().min(1).default('medease-exports'),
});

export type StorageConfig = z.infer<typeof storageConfigSchema>;

export function parseStorageConfig(env: NodeJS.ProcessEnv): StorageConfig {
  return storageConfigSchema.parse(env);
}
