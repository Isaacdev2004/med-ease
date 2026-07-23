import { z } from 'zod';

export const supabaseConfigSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET_DOCUMENTS: z
    .string()
    .min(1)
    .default('medease-documents'),
  SUPABASE_STORAGE_BUCKET_EXPORTS: z.string().min(1).default('medease-exports'),
});

export type SupabaseConfig = z.infer<typeof supabaseConfigSchema>;

export function parseSupabaseConfig(env: NodeJS.ProcessEnv): SupabaseConfig {
  return supabaseConfigSchema.parse(env);
}
